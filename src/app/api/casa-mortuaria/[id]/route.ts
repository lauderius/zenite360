import { NextRequest, NextResponse } from 'next/server';
import { mockGetById } from '@/lib/mockData';

// GET - Buscar registro de óbito por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    // Dados mock
    return mockGetById(id, 'Registro de Óbito');
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar registro' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar registro de óbito
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const body = await request.json();

    return NextResponse.json({
      id,
      ...body,
      message: 'Registro atualizado (mock)',
      _status: 'mock',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar registro' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar registro de óbito
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    return NextResponse.json({
      success: true,
      id,
      message: 'Registro deletado (mock)',
      _status: 'mock',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar registro' },
      { status: 500 }
    );
  }
}