/**
 * MPLADS Insight — Client-side ML Engine
 * Implements: Anomaly Detection, Duplicate Detection,
 *             Delay Risk Prediction, Cost Deviation Analysis
 * All computations run in the browser using pure TypeScript.
 * Trained on SYNTHETIC data — not real operational records.
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AnomalyResult {
  workId: string;
  anomalyScore: number;   // 0-100, higher = more anomalous
  isAnomaly: boolean;
  reasons: string[];
  modelVersion: string;
}

export interface DuplicateCandidate {
  workId1: string;
  workId2: string;
  similarityScore: number;   // 0-1
  reasons: string[];
  distanceKm: number | null;
}

export interface DelayRiskResult {
  workId: string;
  riskProbability: number;  // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  daysAtRisk: number;
  factors: { name: string; contribution: number }[];
}

export interface CostDeviationResult {
  workId: string;
  expectedRateLakh: number;
  actualRateLakh: number;
  deviationPct: number;
  zScore: number;
  isDeviant: boolean;
}

// ─── Statistical helpers ──────────────────────────────────────────────────────
function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}
function std(arr: number[], m = mean(arr)): number {
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}
function zScore(val: number, m: number, s: number): number {
  return s === 0 ? 0 : (val - m) / s;
}
function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Text similarity (TF-IDF cosine) ─────────────────────────────────────────
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !['the','and','for','with','of','in','at','to','a','an'].includes(t));
}
function cosineSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a), setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const denom = Math.sqrt(setA.size) * Math.sqrt(setB.size);
  return denom === 0 ? 0 : intersection / denom;
}

// ─── Isolation Forest (simplified) ───────────────────────────────────────────
// A lightweight implementation using random path-length approximation
class IsolationTree {
  private splitFeature: number = 0;
  private splitValue: number = 0;
  private left: IsolationTree | null = null;
  private right: IsolationTree | null = null;
  private isLeaf: boolean = false;
  private size: number = 0;

  fit(data: number[][], depth = 0, maxDepth = 8): void {
    this.size = data.length;
    if (data.length <= 1 || depth >= maxDepth) { this.isLeaf = true; return; }
    const nFeatures = data[0].length;
    this.splitFeature = Math.floor(Math.random() * nFeatures);
    const col = data.map(r => r[this.splitFeature]);
    const min = Math.min(...col), max = Math.max(...col);
    if (min === max) { this.isLeaf = true; return; }
    this.splitValue = min + Math.random() * (max - min);
    const leftData = data.filter(r => r[this.splitFeature] < this.splitValue);
    const rightData = data.filter(r => r[this.splitFeature] >= this.splitValue);
    this.left = new IsolationTree();
    this.right = new IsolationTree();
    this.left.fit(leftData, depth + 1, maxDepth);
    this.right.fit(rightData, depth + 1, maxDepth);
  }

  pathLength(point: number[], depth = 0): number {
    if (this.isLeaf || !this.left || !this.right) {
      return depth + this.cFactor(this.size);
    }
    if (point[this.splitFeature] < this.splitValue) {
      return this.left.pathLength(point, depth + 1);
    }
    return this.right.pathLength(point, depth + 1);
  }

  private cFactor(n: number): number {
    if (n <= 1) return 0;
    if (n === 2) return 1;
    return 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n;
  }
}

export class IsolationForest {
  private trees: IsolationTree[] = [];
  private nTrees: number;
  private sampleSize: number;

  constructor(nTrees = 50, sampleSize = 32) {
    this.nTrees = nTrees;
    this.sampleSize = sampleSize;
  }

  fit(data: number[][]): void {
    this.trees = [];
    for (let i = 0; i < this.nTrees; i++) {
      const sample = this.randomSample(data, Math.min(this.sampleSize, data.length));
      const tree = new IsolationTree();
      tree.fit(sample);
      this.trees.push(tree);
    }
  }

  score(point: number[]): number {
    if (this.trees.length === 0) return 0;
    const avgPath = this.trees.reduce((s, t) => s + t.pathLength(point), 0) / this.trees.length;
    const c = 2 * (Math.log(this.sampleSize - 1) + 0.5772) - 2 * (this.sampleSize - 1) / this.sampleSize;
    return Math.pow(2, -avgPath / c); // 0 = normal, 1 = very anomalous
  }

  private randomSample<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }
}

// ─── Logistic Regression (manual) ────────────────────────────────────────────
export class LogisticRegression {
  // Pre-fitted weights for delay prediction (trained on synthetic patterns)
  private weights = {
    expenditureRatio:      1.8,   // spent much vs sanctioned
    progressLag:           2.4,   // milestone behind schedule
    daysOverdue:           0.05,  // each day past due
    missingEvidence:       1.2,   // evidence gaps
    revisionCount:         0.7,   // number of revisions
    sectorRisk:            0.6,   // high-risk sector
    agencyTrackRecord:     -0.4,  // good track record
    intercept:             -2.1,
  };

  predict(features: {
    expenditureRatio: number;
    progressLag: number;
    daysOverdue: number;
    missingEvidence: number;
    revisionCount: number;
    sectorRisk: number;
    agencyTrackRecord: number;
  }): number {
    const logit =
      this.weights.intercept +
      this.weights.expenditureRatio * features.expenditureRatio +
      this.weights.progressLag * features.progressLag +
      this.weights.daysOverdue * features.daysOverdue +
      this.weights.missingEvidence * features.missingEvidence +
      this.weights.revisionCount * features.revisionCount +
      this.weights.sectorRisk * features.sectorRisk +
      this.weights.agencyTrackRecord * features.agencyTrackRecord;
    return 1 / (1 + Math.exp(-logit));
  }

  featureImportance(features: Parameters<LogisticRegression['predict']>[0]): { name: string; contribution: number }[] {
    return [
      { name: 'Expenditure vs sanction ratio', contribution: clamp(this.weights.expenditureRatio * features.expenditureRatio / 5) },
      { name: 'Progress behind schedule', contribution: clamp(this.weights.progressLag * features.progressLag / 5) },
      { name: 'Days past completion date', contribution: clamp(this.weights.daysOverdue * features.daysOverdue / 3) },
      { name: 'Missing evidence gaps', contribution: clamp(this.weights.missingEvidence * features.missingEvidence / 3) },
      { name: 'Sanction revisions', contribution: clamp(this.weights.revisionCount * features.revisionCount / 2) },
    ].sort((a, b) => b.contribution - a.contribution);
  }
}

// ─── Main ML Service ──────────────────────────────────────────────────────────
import { Work, SYNTHETIC_WORKS } from './data';

const SECTOR_RISK: Record<string, number> = {
  'Roads': 0.6, 'Water Supply': 0.7, 'Sanitation': 0.65,
  'Community Hall': 0.5, 'Education': 0.45, 'Health': 0.55,
};

const AGENCY_TRACK: Record<string, number> = {
  'Demo PWD Agency A': 0.6, 'Demo Water Board B': 0.3,
  'Demo Education Dept C': 0.8, 'Demo NHM Agency D': 0.75,
  'Demo Municipal E': 0.55, 'Demo ULB Agency F': 0.4,
};

function getDaysOverdue(work: Work): number {
  const today = new Date();
  const due = new Date(work.revisedCompletionDate ?? work.originalCompletionDate);
  if (today <= due || work.status === 'completed') return 0;
  return Math.floor((today.getTime() - due.getTime()) / 86400000);
}

function getProgressLag(work: Work): number {
  const sanctionDate = new Date(work.sanctionDate);
  const dueDate = new Date(work.revisedCompletionDate ?? work.originalCompletionDate);
  const today = new Date();
  const totalDays = (dueDate.getTime() - sanctionDate.getTime()) / 86400000;
  const elapsedDays = (today.getTime() - sanctionDate.getTime()) / 86400000;
  if (totalDays <= 0) return 0;
  const expectedProgress = Math.min(1, elapsedDays / totalDays);
  const actualProgress = work.physicalProgress / 100;
  return Math.max(0, expectedProgress - actualProgress);
}

// ── Run all ML models ─────────────────────────────────────────────────────────
let mlResultsCache: MLResults | null = null;

export interface MLResults {
  anomalies: AnomalyResult[];
  duplicates: DuplicateCandidate[];
  delayRisks: DelayRiskResult[];
  costDeviations: CostDeviationResult[];
  runAt: string;
  modelVersion: string;
}

export function runMLPipeline(works: Work[] = SYNTHETIC_WORKS): MLResults {
  if (mlResultsCache) return mlResultsCache;

  // ── 1. Anomaly Detection (Isolation Forest) ────
  const features = works.map(w => [
    w.expenditureLakh / (w.revisedAmountLakh || 1),
    w.physicalProgress / 100,
    getDaysOverdue(w) / 365,
    w.evidenceCount / 10,
    w.alerts.length / 5,
    getProgressLag(w),
  ]);

  const forest = new IsolationForest(60, 24);
  forest.fit(features);

  const rawScores = features.map(f => forest.score(f));
  const meanScore = mean(rawScores);
  const stdScore = std(rawScores);
  const THRESHOLD = 0.6;

  const anomalies: AnomalyResult[] = works.map((w, i) => {
    const score = rawScores[i];
    const normalised = Math.round(clamp((score - 0.3) / 0.4) * 100);
    const reasons: string[] = [];
    const expenditureRatio = w.expenditureLakh / (w.revisedAmountLakh || 1);
    if (expenditureRatio > 1.05) reasons.push(`Expenditure ${((expenditureRatio - 1) * 100).toFixed(1)}% above approved sanction`);
    if (getProgressLag(w) > 0.25) reasons.push(`Physical progress ${Math.round(getProgressLag(w) * 100)}% behind expected schedule`);
    if (getDaysOverdue(w) > 30) reasons.push(`${getDaysOverdue(w)} days past approved completion date`);
    if (w.missingEvidence) reasons.push('Missing mandatory milestone evidence');
    if (w.alerts.length >= 2) reasons.push(`${w.alerts.length} open risk alerts linked`);
    return { workId: w.id, anomalyScore: normalised, isAnomaly: score >= THRESHOLD, reasons, modelVersion: 'IsoForest-v1.2 (synthetic)' };
  });

  // ── 2. Duplicate Detection ────────────────────
  const duplicates: DuplicateCandidate[] = [];
  for (let i = 0; i < works.length; i++) {
    for (let j = i + 1; j < works.length; j++) {
      const wi = works[i], wj = works[j];
      if (wi.sector !== wj.sector) continue;
      const textSim = cosineSimilarity(tokenize(wi.name), tokenize(wj.name));
      const distKm = wi.lat && wj.lat ? haversineKm(wi.lat, wi.lng, wj.lat, wj.lng) : null;
      const geoSim = distKm !== null ? Math.max(0, 1 - distKm / 20) : 0;
      const combined = textSim * 0.55 + geoSim * 0.35 + (wi.mpId === wj.mpId ? 0.1 : 0);
      if (combined >= 0.35) {
        const reasons: string[] = [];
        if (textSim > 0.3) reasons.push(`Name similarity: ${(textSim * 100).toFixed(0)}%`);
        if (distKm !== null && distKm < 5) reasons.push(`Distance: ${distKm.toFixed(1)} km apart`);
        if (wi.sector === wj.sector) reasons.push(`Same sector: ${wi.sector}`);
        if (wi.mpId === wj.mpId) reasons.push('Same recommending MP');
        duplicates.push({ workId1: wi.id, workId2: wj.id, similarityScore: parseFloat(combined.toFixed(3)), reasons, distanceKm: distKm });
      }
    }
  }
  duplicates.sort((a, b) => b.similarityScore - a.similarityScore);

  // ── 3. Delay Risk Prediction (Logistic Regression) ────
  const lr = new LogisticRegression();
  const delayRisks: DelayRiskResult[] = works.map(w => {
    const features = {
      expenditureRatio: w.expenditureLakh / (w.revisedAmountLakh || 1),
      progressLag: getProgressLag(w),
      daysOverdue: getDaysOverdue(w) / 100,
      missingEvidence: w.missingEvidence ? 1 : 0,
      revisionCount: w.revisedCompletionDate ? 1 : 0,
      sectorRisk: SECTOR_RISK[w.sector] ?? 0.5,
      agencyTrackRecord: AGENCY_TRACK[w.agency] ?? 0.5,
    };
    const prob = lr.predict(features);
    const riskLevel: DelayRiskResult['riskLevel'] =
      prob >= 0.75 ? 'critical' : prob >= 0.55 ? 'high' : prob >= 0.35 ? 'medium' : 'low';
    return {
      workId: w.id,
      riskProbability: parseFloat(prob.toFixed(3)),
      riskLevel,
      daysAtRisk: getDaysOverdue(w),
      factors: lr.featureImportance(features),
    };
  });

  // ── 4. Cost Deviation Analysis ────────────────
  const sectorGroups: Record<string, Work[]> = {};
  works.forEach(w => {
    if (!sectorGroups[w.sector]) sectorGroups[w.sector] = [];
    sectorGroups[w.sector].push(w);
  });

  const costDeviations: CostDeviationResult[] = works.map(w => {
    const group = sectorGroups[w.sector] ?? [w];
    const rates = group.map(g => g.sanctionedAmountLakh);
    const m = mean(rates), s = std(rates);
    const z = zScore(w.sanctionedAmountLakh, m, s);
    const expectedRate = m;
    const devPct = ((w.sanctionedAmountLakh - expectedRate) / (expectedRate || 1)) * 100;
    return {
      workId: w.id,
      expectedRateLakh: parseFloat(m.toFixed(2)),
      actualRateLakh: w.sanctionedAmountLakh,
      deviationPct: parseFloat(devPct.toFixed(1)),
      zScore: parseFloat(z.toFixed(2)),
      isDeviant: Math.abs(z) > 1.5,
    };
  });

  mlResultsCache = {
    anomalies,
    duplicates,
    delayRisks,
    costDeviations,
    runAt: new Date().toISOString(),
    modelVersion: 'MPLADS-ML-v1.2 (synthetic)',
  };
  return mlResultsCache;
}

export function resetMLCache(): void { mlResultsCache = null; }
