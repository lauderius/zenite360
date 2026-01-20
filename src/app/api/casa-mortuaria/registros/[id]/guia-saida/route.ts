import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';
import { gerarGuiaSaidaCorpoPDF } from '@/services/pdf/guiaSaidaCorpo';

// POST - Emitir guia de saída de corpo
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const registro = await prisma.registroObito.findUnique({
      where: { id },
      include: {
        medicoResponsavel: { select: { nomeCompleto: true } },
      },
    });

    if (!registro) {
      return NextResponse.json(
        { error: 'Registro de óbito não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se declaração de óbito foi emitida
    if (!registro.declaracaoObitoEmitida) {
      return NextResponse.json(
        { error: 'Declaração de óbito não emitida. Emita a declaração antes da guia de saída.' },
        { status: 400 }
      );
    }

    // Gerar número da guia
    const ano = new Date().getFullYear();
    const count = await prisma.guiaSaidaCorpo.count({
      where: {
        dataEmissao: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${ano + 1}-01-01`),
        },
      },
    });
    const numero = `GS-${ano}-${String(count + 1).padStart(5, '0')}`;

    // Criar guia de saída
    const guia = await prisma.guiaSaidaCorpo.create({
      data: {
        numero,
        registroObitoId: id,
        dataEmissao: new Date(),
        horaEmissao: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
        responsavelRetirada: body.responsavelRetirada,
        documentoResponsavel: body.documentoResponsavel,
        parentesco: body.parentesco,
        funeraria: body.funeraria,
        destino: body.destino,
        emitidoPorId: body.emitidoPorId,
        observacoes: body.observacoes,
      },
      include: {
        registroObito: true,
        emitidoPor: { select: { nomeCompleto: true } },
      },
    });

    // Atualizar registro de óbito
    await prisma.registroObito.update({
      where: { id },
      data: {
        status: 'LIBERADO',
        dataLiberacao: new Date(),
        liberadoPara: body.responsavelRetirada,
        destinoCorpo: body.destino,
        funerariaResponsavel: body.funeraria,
        guiaSaidaEmitida: true,
        guiaSaidaNumero: numero,
      },
    });

    // Atualizar ocupação da câmara
    await prisma.camaraFria.updateMany({
      where: { codigo: registro.camaraFria },
      data: { ocupacaoAtual: { decrement: 1 } },
    });

    // Gerar PDF
    const pdfBuffer = await gerarGuiaSaidaCorpoPDF(guia);
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      guia,
      pdf: pdfBase64,
      message: 'Guia de saída emitida com sucesso',
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}