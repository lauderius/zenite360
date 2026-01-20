import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar contratos de terceiros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { activo: true };

    if (tipo) where.tipo = tipo;
    if (status) where.status = status;

    const [contratos, total] = await Promise.all([
      prisma.contratoTerceiro.findMany({
        where,
        include: {
          gestorInterno: { select: { nomeCompleto: true } },
          _count: { select: { funcionariosTerceirizados: true } },
        },
        orderBy: [{ status: 'asc' }, { dataFim: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contratoTerceiro.count({ where }),
    ]);

    // Calcular dias para vencimento e atualizar status se necessário
    const hoje = new Date();
    const contratosComDias = await Promise.all(
      contratos.map(async (contrato) => {
        const diasParaVencimento = Math.ceil(
          (contrato.dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        );

        let novoStatus = contrato.status;
        if (diasParaVencimento < 0 && contrato.status !== 'VENCIDO') {
          novoStatus = 'VENCIDO';
        } else if (diasParaVencimento <= 30 && diasParaVencimento >= 0 && contrato.status === 'VIGENTE') {
          novoStatus = 'PROXIMO_VENCIMENTO';
        }

        if (novoStatus !== contrato.status) {
          await prisma.contratoTerceiro.update({
            where: { id: contrato.id },
            data: { status: novoStatus },
          });
        }

        return {
          ...contrato,
          diasParaVencimento,
          status: novoStatus,
          quantidadeFuncionarios: contrato._count.funcionariosTerceirizados,
        };
      })
    );

    // Estatísticas
    const stats = {
      vigentes: contratosComDias.filter((c) => c.status === 'VIGENTE').length,
      proximoVencimento: contratosComDias.filter((c) => c.status === 'PROXIMO_VENCIMENTO').length,
      vencidos: contratosComDias.filter((c) => c.status === 'VENCIDO').length,
      valorTotalMensal: contratosComDias
        .filter((c) => c.status === 'VIGENTE' || c.status === 'PROXIMO_VENCIMENTO')
        .reduce((acc, c) => acc + c.valorMensal, 0),
      totalFuncionarios: contratosComDias.reduce((acc, c) => acc + c.quantidadeFuncionarios, 0),
    };

    return NextResponse.json({
      data: contratosComDias,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Criar novo contrato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar código
    const ano = new Date().getFullYear();
    const count = await prisma.contratoTerceiro.count({
      where: {
        criadoEm: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${ano + 1}-01-01`),
        },
      },
    });
    const codigo = `CT-${ano}-${String(count + 1).padStart(3, '0')}`;

    const contrato = await prisma.contratoTerceiro.create({
      data: {
        codigo,
        ...body,
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim),
        status: 'VIGENTE',
      },
      include: {
        gestorInterno: { select: { nomeCompleto: true } },
      },
    });

    // Agendar notificação de vencimento
    if (body.avisarDiasAntes) {
      const dataAviso = new Date(body.dataFim);
      dataAviso.setDate(dataAviso.getDate() - body.avisarDiasAntes);

      await prisma.agendamentoNotificacao.create({
        data: {
          tipo: 'VENCIMENTO_CONTRATO',
          dataAgendada: dataAviso,
          destinatarioId: body.gestorInternoId,
          titulo: `Contrato próximo do vencimento: ${contrato.empresaContratada}`,
          mensagem: `O contrato ${codigo} vence em ${body.avisarDiasAntes} dias.`,
          link: `/servicos-gerais/contratos/${contrato.id}`,
        },
      });
    }

    // Registrar no financeiro (compromisso mensal)
    await prisma.compromissoFinanceiro.create({
      data: {
        tipo: 'CONTRATO_TERCEIRO',
        descricao: `Contrato ${codigo} - ${body.empresaContratada}`,
        valorMensal: body.valorMensal,
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim),
        contratoId: contrato.id,
        status: 'ATIVO',
      },
    });

    return NextResponse.json(contrato, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}