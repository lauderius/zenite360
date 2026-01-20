import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';
import { gerarRelatorioManutencaoPDF } from '@/services/pdf/relatorioManutencao';

// GET - Listar ordens de manutenção
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tipo = searchParams.get('tipo');
    const prioridade = searchParams.get('prioridade');
    const ativoId = searchParams.get('ativoId');
    const tecnicoId = searchParams.get('tecnicoId');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (status) where.status = status;
    if (tipo) where.tipo = tipo;
    if (prioridade) where.prioridade = prioridade;
    if (ativoId) where.ativoId = parseInt(ativoId);
    if (tecnicoId) where.tecnicoId = parseInt(tecnicoId);
    if (dataInicio || dataFim) {
      where.dataAbertura = {};
      if (dataInicio) where.dataAbertura.gte = new Date(dataInicio);
      if (dataFim) where.dataAbertura.lte = new Date(dataFim);
    }

    const [ordens, total] = await Promise.all([
      prisma.ordemManutencao.findMany({
        where,
        include: {
          ativo: {
            select: { codigo: true, nome: true, localizacao: true, departamento: { select: { nome: true } } },
          },
          solicitante: { select: { nomeCompleto: true } },
          tecnico: { select: { nomeCompleto: true } },
        },
        orderBy: [
          { prioridade: 'asc' },
          { dataAbertura: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ordemManutencao.count({ where }),
    ]);

    return NextResponse.json({
      data: ordens,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Criar ordem de manutenção
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar código da OS
    const ano = new Date().getFullYear();
    const count = await prisma.ordemManutencao.count({
      where: {
        criadoEm: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${ano + 1}-01-01`),
        },
      },
    });
    const codigo = `OS-${ano}-${String(count + 1).padStart(5, '0')}`;

    // Criar ordem de manutenção
    const ordem = await prisma.ordemManutencao.create({
      data: {
        codigo,
        ativoId: body.ativoId,
        tipo: body.tipo,
        prioridade: body.prioridade,
        status: 'ABERTA',
        descricaoProblema: body.descricaoProblema,
        solicitanteId: body.solicitanteId,
        tecnicoId: body.tecnicoId,
        dataAbertura: new Date(),
        dataPrevisao: body.dataPrevisao ? new Date(body.dataPrevisao) : null,
      },
      include: {
        ativo: { select: { codigo: true, nome: true } },
        solicitante: { select: { nomeCompleto: true } },
      },
    });

    // Atualizar status do ativo
    await prisma.ativo.update({
      where: { id: body.ativoId },
      data: { status: 'EM_MANUTENCAO' },
    });

    // Gerar notificação para o técnico
    if (body.tecnicoId) {
      await prisma.notificacao.create({
        data: {
          tipo: 'MANUTENCAO',
          titulo: 'Nova Ordem de Manutenção',
          mensagem: `Você foi designado para a OS ${codigo} - ${ordem.ativo.nome}`,
          usuarioId: body.tecnicoId,
          link: `/patrimonio/manutencao/${ordem.id}`,
        },
      });
    }

    return NextResponse.json(ordem, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}