import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lista de prescrições
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Tentar obter prescrições do banco
    let prescricoes: any[] = [];
    let total = 0;

    try {
      const where: any = {
        deleted_at: null,
      };

      if (status && status !== 'todas') {
        where.status = status;
      }

      [prescricoes, total] = await Promise.all([
        prisma.prescricoes.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { created_at: 'desc' },
          include: {
            pacientes: true,
            consultas: true,
          },
        }),
        prisma.prescricoes.count({ where }),
      ]);
    } catch (dbError) {
      prescricoes = [];
      total = 0;
    }

    // Mapear para formato da aplicação
    const prescricoesFormatadas = prescricoes.map((p: any) => ({
      id: Number(p.id),
      codigo: p.numero_prescricao,
      paciente: p.pacientes?.nome_completo || 'Paciente não identificado',
      pacienteId: Number(p.paciente_id),
      medico: p.medico_id?.toString() || 'Médico',
      data: p.data_prescricao,
      status: p.status || 'Ativa',
      validadeDias: p.validade_dias || 30,
      tipoReceita: p.tipo_receita || 'Simples',
      orientacoes: p.orientacoes_gerais,
      itensCount: 0, // TODO: contar itens
    }));

    return NextResponse.json({
      data: prescricoesFormatadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar prescrições:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar prescrições',
    });
  }
}

// POST: Criar nova prescrição
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar número da prescrição
    const numeroPrescricao = `PRE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const prescricao = await prisma.prescricoes.create({
      data: {
        numero_prescricao: numeroPrescricao,
        consulta_id: BigInt(body.consultaId || 0),
        paciente_id: BigInt(body.pacienteId),
        medico_id: BigInt(body.medicoId || 1),
        data_prescricao: new Date(),
        validade_dias: body.validadeDias || 30,
        status: 'Ativa',
        tipo_receita: body.tipoReceita || 'Simples',
        orientacoes_gerais: body.orientacoes,
      },
    });

    // Criar itens da prescrição se existirem
    if (body.itens && Array.isArray(body.itens)) {
      for (const item of body.itens) {
        await prisma.itens_prescricao.create({
          data: {
            prescricao_id: prescricao.id,
            nome_medicamento: item.nome,
            principio_ativo: item.principioAtivo || null,
            concentracao: item.concentracao || null,
            forma_farmaceutica: item.formaFarmaceutica || null,
            via_administracao: item.viaAdministracao || null,
            posologia: item.posologia,
            frequencia: item.frequencia || null,
            duracao_tratamento: item.duracao || null,
            quantidade_prescrita: item.quantidade || 1,
            unidade: item.unidade || 'unidade',
            instrucoes_uso: item.instrucoes || null,
            uso_continuo: item.usoContinuo || false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: Number(prescricao.id),
        codigo: prescricao.numero_prescricao,
        status: prescricao.status,
      },
    });
  } catch (error) {
    console.error('Erro ao criar prescrição:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar prescrição' },
      { status: 500 }
    );
  }
}

