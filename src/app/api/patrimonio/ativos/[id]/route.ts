import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const ativo = await prisma.ativos_patrimonio.findUnique({
      where: { id },
    });

    if (!ativo) {
      return NextResponse.json({ success: false, error: 'Ativo não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...ativo,
        id: Number(ativo.id),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar ativo' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();

    const ativoAtualizado = await prisma.ativos_patrimonio.update({
      where: { id },
      data: {
        nome: body.nome,
        categoria: body.categoria,
        marca: body.marca,
        modelo: body.modelo,
        numero_serie: body.numero_serie,
        localizacao: body.localizacao,
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...ativoAtualizado,
        id: Number(ativoAtualizado.id),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar ativo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    await prisma.ativos_patrimonio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Ativo deletado com sucesso' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao deletar ativo' }, { status: 500 });
  }
}
