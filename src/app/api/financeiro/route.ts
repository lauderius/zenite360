import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar faturas
export async function GET() {
  try {
    const faturas = await prisma.faturas.findMany();
    return NextResponse.json(faturas);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar faturas.' }, { status: 500 });
  }
}

// POST: Criar fatura
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const fatura = await prisma.faturas.create({ data });
    return NextResponse.json(fatura, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar fatura.' }, { status: 500 });
  }
}
