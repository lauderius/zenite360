import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar ativos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const status = searchParams.get('status');
    const departamentoId = searchParams.get('departamentoId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { activo: true };

    if (categoria) where.categoria = categoria;
    if (status) where.status = status;
    if (departamentoId) where.departamentoId = parseInt(departamentoId);
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
        { numeroPatrimonio: { contains: search, mode: 'insensitive' } },
        { marca: { contains: search, mode: 'insensitive' } },
        { modelo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [ativos, total] = await Promise.all([
      prisma.ativo.findMany({
        where,
        include: {
          departamento: { select: { nome: true, sigla: true } },
          responsavel: { select: { nomeCompleto: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ativo.count({ where }),
    ]);

    return NextResponse.json({
      data: ativos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Criar novo ativo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar código automático se não fornecido
    if (!body.codigo) {
      const ultimoAtivo = await prisma.ativo.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      body.codigo = `EQP-${String((ultimoAtivo?.id || 0) + 1).padStart(5, '0')}`;
    }

    // Gerar número de patrimônio
    if (!body.numeroPatrimonio) {
      const ano = new Date().getFullYear();
      const count = await prisma.ativo.count({
        where: {
          criadoEm: {
            gte: new Date(`${ano}-01-01`),
            lt: new Date(`${ano + 1}-01-01`),
          },
        },
      });
      body.numeroPatrimonio = `PAT-${ano}-${String(count + 1).padStart(5, '0')}`;
    }

    const ativo = await prisma.ativo.create({
      data: {
        ...body,
        dataAquisicao: new Date(body.dataAquisicao),
        garantiaAte: body.garantiaAte ? new Date(body.garantiaAte) : null,
        proximaManutencao: body.proximaManutencao ? new Date(body.proximaManutencao) : null,
        validadeCalibracao: body.validadeCalibracao ? new Date(body.validadeCalibracao) : null,
      },
      include: {
        departamento: { select: { nome: true } },
      },
    });

    // Registrar no log de auditoria
    await prisma.logAuditoria.create({
      data: {
        tabela: 'Ativo',
        registroId: ativo.id,
        acao: 'CREATE',
        dadosNovos: JSON.stringify(ativo),
        usuarioId: body.usuarioId,
      },
    });

    return NextResponse.json(ativo, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}