import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Estatísticas da casa mortuária
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mes'; // dia, semana, mes, ano
    const dataRef = searchParams.get('data') ? new Date(searchParams.get('data')!) : new Date();

    let dataInicio: Date;
    let dataFim: Date = new Date(dataRef);
    dataFim.setHours(23, 59, 59, 999);

    switch (periodo) {
      case 'dia':
        dataInicio = new Date(dataRef);
        dataInicio.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        dataInicio = new Date(dataRef);
        dataInicio.setDate(dataInicio.getDate() - 7);
        break;
      case 'ano':
        dataInicio = new Date(dataRef.getFullYear(), 0, 1);
        break;
      case 'mes':
      default:
        dataInicio = new Date(dataRef.getFullYear(), dataRef.getMonth(), 1);
        break;
    }

    // Buscar dados
    const registros = await prisma.registroObito.findMany({
      where: {
        dataAdmissao: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        id: true,
        genero: true,
        idade: true,
        causaObito: true,
        localObito: true,
        dataAdmissao: true,
        dataLiberacao: true,
        autopsiaRealizada: true,
      },
    });

    // Estatísticas gerais
    const totalObitos = registros.length;
    const totalAutopsias = registros.filter((r) => r.autopsiaRealizada).length;

    // Por gênero
    const porGenero = registros.reduce((acc, r) => {
      acc[r.genero] = (acc[r.genero] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por causa
    const porCausa = registros.reduce((acc, r) => {
      acc[r.causaObito] = (acc[r.causaObito] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por faixa etária
    const faixasEtarias = {
      '0-1': 0,
      '1-12': 0,
      '13-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61-75': 0,
      '76+': 0,
    };

    registros.forEach((r) => {
      if (r.idade === null || r.idade === undefined) return;
      if (r.idade < 1) faixasEtarias['0-1']++;
      else if (r.idade <= 12) faixasEtarias['1-12']++;
      else if (r.idade <= 18) faixasEtarias['13-18']++;
      else if (r.idade <= 30) faixasEtarias['19-30']++;
      else if (r.idade <= 45) faixasEtarias['31-45']++;
      else if (r.idade <= 60) faixasEtarias['46-60']++;
      else if (r.idade <= 75) faixasEtarias['61-75']++;
      else faixasEtarias['76+']++;
    });

    // Por local de óbito
    const porLocal = registros.reduce((acc, r) => {
      const local = r.localObito.split(' - ')[0]; // Pegar só o setor principal
      acc[local] = (acc[local] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tempo médio de conservação
    const temposConservacao = registros
      .filter((r) => r.dataLiberacao)
      .map((r) => {
        const entrada = new Date(r.dataAdmissao).getTime();
        const saida = new Date(r.dataLiberacao!).getTime();
        return (saida - entrada) / (1000 * 60 * 60); // em horas
      });
    const tempoMedioConservacao =
      temposConservacao.length > 0
        ? temposConservacao.reduce((a, b) => a + b, 0) / temposConservacao.length
        : 0;

    // Evolução diária (para gráfico)
    const evolucaoDiaria = await prisma.$queryRaw`
      SELECT 
        DATE(data_admissao) as data,
        COUNT(*) as quantidade
      FROM registro_obito
      WHERE data_admissao >= ${dataInicio} AND data_admissao <= ${dataFim}
      GROUP BY DATE(data_admissao)
      ORDER BY data
    `;

    // Câmaras frias - ocupação atual
    const camaras = await prisma.camaraFria.findMany({
      where: { activo: true },
      select: {
        codigo: true,
        nome: true,
        capacidade: true,
        ocupacaoAtual: true,
        temperaturaAtual: true,
        status: true,
      },
    });

    const ocupacaoTotal = camaras.reduce((acc, c) => acc + c.ocupacaoAtual, 0);
    const capacidadeTotal = camaras.reduce((acc, c) => acc + c.capacidade, 0);

    return NextResponse.json({
      periodo: { inicio: dataInicio, fim: dataFim },
      resumo: {
        totalObitos,
        totalAutopsias,
        taxaAutopsia: totalObitos > 0 ? ((totalAutopsias / totalObitos) * 100).toFixed(1) : 0,
        tempoMedioConservacao: tempoMedioConservacao.toFixed(1),
        ocupacaoAtual: ocupacaoTotal,
        capacidadeTotal,
        percentualOcupacao: capacidadeTotal > 0 ? ((ocupacaoTotal / capacidadeTotal) * 100).toFixed(1) : 0,
      },
      distribuicao: {
        porGenero: Object.entries(porGenero).map(([genero, quantidade]) => ({ genero, quantidade })),
        porCausa: Object.entries(porCausa).map(([causa, quantidade]) => ({ causa, quantidade })),
        porFaixaEtaria: Object.entries(faixasEtarias).map(([faixa, quantidade]) => ({ faixa, quantidade })),
        porLocal: Object.entries(porLocal)
          .map(([local, quantidade]) => ({ local, quantidade }))
          .sort((a, b) => b.quantidade - a.quantidade),
      },
      evolucaoDiaria,
      camaras,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}