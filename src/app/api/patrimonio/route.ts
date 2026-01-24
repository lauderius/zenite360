import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar ativos
export async function GET() {
  try {
    const ativos = await prisma.ativos.findMany();
    return NextResponse.json(ativos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ativos.' }, { status: 500 });
  }
}

// POST: Criar ativo
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const ativo = await prisma.ativos.create({ data });
    return NextResponse.json(ativo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar ativo.' }, { status: 500 });
  }
}
