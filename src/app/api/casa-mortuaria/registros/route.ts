import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const registros = await prisma.registros_morgue.findMany({
      orderBy: { created_at: 'desc' },
    });

    const data = registros.map(r => ({
      ...r,
      id: Number(r.id),
      nomeCompleto: r.nome_falecido,
      codigo: `OBIT-${String(r.id).padStart(6, '0')}`,
      dataAdmissao: r.created_at,
      dataHoraObito: r.data_obito,
      causaObito: r.causa_obito || 'INDETERMINADA',
      camaraFria: 'Câmara A', // Mock for now
      posicao: r.gaveta_numero || '1',
    }));

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('Erro ao buscar óbitos:', error);
    return NextResponse.json({ data: [], success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const registro = await prisma.registros_morgue.create({
      data: {
        nome_falecido: body.nomeCompleto,
        data_obito: new Date(body.dataHoraObito),
        causa_obito: body.causaObito,
        gaveta_numero: body.gaveta,
        status: 'ADMITIDO',
      },
    });

    return NextResponse.json({ data: { ...registro, id: Number(registro.id) }, success: true }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar registro de óbito:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
