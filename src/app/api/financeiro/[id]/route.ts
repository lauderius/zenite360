import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar fatura por ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const fatura = await prisma.faturas.findUnique({ where: { id: Number(params.id) } });
    if (!fatura) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    return NextResponse.json(fatura);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar fatura.' }, { status: 500 });
  }
}

// PUT: Atualizar fatura
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const fatura = await prisma.faturas.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(fatura);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar fatura.' }, { status: 500 });
  }
}

// DELETE: Remover fatura
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.faturas.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover fatura.' }, { status: 500 });
  }
}
