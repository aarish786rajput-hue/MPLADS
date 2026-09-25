import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    // 1. Get real data from database
    const works = await prisma.work.findMany();
    
    if (works.length === 0) {
      return NextResponse.json({ error: "No data in database to analyze." }, { status: 400 });
    }

    // 2. Send to Python FastAPI backend
    const mlResponse = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(works)
    });

    if (!mlResponse.ok) {
      throw new Error(`Python API responded with status: ${mlResponse.status}`);
    }

    const mlResult = await mlResponse.json();

    // 3. Return insights to frontend
    return NextResponse.json(mlResult);
    
  } catch (error: any) {
    console.error("ML Integration Error:", error);
    return NextResponse.json({ error: "Failed to communicate with ML Backend." }, { status: 500 });
  }
}
