import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Buscar documento por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const documento = await prisma.documentos_oficiais.findUnique({ where: { id: Number(id) } });
    if (!documento) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(documento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar documento.' }, { status: 500 });
  }
}

// PUT: Atualizar documento
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const documento = await prisma.documentos_oficiais.update({ where: { id: Number(id) }, data });
    return NextResponse.json(documento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar documento.' }, { status: 500 });
  }
}

// DELETE: Remover documento
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.documentos_oficiais.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover documento.' }, { status: 500 });
  }
}
