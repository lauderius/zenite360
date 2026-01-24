import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar internamento por ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const internamento = await prisma.internamento.findUnique({ where: { id: Number(params.id) } });
    if (!internamento) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(internamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar internamento.' }, { status: 500 });
  }
}

// PUT: Atualizar internamento
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const internamento = await prisma.internamento.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(internamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar internamento.' }, { status: 500 });
  }
}

// DELETE: Remover internamento
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.internamento.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover internamento.' }, { status: 500 });
  }
}
