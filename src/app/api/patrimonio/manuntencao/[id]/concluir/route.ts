import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';
import { gerarRelatorioManutencaoPDF } from '@/services/pdf/relatorioManutencao';

// POST - Concluir ordem de manutenção
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const ordem = await prisma.ordemManutencao.findUnique({
      where: { id },
      include: { ativo: true },
    });

    if (!ordem) {
      return NextResponse.json(
        { error: 'Ordem de manutenção não encontrada' },
        { status: 404 }
      );
    }

    // Calcular tempo de parada
    const dataInicio = ordem.dataInicio || ordem.dataAbertura;
    const dataConclusao = new Date();
    const tempoParadaHoras = Math.round(
      (dataConclusao.getTime() - dataInicio.getTime()) / (1000 * 60 * 60)
    );

    // Calcular custos
    const custoPecas = body.pecasUtilizadas?.reduce(
      (acc: number, peca: any) => acc + peca.valorTotal,
      0
    ) || 0;
    const custoMaoObra = body.custoMaoObra || 0;
    const custoTotal = custoPecas + custoMaoObra;

    // Atualizar ordem
    const ordemAtualizada = await prisma.ordemManutencao.update({
      where: { id },
      data: {
        status: 'CONCLUIDA',
        dataConclusao,
        tempoParadaHoras,
        diagnostico: body.diagnostico,
        solucaoAplicada: body.solucaoAplicada,
        relatorioTecnico: body.relatorioTecnico,
        custoMaoObra,
        custoPecas,
        custoTotal,
        atualizadoEm: new Date(),
      },
      include: {
        ativo: true,
        tecnico: { select: { nomeCompleto: true } },
        solicitante: { select: { nomeCompleto: true } },
      },
    });

    // Registrar peças utilizadas
    if (body.pecasUtilizadas?.length > 0) {
      await prisma.pecaUtilizada.createMany({
        data: body.pecasUtilizadas.map((peca: any) => ({
          ordemId: id,
          ...peca,
        })),
      });
    }

    // Atualizar ativo
    await prisma.ativo.update({
      where: { id: ordem.ativoId },
      data: {
        status: 'OPERACIONAL',
        ultimaManutencao: dataConclusao,
        proximaManutencao: body.proximaManutencao
          ? new Date(body.proximaManutencao)
          : new Date(Date.now() + ordem.ativo.intervaloManutencaoDias! * 24 * 60 * 60 * 1000),
      },
    });

    // Gerar PDF do relatório
    const pdfBuffer = await gerarRelatorioManutencaoPDF(ordemAtualizada);
    
    // Salvar PDF
    const pdfPath = `/documentos/manutencao/${ordemAtualizada.codigo}.pdf`;
    // Implementar salvamento do arquivo...

    // Registrar custo no financeiro (integração)
    await prisma.lancamentoFinanceiro.create({
      data: {
        tipo: 'DESPESA',
        categoria: 'MANUTENCAO_EQUIPAMENTOS',
        descricao: `Manutenção ${ordemAtualizada.tipo} - ${ordem.ativo.nome} (${ordemAtualizada.codigo})`,
        valor: custoTotal,
        data: dataConclusao,
        departamentoId: ordem.ativo.departamentoId,
        documentoReferencia: ordemAtualizada.codigo,
        status: 'PENDENTE',
      },
    });

    return NextResponse.json({
      ordem: ordemAtualizada,
      pdfPath,
      message: 'Manutenção concluída com sucesso',
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}