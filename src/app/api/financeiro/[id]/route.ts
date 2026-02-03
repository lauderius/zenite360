import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar fatura por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Mock response since model does not exist
    // const fatura = await prisma.faturas.findUnique({ where: { id: Number(id) } });
    const fatura = { id, numero: `FAT-${id}`, valor: 1000, status: 'Pendente', _mock: true };

    if (!fatura) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    return NextResponse.json(fatura);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar fatura.' }, { status: 500 });
  }
}

// PUT: Atualizar fatura
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    // Mock response
    // const fatura = await prisma.faturas.update({ where: { id: Number(id) }, data });
    const fatura = { id, ...data, _mock: true };
    return NextResponse.json(fatura);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar fatura.' }, { status: 500 });
  }
}

// DELETE: Remover fatura
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Mock response
    // await prisma.faturas.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, _mock: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover fatura.' }, { status: 500 });
  }
}
