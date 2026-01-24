import { NextRequest, NextResponse } from 'next/server';
import { mockGetById } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  return mockGetById(id, 'Guia de Saída');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  const body = await request.json();
  return NextResponse.json({ id, ...body, success: true, _status: 'mock' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  return NextResponse.json({ success: true, id, _status: 'mock' });
}
