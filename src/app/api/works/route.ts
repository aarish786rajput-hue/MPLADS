import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const works = await prisma.work.findMany();
  
  if (works.length === 0) {
    // Seed some data if empty
    const dummyData = [
      { workName: "Road Construction in Sector 4", costLakh: 25.5, status: "Ongoing", category: "Infrastructure" },
      { workName: "Water Tank Installation", costLakh: 12.0, status: "Completed", category: "Water" },
      { workName: "Solar Panel for School", costLakh: 8.5, status: "Pending", category: "Education" },
      { workName: "Suspiciously Expensive Bench", costLakh: 55.0, status: "Ongoing", category: "Infrastructure" }, // Anomaly
      { workName: "Community Hall Repair", costLakh: 15.0, status: "Ongoing", category: "Infrastructure" },
      { workName: "Street Lights Phase 2", costLakh: 10.0, status: "Completed", category: "Infrastructure" },
      { workName: "Library Computers", costLakh: 9.0, status: "Pending", category: "Education" },
    ];
    
    await prisma.work.createMany({ data: dummyData });
    const newWorks = await prisma.work.findMany();
    return NextResponse.json(newWorks);
  }

  return NextResponse.json(works);
}
