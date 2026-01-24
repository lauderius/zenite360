import { NextResponse } from 'next/server';
import { mockList } from '@/lib/mockData';

export async function GET() {
  return mockList('Funcionários Terceirizados', 5);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ...body, success: true, _status: 'mock' });
}
