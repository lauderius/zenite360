import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar registros de óbito
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const causaObito = searchParams.get('causaObito');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const camaraFria = searchParams.get('camaraFria');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (status) where.status = status;
    if (causaObito) where.causaObito = causaObito;
    if (camaraFria) where.camaraFria = camaraFria;
    if (dataInicio || dataFim) {
      where.dataAdmissao = {};
      if (dataInicio) where.dataAdmissao.gte = new Date(dataInicio);
      if (dataFim) where.dataAdmissao.lte = new Date(dataFim);
    }

    const [registros, total] = await Promise.all([
      prisma.registroObito.findMany({
        where,
        include: {
          medicoResponsavel: { select: { nomeCompleto: true } },
          paciente: { select: { nomeCompleto: true, numeroProcesso: true } },
        },
        orderBy: { dataAdmissao: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.registroObito.count({ where }),
    ]);

    // Estatísticas
    const [emConservacao, aguardandoDoc, obitosHoje] = await Promise.all([
      prisma.registroObito.count({
        where: { status: { in: ['ADMITIDO', 'EM_CONSERVACAO', 'AGUARDANDO_DOCUMENTACAO'] } },
      }),
      prisma.registroObito.count({ where: { status: 'AGUARDANDO_DOCUMENTACAO' } }),
      prisma.registroObito.count({
        where: {
          dataAdmissao: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: registros,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: { emConservacao, aguardandoDoc, obitosHoje },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Criar registro de óbito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar código
    const ano = new Date().getFullYear();
    const count = await prisma.registroObito.count({
      where: {
        criadoEm: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${ano + 1}-01-01`),
        },
      },
    });
    const codigo = `OB-${ano}-${String(count + 1).padStart(5, '0')}`;

    // Verificar disponibilidade na câmara fria
    const camara = await prisma.camaraFria.findFirst({
      where: { codigo: body.camaraFria },
    });

    if (!camara) {
      return NextResponse.json(
        { error: 'Câmara fria não encontrada' },
        { status: 400 }
      );
    }

    if (camara.ocupacaoAtual >= camara.capacidade) {
      return NextResponse.json(
        { error: 'Câmara fria sem capacidade disponível' },
        { status: 400 }
      );
    }

    // Criar registro
    const registro = await prisma.registroObito.create({
      data: {
        codigo,
        ...body,
        dataHoraObito: new Date(body.dataHoraObito),
        dataNascimento: body.dataNascimento ? new Date(body.dataNascimento) : null,
        dataAdmissao: new Date(),
        status: 'ADMITIDO',
      },
    });

    // Atualizar ocupação da câmara
    await prisma.camaraFria.update({
      where: { id: camara.id },
      data: { ocupacaoAtual: { increment: 1 } },
    });

    // Se paciente internado, registrar alta por óbito
    if (body.pacienteId) {
      await prisma.internamento.updateMany({
        where: {
          pacienteId: body.pacienteId,
          status: 'ACTIVO',
        },
        data: {
          status: 'ALTA',
          dataAlta: new Date(),
          motivoAlta: 'OBITO',
        },
      });
    }

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}