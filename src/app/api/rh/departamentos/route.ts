import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const depts = await prisma.departamentos.findMany({
      where: { activo: true },
      orderBy: { nome: 'asc' },
    });

    const data = depts.map(d => ({
      ...d,
      id: Number(d.id),
    }));

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
    return NextResponse.json({ data: [], success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dept = await prisma.departamentos.create({
      data: {
        nome: body.nome,
        sigla: body.sigla,
        tipo: body.tipo,
        descricao: body.descricao,
        localizacao: body.localizacao,
        activo: true,
      },
    });

    return NextResponse.json({ data: { ...dept, id: Number(dept.id) }, success: true }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
