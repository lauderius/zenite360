import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar documentos oficiais
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const status = searchParams.get('status');
    const prioridade = searchParams.get('prioridade');
    const tipoMovimentacao = searchParams.get('tipoMovimentacao');
    const departamentoId = searchParams.get('departamentoId');
    const search = searchParams.get('search');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { activo: true };

    if (tipo) where.tipo = tipo;
    if (status) where.status = status;
    if (prioridade) where.prioridade = prioridade;
    if (tipoMovimentacao) where.tipoMovimentacao = tipoMovimentacao;
    if (departamentoId) where.departamentoAtualId = parseInt(departamentoId);
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { assunto: { contains: search, mode: 'insensitive' } },
        { resumo: { contains: search, mode: 'insensitive' } },
        { protocoloExterno: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (dataInicio || dataFim) {
      where.dataDocumento = {};
      if (dataInicio) where.dataDocumento.gte = new Date(dataInicio);
      if (dataFim) where.dataDocumento.lte = new Date(dataFim);
    }

    const [documentos, total] = await Promise.all([
      prisma.documentoOficial.findMany({
        where,
        include: {
          elaboradoPor: { select: { nomeCompleto: true } },
          assinadoPor: { select: { nomeCompleto: true } },
          departamentoAtual: { select: { nome: true, sigla: true } },
          _count: { select: { tramitacoes: true } },
        },
        orderBy: [
          { prioridade: 'asc' },
          { dataDocumento: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.documentoOficial.count({ where }),
    ]);

    // Estatísticas
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const stats = await Promise.all([
      prisma.documentoOficial.count({ where: { dataDocumento: { gte: hoje }, activo: true } }),
      prisma.documentoOficial.count({ where: { prioridade: 'URGENTE', status: { notIn: ['ARQUIVADO', 'CANCELADO'] }, activo: true } }),
      prisma.documentoOficial.count({ where: { status: 'AGUARDANDO_ASSINATURA', activo: true } }),
    ]);

    return NextResponse.json({
      data: documentos,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        documentosHoje: stats[0],
        urgentes: stats[1],
        aguardandoAssinatura: stats[2],
      },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Criar novo documento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar número do documento
    const ano = new Date().getFullYear();
    const prefixos: Record<string, string> = {
      OFICIO: 'OF',
      MEMORANDO: 'MEM',
      CIRCULAR: 'CIR',
      PORTARIA: 'POR',
      RESOLUCAO: 'RES',
      DESPACHO: 'DES',
      PARECER: 'PAR',
      COMUNICADO: 'COM',
      ATA: 'ATA',
      CONTRATO: 'CON',
      CONVENIO: 'CVN',
      RELATORIO: 'REL',
      OUTROS: 'DOC',
    };

    const prefixo = prefixos[body.tipo] || 'DOC';
    const departamento = body.remetenteInterno?.substring(0, 2).toUpperCase() || 'SG';

    const count = await prisma.documentoOficial.count({
      where: {
        tipo: body.tipo,
        ano,
      },
    });

    const numero = `${prefixo}/${departamento}/${String(count + 1).padStart(3, '0')}/${ano}`;
    const codigo = `DOC-${ano}-${String(count + 1).padStart(5, '0')}`;

    const documento = await prisma.documentoOficial.create({
      data: {
        codigo,
        numero,
        ano,
        tipo: body.tipo,
        assunto: body.assunto,
        resumo: body.resumo,
        conteudo: body.conteudo,
        tipoMovimentacao: body.tipoMovimentacao,
        remetenteInterno: body.remetenteInterno,
        remetenteExterno: body.remetenteExterno,
        destinatarioInterno: body.destinatarioInterno,
        destinatarioExterno: body.destinatarioExterno,
        dataDocumento: new Date(body.dataDocumento || new Date()),
        prazoResposta: body.prazoResposta ? new Date(body.prazoResposta) : null,
        status: body.status || 'EM_ELABORACAO',
        prioridade: body.prioridade || 'NORMAL',
        elaboradoPorId: body.elaboradoPorId,
        departamentoAtualId: body.departamentoAtualId,
        protocoloExterno: body.protocoloExterno,
      },
      include: {
        elaboradoPor: { select: { nomeCompleto: true } },
        departamentoAtual: { select: { nome: true } },
      },
    });

    return NextResponse.json(documento, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}