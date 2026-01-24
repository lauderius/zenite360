import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar internamentos
export async function GET() {
  try {
    const internamentos = await prisma.internamento.findMany();
    return NextResponse.json(internamentos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar internamentos.' }, { status: 500 });
  }
}

// POST: Criar internamento
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const internamento = await prisma.internamento.create({ data });
    return NextResponse.json(internamento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar internamento.' }, { status: 500 });
  }
}
