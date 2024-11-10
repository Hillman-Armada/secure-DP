import { NextResponse } from 'next/server';
import { seedProducts } from '@/lib/seed';

export async function GET() {
  try {
    await seedProducts();
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error seeding database' },
      { status: 500 }
    );
  }
} 