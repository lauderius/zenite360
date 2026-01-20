import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// POST - Tramitar documento
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

    // Criar tramitação
    const tramitacao = await prisma.tramitacaoDocumento.create({
      data: {
        documentoId: id,
        despacho: body.despacho,
        departamentoOrigemId: documento.departamentoAtualId!,
        departamentoDestinoId: body.departamentoDestinoId,
        responsavelOrigemId: body.responsavelOrigemId,
        responsavelDestinoId: body.responsavelDestinoId,
        dataEnvio: new Date(),
        status: 'ENVIADO',
        observacoes: body.observacoes,
      },
      include: {
        departamentoOrigem: { select: { nome: true, sigla: true } },
        departamentoDestino: { select: { nome: true, sigla: true } },
        responsavelOrigem: { select: { nomeCompleto: true } },
        responsavelDestino: { select: { nomeCompleto: true } },
      },
    });

    // Atualizar documento
    await prisma.documentoOficial.update({
      where: { id },
      data: {
        departamentoAtualId: body.departamentoDestinoId,
        atualizadoEm: new Date(),
      },
    });

    // Notificar destinatário
    if (body.responsavelDestinoId) {
      await prisma.notificacao.create({
        data: {
          tipo: 'DOCUMENTO_RECEBIDO',
          titulo: `Novo documento recebido: ${documento.numero}`,
          mensagem: `Você recebeu o documento "${documento.assunto}" para análise.`,
          usuarioId: body.responsavelDestinoId,
          link: `/secretaria/documentos/${id}`,
          prioridade: documento.prioridade === 'URGENTE' ? 'ALTA' : 'MEDIA',
        },
      });
    }

    return NextResponse.json(tramitacao, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}