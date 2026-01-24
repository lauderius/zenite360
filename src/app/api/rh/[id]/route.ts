import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar funcionário por ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const funcionario = await prisma.funcionarios.findUnique({ where: { id: Number(params.id) } });
    if (!funcionario) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(funcionario);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar funcionário.' }, { status: 500 });
  }
}

// PUT: Atualizar funcionário
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const funcionario = await prisma.funcionarios.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(funcionario);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar funcionário.' }, { status: 500 });
  }
}

// DELETE: Remover funcionário
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.funcionarios.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover funcionário.' }, { status: 500 });
  }
}
