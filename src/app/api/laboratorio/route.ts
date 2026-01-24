import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ExameLaboratorial {
  id: bigint;
  numero_pedido: string;
  paciente_id: bigint;
  medico_solicitante_id: bigint;
  data_solicitacao: Date;
  tipo_exame: string;
  categoria: string;
  prioridade: string;
  status: string;
  data_resultado: Date | null;
  resultado_texto: string | null;
  interpretacao: string | null;
  pacientes?: {
    nome_completo: string;
  };
  utilizadores_exames_solicitados_medico_solicitante_idToutilizadores?: {
    name: string;
  };
}

interface TipoExame {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  prazo: string;
  preco: number;
}

// GET: Lista de exames laboratoriais
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const categoria = searchParams.get('categoria') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let exames: ExameLaboratorial[] = [];
    let total = 0;

    try {
      const where: any = {
        deleted_at: null,
      };

      if (search) {
        where.OR = [
          { numero_pedido: { contains: search } },
          { pacientes: { nome_completo: { contains: search } } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (categoria) {
        where.categoria = categoria;
      }

      [exames, total] = await Promise.all([
        prisma.exames_solicitados.findMany({
          where,
          include: {
            pacientes: {
              select: { nome_completo: true }
            },
            utilizadores_exames_solicitados_medico_solicitante_idToutilizadores: {
              select: { name: true }
            }
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { data_solicitacao: 'desc' },
        }),
        prisma.exames_solicitados.count({ where }),
      ]);
    } catch (dbError) {
      exames = [];
      total = 0;
    }

    // Mapear para formato da aplicação
    const examesFormatados = exames.map((exame) => ({
      id: Number(exame.id),
      codigo: exame.numero_pedido,
      paciente: exame.pacientes?.nome_completo || 'N/A',
      tipoExame: exame.tipo_exame,
      categoria: exame.categoria,
      dataSolicitacao: exame.data_solicitacao,
      dataResultado: exame.data_resultado,
      solicitante: exame.utilizadores_exames_solicitados_medico_solicitante_idToutilizadores?.name || 'N/A',
      status: exame.status,
      urgente: exame.prioridade === 'Emergencia' || exame.prioridade === 'Urgente',
      resultado: exame.resultado_texto,
      interpretacao: exame.interpretacao,
    }));

    // Estatísticas
    const stats = {
      total: examesFormatados.length,
      solicitados: examesFormatados.filter(e => e.status === 'Pendente').length,
      emAnalise: examesFormatados.filter(e => e.status === 'Realizado').length,
      concluidos: examesFormatados.filter(e => e.status === 'Laudado').length,
      urgentes: examesFormatados.filter(e => e.urgente).length,
    };

    return NextResponse.json({
      data: examesFormatados,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar exames laboratoriais:', error);
    return NextResponse.json({
      data: [],
      stats: { total: 0, solicitados: 0, emAnalise: 0, concluidos: 0, urgentes: 0 },
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar exames laboratoriais',
    });
  }
}

// POST: Criar novo exame laboratorial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const exame = await prisma.exames_solicitados.create({
      data: {
        consulta_id: BigInt(body.consultaId || 1),
        paciente_id: BigInt(body.pacienteId),
        medico_solicitante_id: BigInt(body.medicoId || 1),
        numero_pedido: body.numeroPedido || `EXAM-${Date.now()}`,
        data_solicitacao: new Date(),
        tipo_exame: body.tipoExame,
        categoria: body.categoria || 'Laboratorial',
        prioridade: body.prioridade || 'Normal',
        indicacao_clinica: body.indicacaoClinica || '',
        status: 'Pendente',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: Number(exame.id),
        codigo: exame.numero_pedido,
      },
    });
  } catch (error) {
    console.error('Erro ao criar exame laboratorial:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar exame laboratorial' },
      { status: 500 }
    );
  }
}
