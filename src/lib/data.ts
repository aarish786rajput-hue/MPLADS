/**
 * MPLADS Insight — Synthetic Data Module
 * ⚠️ ALL DATA IS SYNTHETIC AND FOR DEMONSTRATION PURPOSES ONLY.
 * This data does NOT represent real works, MPs, districts, payments,
 * or any official MPLADS records.
 */

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type WorkStatus = 'completed' | 'in_progress' | 'delayed' | 'sanctioned' | 'not_started';
export type AlertStatus = 'new' | 'triaged' | 'assigned' | 'under_review' | 'closed' | 'escalated';
export type AlertCategory = 'financial' | 'execution' | 'compliance' | 'data_quality' | 'duplicate';
export type UserRole = 'mp_staff' | 'district_authority' | 'state_nodal' | 'ministry' | 'implementing_agency' | 'auditor' | 'system_admin';

// ─── Synthetic MP Records ──────────────────────────────────────────────────────
export interface MP {
  id: string;
  name: string;
  constituency: string;
  state: string;
  membershipType: 'Lok Sabha' | 'Rajya Sabha';
  tenure: string;
  districts: string[];
  entitlementLakh: number;
  usedLakh: number;
}

export const SYNTHETIC_MPs: MP[] = [
  { id: 'MP001', name: 'Shri Ramesh Kumar (SYNTHETIC)', constituency: 'Demo North', state: 'Demo State A', membershipType: 'Lok Sabha', tenure: '2024–2029', districts: ['Demo District 1', 'Demo District 2'], entitlementLakh: 500, usedLakh: 342 },
  { id: 'MP002', name: 'Smt. Priya Sharma (SYNTHETIC)', constituency: 'Demo South', state: 'Demo State A', membershipType: 'Lok Sabha', tenure: '2024–2029', districts: ['Demo District 3'], entitlementLakh: 500, usedLakh: 478 },
  { id: 'MP003', name: 'Shri Arvind Patel (SYNTHETIC)', constituency: 'Demo East', state: 'Demo State B', membershipType: 'Rajya Sabha', tenure: '2022–2028', districts: ['Demo District 4', 'Demo District 5'], entitlementLakh: 500, usedLakh: 215 },
];

// ─── Synthetic Works ──────────────────────────────────────────────────────────
export interface Work {
  id: string;
  name: string;
  mpId: string;
  district: string;
  sector: 'Water Supply' | 'Roads' | 'Education' | 'Health' | 'Sanitation' | 'Community Hall';
  agency: string;
  status: WorkStatus;
  sanctionedAmountLakh: number;
  revisedAmountLakh: number;
  expenditureLakh: number;
  physicalProgress: number; // 0–100
  sanctionDate: string;
  originalCompletionDate: string;
  revisedCompletionDate: string | null;
  actualCompletionDate: string | null;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  riskScore: number;
  alerts: string[]; // alert IDs
  evidenceCount: number;
  missingEvidence: boolean;
}

export const SYNTHETIC_WORKS: Work[] = [
  {
    id: 'WRK-2024-0001', name: 'Construction of CC Road (SYNTHETIC)', mpId: 'MP001',
    district: 'Demo District 1', sector: 'Roads', agency: 'Demo PWD Agency A',
    status: 'in_progress', sanctionedAmountLakh: 18.5, revisedAmountLakh: 18.5,
    expenditureLakh: 16.2, physicalProgress: 72, sanctionDate: '2024-03-15',
    originalCompletionDate: '2024-12-15', revisedCompletionDate: null,
    actualCompletionDate: null, lat: 22.31, lng: 78.12, riskLevel: 'medium',
    riskScore: 52, alerts: ['ALT-001', 'ALT-004'], evidenceCount: 4, missingEvidence: true,
  },
  {
    id: 'WRK-2024-0002', name: 'Drinking Water Supply Scheme (SYNTHETIC)', mpId: 'MP001',
    district: 'Demo District 2', sector: 'Water Supply', agency: 'Demo Water Board B',
    status: 'delayed', sanctionedAmountLakh: 24.0, revisedAmountLakh: 26.5,
    expenditureLakh: 28.1, physicalProgress: 45, sanctionDate: '2024-01-10',
    originalCompletionDate: '2024-09-10', revisedCompletionDate: '2025-03-10',
    actualCompletionDate: null, lat: 22.45, lng: 78.34, riskLevel: 'critical',
    riskScore: 87, alerts: ['ALT-002', 'ALT-003'], evidenceCount: 2, missingEvidence: true,
  },
  {
    id: 'WRK-2024-0003', name: 'Primary School Building Renovation (SYNTHETIC)', mpId: 'MP002',
    district: 'Demo District 3', sector: 'Education', agency: 'Demo Education Dept C',
    status: 'completed', sanctionedAmountLakh: 12.0, revisedAmountLakh: 12.0,
    expenditureLakh: 11.8, physicalProgress: 100, sanctionDate: '2023-06-01',
    originalCompletionDate: '2024-02-01', revisedCompletionDate: null,
    actualCompletionDate: '2024-01-28', lat: 23.01, lng: 79.56, riskLevel: 'low',
    riskScore: 12, alerts: [], evidenceCount: 8, missingEvidence: false,
  },
  {
    id: 'WRK-2024-0004', name: 'Rural Health Sub-Centre Construction (SYNTHETIC)', mpId: 'MP002',
    district: 'Demo District 3', sector: 'Health', agency: 'Demo NHM Agency D',
    status: 'in_progress', sanctionedAmountLakh: 30.0, revisedAmountLakh: 30.0,
    expenditureLakh: 8.5, physicalProgress: 30, sanctionDate: '2024-05-20',
    originalCompletionDate: '2025-05-20', revisedCompletionDate: null,
    actualCompletionDate: null, lat: 23.15, lng: 79.71, riskLevel: 'low',
    riskScore: 18, alerts: [], evidenceCount: 3, missingEvidence: false,
  },
  {
    id: 'WRK-2024-0005', name: 'Open Air Theatre (SYNTHETIC)', mpId: 'MP003',
    district: 'Demo District 4', sector: 'Community Hall', agency: 'Demo Municipal E',
    status: 'sanctioned', sanctionedAmountLakh: 45.0, revisedAmountLakh: 45.0,
    expenditureLakh: 0, physicalProgress: 0, sanctionDate: '2024-08-01',
    originalCompletionDate: '2025-08-01', revisedCompletionDate: null,
    actualCompletionDate: null, lat: 21.88, lng: 77.34, riskLevel: 'medium',
    riskScore: 41, alerts: ['ALT-005'], evidenceCount: 1, missingEvidence: false,
  },
  {
    id: 'WRK-2024-0006', name: 'Sanitation & Drain Network (SYNTHETIC)', mpId: 'MP003',
    district: 'Demo District 5', sector: 'Sanitation', agency: 'Demo ULB Agency F',
    status: 'delayed', sanctionedAmountLakh: 22.5, revisedAmountLakh: 22.5,
    expenditureLakh: 23.8, physicalProgress: 55, sanctionDate: '2023-11-15',
    originalCompletionDate: '2024-08-15', revisedCompletionDate: null,
    actualCompletionDate: null, lat: 22.02, lng: 77.89, riskLevel: 'high',
    riskScore: 74, alerts: ['ALT-006', 'ALT-007'], evidenceCount: 3, missingEvidence: true,
  },
];

// ─── Synthetic Alerts ─────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  workId: string;
  category: AlertCategory;
  riskLevel: RiskLevel;
  status: AlertStatus;
  title: string;
  description: string;
  amountAssociatedLakh: number | null;
  ruleOrModel: string;
  detectedAt: string;
  assignedTo: string | null;
  observedValue: string;
  expectedRange: string;
  resolvedAt: string | null;
  disposition: string | null;
}

export const SYNTHETIC_ALERTS: Alert[] = [
  {
    id: 'ALT-001', workId: 'WRK-2024-0001', category: 'compliance',
    riskLevel: 'medium', status: 'assigned',
    title: 'Missing Stage-2 Completion Evidence',
    description: 'No inspection photograph or measurement record uploaded for Stage-2 milestone (foundation completion). This is required under the applicable compliance rule before next disbursement.',
    amountAssociatedLakh: 6.5, ruleOrModel: 'Rule: MPLADS-EVID-02 v1.3',
    detectedAt: '2026-09-10T09:30:00Z', assignedTo: 'District Inspector A',
    observedValue: 'Evidence count = 0 for milestone MS-02',
    expectedRange: 'At least 1 verified inspection record required',
    resolvedAt: null, disposition: null,
  },
  {
    id: 'ALT-002', workId: 'WRK-2024-0002', category: 'financial',
    riskLevel: 'critical', status: 'triaged',
    title: 'Expenditure Exceeds Current Approved Sanction',
    description: 'Recorded expenditure of ₹28.1 lakh exceeds the current approved sanction of ₹26.5 lakh by ₹1.6 lakh. No valid approval for this overshoot found in the system. Verify approved revisions and accounting adjustments before escalating.',
    amountAssociatedLakh: 1.6, ruleOrModel: 'Rule: FIN-OVERSHOOT-01 v2.0',
    detectedAt: '2026-09-14T11:00:00Z', assignedTo: null,
    observedValue: 'Expenditure ₹28.1L vs Approved ₹26.5L',
    expectedRange: 'Expenditure ≤ current approved sanction',
    resolvedAt: null, disposition: null,
  },
  {
    id: 'ALT-003', workId: 'WRK-2024-0002', category: 'execution',
    riskLevel: 'high', status: 'new',
    title: 'Expenditure–Progress Mismatch (AI Flag)',
    description: 'Isolation Forest anomaly model (v0.3, shadow mode) scored this work in the top 5% for expenditure–progress mismatch. ₹28.1L disbursed at 45% physical progress is atypical for comparable Water Supply works in this cohort. This is an AI-generated signal, not a confirmed finding. Independent review recommended.',
    amountAssociatedLakh: null, ruleOrModel: 'Model: IsoForest-EP-Mismatch v0.3 (shadow)',
    detectedAt: '2026-09-15T06:00:00Z', assignedTo: null,
    observedValue: 'Expenditure ratio 1.17× vs cohort median 0.62×',
    expectedRange: '0.4× – 0.9× for comparable works at 40–50% progress',
    resolvedAt: null, disposition: null,
  },
  {
    id: 'ALT-004', workId: 'WRK-2024-0001', category: 'execution',
    riskLevel: 'medium', status: 'under_review',
    title: 'Delay Risk — Projected to Miss Completion Date',
    description: 'Based on current milestone progress rate (72% complete with 95 days remaining), projected completion is 38 days beyond the approved date. No approved extension recorded.',
    amountAssociatedLakh: null, ruleOrModel: 'Rule: DEL-PROJ-01 v1.1',
    detectedAt: '2026-09-12T08:00:00Z', assignedTo: 'District Engineer B',
    observedValue: 'Rate: 6.5%/month; Remaining: 28%',
    expectedRange: 'Completion by 2024-12-15',
    resolvedAt: null, disposition: null,
  },
  {
    id: 'ALT-005', workId: 'WRK-2024-0005', category: 'duplicate',
    riskLevel: 'medium', status: 'assigned',
    title: 'Possible Duplicate Work Candidate',
    description: 'AI similarity model (v0.2, shadow mode) identified WRK-2024-0005 and WRK-2023-0087 as a possible duplicate pair (similarity score 0.81). Same district, same sector, similar description and coordinates within 400m. Review required — phased or neighbouring works may be legitimate.',
    amountAssociatedLakh: 45.0, ruleOrModel: 'Model: DupDetect-TextGeo v0.2 (shadow)',
    detectedAt: '2026-09-08T14:30:00Z', assignedTo: 'Auditor C',
    observedValue: 'Similarity 0.81; Distance 380m',
    expectedRange: 'Similarity < 0.65 for independent works',
    resolvedAt: null, disposition: null,
  },
  {
    id: 'ALT-006', workId: 'WRK-2024-0006', category: 'financial',
    riskLevel: 'high', status: 'new',
    title: 'Expenditure Exceeds Sanction (Unapproved)',
    description: 'Recorded expenditure ₹23.8L against sanction of ₹22.5L. No approved revision found. Possible cost overrun of ₹1.3L without documented approval.',
    amountAssociatedLakh: 1.3, ruleOrModel: 'Rule: FIN-OVERSHOOT-01 v2.0',
    detectedAt: '2026-09-16T10:00:00Z', assignedTo: null,
    observedValue: 'Expenditure ₹23.8L vs Sanction ₹22.5L',
    expectedRange: 'Expenditure ≤ approved sanction',
    resolvedAt: null, disposition: null,
  },
  {
    id: 'ALT-007', workId: 'WRK-2024-0006', category: 'data_quality',
    riskLevel: 'medium', status: 'new',
    title: 'Missing Completion Evidence for Overdue Work',
    description: 'Work was due for completion on 2024-08-15. No completion certificate or final inspection report found in the evidence register. Physical progress reported at 55% by implementing agency.',
    amountAssociatedLakh: null, ruleOrModel: 'Rule: MPLADS-EVID-03 v1.3',
    detectedAt: '2026-09-17T09:00:00Z', assignedTo: null,
    observedValue: 'Due 2024-08-15; Evidence count: 3 (no completion cert)',
    expectedRange: 'Final inspection + completion certificate required',
    resolvedAt: null, disposition: null,
  },
];

// ─── Summary Statistics ───────────────────────────────────────────────────────
export interface OverviewStats {
  totalWorksThisYear: number;
  completedWorks: number;
  delayedWorks: number;
  inProgressWorks: number;
  totalSanctionedLakh: number;
  totalExpenditureLakh: number;
  totalAlertsOpen: number;
  alertsCritical: number;
  alertsHigh: number;
  alertsMedium: number;
  dataFreshnessLabel: string;
  dataFreshnessWarning: boolean;
  missingEvidenceWorks: number;
  duplicateCandidates: number;
}

export const SYNTHETIC_OVERVIEW: OverviewStats = {
  totalWorksThisYear: 148,
  completedWorks: 62,
  delayedWorks: 23,
  inProgressWorks: 47,
  totalSanctionedLakh: 3240.5,
  totalExpenditureLakh: 2187.3,
  totalAlertsOpen: 31,
  alertsCritical: 4,
  alertsHigh: 9,
  alertsMedium: 14,
  dataFreshnessLabel: '24 Sep 2026, 06:00 IST (SYNTHETIC)',
  dataFreshnessWarning: false,
  missingEvidenceWorks: 11,
  duplicateCandidates: 3,
};

// ─── District-level data for charts ──────────────────────────────────────────
export const SYNTHETIC_DISTRICT_STATS = [
  { district: 'Demo Dist 1', sanctioned: 840, expenditure: 620, works: 38, completed: 18 },
  { district: 'Demo Dist 2', sanctioned: 720, expenditure: 590, works: 31, completed: 14 },
  { district: 'Demo Dist 3', sanctioned: 560, expenditure: 420, works: 27, completed: 19 },
  { district: 'Demo Dist 4', sanctioned: 680, expenditure: 380, works: 30, completed: 8 },
  { district: 'Demo Dist 5', sanctioned: 440, expenditure: 177.3, works: 22, completed: 3 },
];

// ─── Sector breakdown ─────────────────────────────────────────────────────────
export const SYNTHETIC_SECTOR_STATS = [
  { sector: 'Roads', works: 42, expenditure: 620, color: '#3b82f6' },
  { sector: 'Water Supply', works: 28, expenditure: 580, color: '#06b6d4' },
  { sector: 'Education', works: 31, expenditure: 430, color: '#8b5cf6' },
  { sector: 'Health', works: 19, expenditure: 280, color: '#10b981' },
  { sector: 'Sanitation', works: 16, expenditure: 210, color: '#f59e0b' },
  { sector: 'Community Hall', works: 12, expenditure: 67.3, color: '#ef4444' },
];

// ─── Monthly expenditure trend ────────────────────────────────────────────────
export const SYNTHETIC_MONTHLY_TREND = [
  { month: 'Apr', sanctioned: 180, expenditure: 45, works: 12 },
  { month: 'May', sanctioned: 220, expenditure: 110, works: 18 },
  { month: 'Jun', sanctioned: 310, expenditure: 190, works: 24 },
  { month: 'Jul', sanctioned: 410, expenditure: 280, works: 31 },
  { month: 'Aug', sanctioned: 580, expenditure: 420, works: 38 },
  { month: 'Sep', sanctioned: 720, expenditure: 590, works: 45 },
  { month: 'Oct', sanctioned: 820, expenditure: 700, works: 51 },
  { month: 'Nov', sanctioned: 940, expenditure: 810, works: 56 },
  { month: 'Dec', sanctioned: 1100, expenditure: 920, works: 62 },
  { month: 'Jan', sanctioned: 1280, expenditure: 1100, works: 70 },
  { month: 'Feb', sanctioned: 1420, expenditure: 1310, works: 78 },
  { month: 'Mar', sanctioned: 1680, expenditure: 1680, works: 87 },
];

// ─── Compliance summary ───────────────────────────────────────────────────────
export const SYNTHETIC_COMPLIANCE = [
  { rule: 'Expenditure within approved sanction', compliant: 132, nonCompliant: 8, insufficient: 8 },
  { rule: 'Mandatory evidence at each milestone', compliant: 118, nonCompliant: 11, insufficient: 19 },
  { rule: 'Completion within approved schedule', compliant: 99, nonCompliant: 23, insufficient: 26 },
  { rule: 'Agency registration and PAN on file', compliant: 145, nonCompliant: 2, insufficient: 1 },
  { rule: 'Work-order / contract on record', compliant: 121, nonCompliant: 14, insufficient: 13 },
];

// ─── Case events (audit trail) ────────────────────────────────────────────────
export interface CaseEvent {
  id: string;
  alertId: string;
  timestamp: string;
  actor: string;
  action: string;
  note: string;
}

export const SYNTHETIC_CASE_EVENTS: CaseEvent[] = [
  { id: 'EVT-001', alertId: 'ALT-001', timestamp: '2026-09-10T09:30:00Z', actor: 'System', action: 'Alert Created', note: 'Rule MPLADS-EVID-02 triggered on import batch #2024-09-10' },
  { id: 'EVT-002', alertId: 'ALT-001', timestamp: '2026-09-10T11:15:00Z', actor: 'District Authority', action: 'Triaged', note: 'Confirmed missing milestone evidence. Assigned for inspection.' },
  { id: 'EVT-003', alertId: 'ALT-001', timestamp: '2026-09-11T09:00:00Z', actor: 'District Authority', action: 'Assigned', note: 'Assigned to District Inspector A for on-site verification.' },
  { id: 'EVT-004', alertId: 'ALT-002', timestamp: '2026-09-14T11:00:00Z', actor: 'System', action: 'Alert Created', note: 'Financial overshoot rule triggered. Amount: ₹1.6L above sanction.' },
  { id: 'EVT-005', alertId: 'ALT-002', timestamp: '2026-09-14T14:30:00Z', actor: 'District Authority', action: 'Triaged', note: 'Checking whether approved revision exists. Awaiting document from agency.' },
];

// ─── Report types ─────────────────────────────────────────────────────────────
export const REPORT_TEMPLATES = [
  { id: 'RPT-001', name: 'District Expenditure Summary', description: 'Sanctioned vs actual expenditure by district and sector', lastGenerated: '2026-09-20', format: 'XLSX' },
  { id: 'RPT-002', name: 'Open Alerts Register', description: 'All open alerts with category, risk and owner', lastGenerated: '2026-09-22', format: 'PDF' },
  { id: 'RPT-003', name: 'Works Overdue Report', description: 'All works beyond approved completion date without extension', lastGenerated: '2026-09-18', format: 'XLSX' },
  { id: 'RPT-004', name: 'Compliance Check Summary', description: 'Rule-by-rule compliance status across all works', lastGenerated: '2026-09-15', format: 'PDF' },
  { id: 'RPT-005', name: 'Evidence Completeness Report', description: 'Missing evidence analysis by milestone and work type', lastGenerated: '2026-09-19', format: 'XLSX' },
  { id: 'RPT-006', name: 'MP Portfolio Summary', description: 'Per-MP entitlement, utilisation and works status', lastGenerated: '2026-09-21', format: 'PDF' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getRiskClass(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    critical: 'badge-critical', high: 'badge-high',
    medium: 'badge-medium', low: 'badge-low', info: 'badge-info',
  };
  return map[level];
}

export function getStatusClass(status: WorkStatus): string {
  const map: Record<WorkStatus, string> = {
    completed: 'badge-active', in_progress: 'badge-info',
    delayed: 'badge-critical', sanctioned: 'badge-medium', not_started: 'badge-inactive',
  };
  return map[status];
}

export function formatLakh(value: number): string {
  return `₹${value.toFixed(1)}L`;
}

export function formatCrore(value: number): string {
  const cr = value / 100;
  return `₹${cr.toFixed(2)} Cr`;
}

export function getAlertStatusClass(status: AlertStatus): string {
  const map: Record<AlertStatus, string> = {
    new: 'badge-critical', triaged: 'badge-high', assigned: 'badge-medium',
    under_review: 'badge-info', closed: 'badge-active', escalated: 'badge-high',
  };
  return map[status];
}
