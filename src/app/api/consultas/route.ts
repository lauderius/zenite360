import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar consultas
export async function GET() {
  try {
    const consultas = await prisma.consultas.findMany();
    return NextResponse.json({ data: consultas, success: true });
  } catch (error) {
    return NextResponse.json({ data: [], success: false, error: 'Erro ao buscar consultas.' }, { status: 500 });
  }
}

// POST: Criar consulta
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const consulta = await prisma.consultas.create({ data });
    return NextResponse.json({ data: consulta, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar consulta.' }, { status: 500 });
  }
}
