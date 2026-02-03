import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar agendamento por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const agendamento = await prisma.agendamentos.findUnique({ where: { id: Number(id) } });
    if (!agendamento) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(agendamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar agendamento.' }, { status: 500 });
  }
}

// PUT: Atualizar agendamento
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const agendamento = await prisma.agendamentos.update({ where: { id: Number(id) }, data });
    return NextResponse.json(agendamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar agendamento.' }, { status: 500 });
  }
}

// DELETE: Remover agendamento
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.agendamentos.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover agendamento.' }, { status: 500 });
  }
}
