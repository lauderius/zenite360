import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar funcionários
export async function GET() {
  try {
    const funcionarios = await prisma.funcionarios.findMany();
    return NextResponse.json(funcionarios);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar funcionários.' }, { status: 500 });
  }
}

// POST: Criar funcionário
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const funcionario = await prisma.funcionarios.create({ data });
    return NextResponse.json(funcionario, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar funcionário.' }, { status: 500 });
  }
}
