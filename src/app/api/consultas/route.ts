import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar consultas
export async function GET() {
  try {
    const consultas = await prisma.consultas.findMany();
    return NextResponse.json(consultas);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar consultas.' }, { status: 500 });
  }
}

// POST: Criar consulta
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const consulta = await prisma.consultas.create({ data });
    return NextResponse.json(consulta, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar consulta.' }, { status: 500 });
  }
}
