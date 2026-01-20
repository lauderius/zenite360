import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar estoque da cozinha
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const apenasBaixo = searchParams.get('apenasBaixo') === 'true';

    const where: any = { activo: true };

    if (categoria) where.categoria = categoria;

    let itens = await prisma.estoqueCozinha.findMany({
      where,
      orderBy: [{ categoria: 'asc' }, { nome: 'asc' }],
    });

    if (apenasBaixo) {
      itens = itens.filter((item) => item.quantidadeAtual < item.quantidadeMinima);
    }

    // Verificar itens próximos da validade (7 dias)
    const hoje = new Date();
    const em7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    const itensProximosValidade = itens.filter(
      (item) => item.validade && new Date(item.validade) <= em7Dias
    );

    // Estatísticas
    const stats = {
      totalItens: itens.length,
      itensBaixoEstoque: itens.filter((i) => i.quantidadeAtual < i.quantidadeMinima).length,
      itensProximosValidade: itensProximosValidade.length,
      valorEstimadoEstoque: itens.reduce(
        (acc, i) => acc + (i.precoMedio || 0) * i.quantidadeAtual,
        0
      ),
    };

    return NextResponse.json({
      data: itens.map((item) => ({
        ...item,
        estoqueBaixo: item.quantidadeAtual < item.quantidadeMinima,
        proximoValidade: item.validade && new Date(item.validade) <= em7Dias,
      })),
      alertas: {
        baixoEstoque: itens.filter((i) => i.quantidadeAtual < i.quantidadeMinima),
        proximoValidade: itensProximosValidade,
      },
      stats,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Registrar movimentação de estoque
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await prisma.estoqueCozinha.findUnique({
      where: { id: body.itemId },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item não encontrado' },
        { status: 404 }
      );
    }

    // Calcular nova quantidade
    let novaQuantidade: number;
    switch (body.tipo) {
      case 'ENTRADA':
        novaQuantidade = item.quantidadeAtual + body.quantidade;
        break;
      case 'SAIDA':
        if (body.quantidade > item.quantidadeAtual) {
          return NextResponse.json(
            { error: 'Quantidade insuficiente em estoque' },
            { status: 400 }
          );
        }
        novaQuantidade = item.quantidadeAtual - body.quantidade;
        break;
      case 'AJUSTE':
        novaQuantidade = body.quantidade;
        break;
      case 'PERDA':
        novaQuantidade = item.quantidadeAtual - body.quantidade;
        if (novaQuantidade < 0) novaQuantidade = 0;
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de movimentação inválido' },
          { status: 400 }
        );
    }

    // Registrar movimentação
    const movimentacao = await prisma.movimentacaoEstoqueCozinha.create({
      data: {
        itemId: body.itemId,
        tipo: body.tipo,
        quantidade: body.quantidade,
        quantidadeAnterior: item.quantidadeAtual,
        quantidadeAtual: novaQuantidade,
        motivo: body.motivo,
        documentoReferencia: body.documentoReferencia,
        fornecedor: body.fornecedor,
        lote: body.lote,
        validade: body.validade ? new Date(body.validade) : null,
        responsavelId: body.responsavelId,
        dataHora: new Date(),
        observacoes: body.observacoes,
      },
    });

    // Atualizar estoque
    await prisma.estoqueCozinha.update({
      where: { id: body.itemId },
      data: {
        quantidadeAtual: novaQuantidade,
        ultimaEntrada: body.tipo === 'ENTRADA' ? new Date() : undefined,
        ultimaSaida: body.tipo === 'SAIDA' ? new Date() : undefined,
        lote: body.lote || undefined,
        validade: body.validade ? new Date(body.validade) : undefined,
      },
    });

    // Gerar alerta se estoque baixo
    if (novaQuantidade < item.quantidadeMinima) {
      await prisma.alerta.create({
        data: {
          tipo: 'ESTOQUE_BAIXO',
          modulo: 'COZINHA',
          titulo: `Estoque baixo: ${item.nome}`,
          mensagem: `O item ${item.nome} está com estoque baixo (${novaQuantidade} ${item.unidadeMedida}). Mínimo: ${item.quantidadeMinima}`,
          severidade: novaQuantidade === 0 ? 'CRITICO' : 'AVISO',
        },
      });
    }

    return NextResponse.json(movimentacao, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}