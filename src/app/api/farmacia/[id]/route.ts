import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar medicamento por ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const medicamento = await prisma.artigos_stock.findUnique({ where: { id: Number(params.id) } });
    if (!medicamento) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(medicamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar medicamento.' }, { status: 500 });
  }
}

// PUT: Atualizar medicamento
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const medicamento = await prisma.artigos_stock.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(medicamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar medicamento.' }, { status: 500 });
  }
}

// DELETE: Remover medicamento
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.artigos_stock.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover medicamento.' }, { status: 500 });
  }
}
