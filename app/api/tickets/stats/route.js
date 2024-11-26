import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db'; // Adjust this import based on your db setup

export async function GET() {
  try {
    const db = await connectToDb();
    
    // Assuming you have a tickets collection/table
    const open = await db.collection('tickets').countDocuments({ status: 'open' });
    const inProgress = await db.collection('tickets').countDocuments({ status: 'in-progress' });
    const completed = await db.collection('tickets').countDocuments({ status: 'completed' });

    return NextResponse.json({
      open,
      inProgress,
      completed
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ticket statistics' },
      { status: 500 }
    );
  }
} 