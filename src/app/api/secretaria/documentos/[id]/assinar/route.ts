import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// POST - Assinar documento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const documento = await prisma.documentoOficial.findUnique({
      where: { id },
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    if (documento.status !== 'AGUARDANDO_ASSINATURA') {
      return NextResponse.json(
        { error: 'Documento não está aguardando assinatura' },
        { status: 400 }
      );
    }

    // Atualizar documento com assinatura
    const documentoAssinado = await prisma.documentoOficial.update({
      where: { id },
      data: {
        status: 'ASSINADO',
        assinadoPorId: body.assinadoPorId,
        dataAssinatura: new Date(),
        assinaturaDigital: body.assinaturaDigital || `SIG-${Date.now()}`,
        atualizadoEm: new Date(),
      },
      include: {
        assinadoPor: { select: { nomeCompleto: true, cargo: true } },
      },
    });

    // Registrar no log
    await prisma.logAuditoria.create({
      data: {
        tabela: 'DocumentoOficial',
        registroId: id,
        acao: 'ASSINATURA',
        dadosNovos: JSON.stringify({
          assinadoPorId: body.assinadoPorId,
          dataAssinatura: new Date(),
        }),
        usuarioId: body.assinadoPorId,
      },
    });

    // Notificar elaborador
    if (documento.elaboradoPorId) {
      await prisma.notificacao.create({
        data: {
          tipo: 'DOCUMENTO_ASSINADO',
          titulo: `Documento assinado: ${documento.numero}`,
          mensagem: `O documento "${documento.assunto}" foi assinado por ${documentoAssinado.assinadoPor?.nomeCompleto}.`,
          usuarioId: documento.elaboradoPorId,
          link: `/secretaria/documentos/${id}`,
        },
      });
    }

    return NextResponse.json(documentoAssinado);
  } catch (error) {
    return handlePrismaError(error);
  }
}