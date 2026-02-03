import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar triagem por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const triagem = await prisma.triagem.findUnique({ where: { id: Number(id) } });
    if (!triagem) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    return NextResponse.json(triagem);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar triagem.' }, { status: 500 });
  }
}

// PUT: Atualizar triagem
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const triagem = await prisma.triagem.update({ where: { id: Number(id) }, data });
    return NextResponse.json(triagem);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar triagem.' }, { status: 500 });
  }
}

// DELETE: Remover triagem
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.triagem.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover triagem.' }, { status: 500 });
  }
}
