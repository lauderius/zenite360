import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar requisições de material
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const departamentoId = searchParams.get('departamentoId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) where.status = status;
    if (departamentoId) where.departamentoSolicitanteId = parseInt(departamentoId);

    const [requisicoes, total] = await Promise.all([
      prisma.requisicaoMaterial.findMany({
        where,
        include: {
          departamentoSolicitante: { select: { nome: true, sigla: true } },
          solicitante: { select: { nomeCompleto: true } },
          aprovadoPor: { select: { nomeCompleto: true } },
          itens: {
            include: {
              suprimento: { select: { nome: true, unidadeMedida: true, quantidadeAtual: true } },
            },
          },
        },
        orderBy: [{ prioridade: 'asc' }, { dataSolicitacao: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.requisicaoMaterial.count({ where }),
    ]);

    return NextResponse.json({
      data: requisicoes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Criar requisição de material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar código
    const ano = new Date().getFullYear();
    const count = await prisma.requisicaoMaterial.count({
      where: {
        criadoEm: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${ano + 1}-01-01`),
        },
      },
    });
    const codigo = `REQ-${ano}-${String(count + 1).padStart(3, '0')}`;

    const requisicao = await prisma.requisicaoMaterial.create({
      data: {
        codigo,
        departamentoSolicitanteId: body.departamentoSolicitanteId,
        solicitanteId: body.solicitanteId,
        dataSolicitacao: new Date(),
        status: 'PENDENTE',
        prioridade: body.prioridade || 'NORMAL',
        justificativa: body.justificativa,
        itens: {
          create: body.itens.map((item: any) => ({
            suprimentoId: item.suprimentoId,
            quantidadeSolicitada: item.quantidadeSolicitada,
            observacao: item.observacao,
          })),
        },
      },
      include: {
        departamentoSolicitante: { select: { nome: true } },
        solicitante: { select: { nomeCompleto: true } },
        itens: {
          include: { suprimento: true },
        },
      },
    });

    // Notificar responsáveis da secretaria
    const responsaveis = await prisma.funcionario.findMany({
      where: {
        departamento: { sigla: 'SEC' },
        activo: true,
      },
      select: { id: true },
    });

    await prisma.notificacao.createMany({
      data: responsaveis.map((r) => ({
        tipo: 'REQUISICAO_MATERIAL',
        titulo: `Nova requisição de material: ${codigo}`,
        mensagem: `${requisicao.departamentoSolicitante.nome} solicitou ${requisicao.itens.length} item(ns).`,
        usuarioId: r.id,
        link: `/secretaria/requisicoes/${requisicao.id}`,
      })),
    });

    return NextResponse.json(requisicao, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}