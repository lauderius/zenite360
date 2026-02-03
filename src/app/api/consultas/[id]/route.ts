import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar consulta por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const consulta = await prisma.consultas.findUnique({ where: { id: Number(id) } });
    if (!consulta) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    return NextResponse.json(consulta);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar consulta.' }, { status: 500 });
  }
}

// PUT: Atualizar consulta
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const consulta = await prisma.consultas.update({ where: { id: Number(id) }, data });
    return NextResponse.json(consulta);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar consulta.' }, { status: 500 });
  }
}

// DELETE: Remover consulta
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.consultas.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover consulta.' }, { status: 500 });
  }
}
