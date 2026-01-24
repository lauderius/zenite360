import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar ativo por ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ativo = await prisma.ativos.findUnique({ where: { id: Number(params.id) } });
    if (!ativo) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(ativo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ativo.' }, { status: 500 });
  }
}

// PUT: Atualizar ativo
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const ativo = await prisma.ativos.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(ativo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar ativo.' }, { status: 500 });
  }
}

// DELETE: Remover ativo
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.ativos.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover ativo.' }, { status: 500 });
  }
}
