import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar documentos
export async function GET() {
  try {
    const documentos = await prisma.documentos_oficiais.findMany();
    return NextResponse.json(documentos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar documentos.' }, { status: 500 });
  }
}

// POST: Criar documento
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const documento = await prisma.documentos_oficiais.create({ data });
    return NextResponse.json(documento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar documento.' }, { status: 500 });
  }
}
