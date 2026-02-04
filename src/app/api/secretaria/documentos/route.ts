import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const docs = await prisma.documentos_secretaria.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    const data = docs.map(d => ({
      ...d,
      id: Number(d.id),
      numero: `DOC-${String(d.id).padStart(6, '0')}`,
      assunto: d.titulo, // Map for compatibility
      dataDocumento: d.created_at,
    }));

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json({ data: [], success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doc = await prisma.documentos_secretaria.create({
      data: {
        tipo: body.tipo,
        titulo: body.assunto,
        conteudo: body.conteudo || '',
        status: body.status || 'Emitido',
      },
    });

    return NextResponse.json({ data: { ...doc, id: Number(doc.id) }, success: true }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
