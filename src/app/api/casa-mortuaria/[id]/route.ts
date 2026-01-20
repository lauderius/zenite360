import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Buscar registro de óbito por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const registro = await prisma.registroObito.findUnique({
      where: { id },
      include: {
        paciente: {
          select: {
            id: true,
            nomeCompleto: true,
            numeroProcesso: true,
            dataNascimento: true,
          },
        },
        medicoResponsavel: {
          select: { id: true, nomeCompleto: true, especialidade: true },
        },
        guiasSaida: {
          include: {
            emitidoPor: { select: { nomeCompleto: true } },
          },
        },
      },
    });

    if (!registro) {
      return NextResponse.json(
        { error: 'Registro de óbito não encontrado' },
        { status: 404 }
      );
    }

    // Calcular tempo de conservação
    const tempoConservacaoHoras = Math.round(
      (Date.now() - new Date(registro.dataAdmissao).getTime()) / (1000 * 60 * 60)
    );

    return NextResponse.json({
      ...registro,
      tempoConservacaoHoras,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// PUT - Atualizar registro de óbito
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const registroAnterior = await prisma.registroObito.findUnique({
      where: { id },
    });

    if (!registroAnterior) {
      return NextResponse.json(
        { error: 'Registro de óbito não encontrado' },
        { status: 404 }
      );
    }

    // Se mudou de câmara, atualizar ocupações
    if (body.camaraFria && body.camaraFria !== registroAnterior.camaraFria) {
      // Decrementar câmara anterior
      await prisma.camaraFria.updateMany({
        where: { codigo: registroAnterior.camaraFria },
        data: { ocupacaoAtual: { decrement: 1 } },
      });

      // Verificar e incrementar nova câmara
      const novaCamara = await prisma.camaraFria.findFirst({
        where: { codigo: body.camaraFria },
      });

      if (!novaCamara) {
        return NextResponse.json(
          { error: 'Câmara fria não encontrada' },
          { status: 400 }
        );
      }

      if (novaCamara.ocupacaoAtual >= novaCamara.capacidade) {
        return NextResponse.json(
          { error: 'Câmara fria sem capacidade disponível' },
          { status: 400 }
        );
      }

      await prisma.camaraFria.update({
        where: { id: novaCamara.id },
        data: { ocupacaoAtual: { increment: 1 } },
      });
    }

    const registro = await prisma.registroObito.update({
      where: { id },
      data: {
        ...body,
        dataHoraObito: body.dataHoraObito ? new Date(body.dataHoraObito) : undefined,
        dataNascimento: body.dataNascimento ? new Date(body.dataNascimento) : undefined,
        atualizadoEm: new Date(),
      },
    });

    return NextResponse.json(registro);
  } catch (error) {
    return handlePrismaError(error);
  }
}