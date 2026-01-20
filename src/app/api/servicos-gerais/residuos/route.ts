import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';
import { gerarManifestoResiduosPDF } from '@/services/pdf/manifestoResiduos';

// GET - Listar coletas de resíduos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (status) where.status = status;
    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data.gte = new Date(dataInicio);
      if (dataFim) where.data.lte = new Date(dataFim);
    }

    const [coletas, total] = await Promise.all([
      prisma.coletaResiduo.findMany({
        where,
        include: {
          coletor: { select: { nomeCompleto: true } },
          itens: {
            include: {
              residuo: { select: { classe: true, descricao: true } },
            },
          },
        },
        orderBy: { data: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coletaResiduo.count({ where }),
    ]);

    // Estatísticas do mês
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const estatsMes = await prisma.coletaResiduo.aggregate({
      where: {
        data: { gte: inicioMes },
        status: 'CONCLUIDA',
      },
      _sum: { pesoTotalKg: true, volumeTotalLitros: true },
      _count: true,
    });

    // Resíduos por classe
    const residuosPorClasse = await prisma.$queryRaw`
      SELECT 
        r.classe,
        SUM(i.peso_kg) as peso_total
      FROM item_coleta_residuo i
      JOIN residuo_hospitalar r ON i.residuo_id = r.id
      JOIN coleta_residuo c ON i.coleta_id = c.id
      WHERE c.data >= ${inicioMes} AND c.status = 'CONCLUIDA'
      GROUP BY r.classe
      ORDER BY peso_total DESC
    `;

    return NextResponse.json({
      data: coletas,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      estatisticas: {
        coletasMes: estatsMes._count,
        pesoTotalMes: estatsMes._sum.pesoTotalKg || 0,
        volumeTotalMes: estatsMes._sum.volumeTotalLitros || 0,
        porClasse: residuosPorClasse,
      },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Registrar nova coleta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Gerar código
    const ano = new Date().getFullYear();
    const count = await prisma.coletaResiduo.count({
      where: {
        criadoEm: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${ano + 1}-01-01`),
        },
      },
    });
    const codigo = `COL-${ano}-${String(count + 1).padStart(4, '0')}`;

    // Calcular totais
    const pesoTotalKg = body.itens.reduce((acc: number, item: any) => acc + item.pesoKg, 0);
    const volumeTotalLitros = body.itens.reduce((acc: number, item: any) => acc + (item.volumeLitros || 0), 0);

    // Criar coleta
    const coleta = await prisma.coletaResiduo.create({
      data: {
        codigo,
        data: new Date(body.data),
        turno: body.turno,
        status: body.status || 'CONCLUIDA',
        coletorId: body.coletorId,
        pesoTotalKg,
        volumeTotalLitros,
        empresaColetaExterna: body.empresaColetaExterna,
        responsavelExterno: body.responsavelExterno,
        veiculoPlaca: body.veiculoPlaca,
        destinoFinal: body.destinoFinal,
        observacoes: body.observacoes,
        itens: {
          create: body.itens.map((item: any) => ({
            residuoId: item.residuoId,
            setorOrigem: item.setorOrigem,
            quantidade: item.quantidade,
            pesoKg: item.pesoKg,
            volumeLitros: item.volumeLitros,
            recipiente: item.recipiente,
            observacao: item.observacao,
          })),
        },
      },
      include: {
        coletor: { select: { nomeCompleto: true } },
        itens: {
          include: {
            residuo: true,
          },
        },
      },
    });

    // Gerar manifesto de resíduos
    const manifestoNumero = `MAN-${ano}-${String(count + 1).padStart(4, '0')}`;
    const pdfBuffer = await gerarManifestoResiduosPDF(coleta, manifestoNumero);

    // Atualizar coleta com manifesto
    await prisma.coletaResiduo.update({
      where: { id: coleta.id },
      data: {
        manifestoNumero,
        manifestoEmitido: true,
      },
    });

    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      coleta: { ...coleta, manifestoNumero, manifestoEmitido: true },
      manifesto: pdfBase64,
    }, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}