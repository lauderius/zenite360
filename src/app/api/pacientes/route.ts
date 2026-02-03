import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const pacientesList = await prisma.pacientes.findMany({
      where: query ? {
        OR: [
          { nome_completo: { contains: query } },
          { bi_numero: { contains: query } },
          { numero_processo: { contains: query } }
        ],
        deleted_at: null
      } : {
        deleted_at: null
      },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    // Converter BigInt para Number/String para o JSON
    const serialized = JSON.parse(JSON.stringify(pacientesList, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ data: serialized, success: true });
  } catch (error) {
    console.error('[API_PACIENTES_GET]', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar pacientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nome_completo,
      bi_numero,
      numero_processo,
      data_nascimento,
      genero,
      telefone_principal,
      contacto_emergencia_nome,
      contacto_emergencia_telefone,
      provincia,
      municipio,
      registado_por // Isto deve vir do auth futuramente
    } = body;

    const novoPaciente = await prisma.pacientes.create({
      data: {
        nome_completo,
        bi_numero,
        numero_processo,
        data_nascimento: new Date(data_nascimento),
        genero,
        telefone_principal,
        contacto_emergencia_nome,
        contacto_emergencia_telefone,
        provincia,
        municipio,
        registado_por: BigInt(registado_por || 1) // Default para admin se não houver
      }
    });

    const serialized = JSON.parse(JSON.stringify(novoPaciente, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ data: serialized, success: true }, { status: 201 });
  } catch (error) {
    console.error('[API_PACIENTES_POST]', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar paciente' }, { status: 500 });
  }
}
