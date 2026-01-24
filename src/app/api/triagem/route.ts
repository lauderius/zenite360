import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar triagens
export async function GET() {
  try {
    const triagens = await prisma.triagem.findMany();
    return NextResponse.json(triagens);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar triagens.' }, { status: 500 });
  }
}

// POST: Criar triagem
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const triagem = await prisma.triagem.create({ data });
    return NextResponse.json(triagem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar triagem.' }, { status: 500 });
  }
}
