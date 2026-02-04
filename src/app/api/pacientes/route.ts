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

    // Buscar estatísticas de triagem (pacientes ativos por prioridade)
    const statsTriagem = await prisma.triagem.groupBy({
      by: ['prioridade'],
      where: {
        status: { in: ['Aguardando', 'Em Atendimento', 'AGUARDANDO_TRIAGEM', 'EM_ATENDIMENTO'] }
      },
      _count: { id: true }
    });

    const stats = {
      emergencia: statsTriagem.find(p => ['EMERGENCIA', 'Emergência', 'Vermelho'].includes(p.prioridade))?._count.id || 0,
      muitoUrgente: statsTriagem.find(p => ['MUITO_URGENTE', 'Muito Urgente', 'Laranja'].includes(p.prioridade))?._count.id || 0,
      urgente: statsTriagem.find(p => ['URGENTE', 'Urgente', 'Amarelo'].includes(p.prioridade))?._count.id || 0,
      monitorizacao: statsTriagem.find(p => ['POUCO_URGENTE', 'Pouco Urgente', 'Verde', 'NAO_URGENTE', 'Não Urgente', 'Azul'].includes(p.prioridade))?._count.id || 0,
    };

    // Converter BigInt para Number/String para o JSON
    const serialized = JSON.parse(JSON.stringify(pacientesList, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({
      data: serialized,
      stats,
      success: true
    });
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
      grupo_sanguineo,
      alergias,
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
        grupo_sanguineo: grupo_sanguineo || null,
        alergias,
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
