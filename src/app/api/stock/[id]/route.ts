import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const item = await prisma.artigos_stock.findUnique({ where: { id: BigInt(id) } });
    if (!item) return NextResponse.json({ message: 'Item não encontrado' }, { status: 404 });

    const serialized = JSON.parse(JSON.stringify(item, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('[API_STOCK_ID_GET]', error);
    return handlePrismaError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updateData: any = { ...body };

    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    if (updateData.quantidade_stock !== undefined) {
      updateData.quantidade_stock = Number(updateData.quantidade_stock);
    }
    if (updateData.stock_minimo !== undefined) {
      updateData.stock_minimo = Number(updateData.stock_minimo);
    }
    if (updateData.preco_venda !== undefined) {
      updateData.preco_venda = Number(updateData.preco_venda);
    }

    const updated = await prisma.artigos_stock.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    const serialized = JSON.parse(JSON.stringify(updated, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('[API_STOCK_ID_PUT]', error);
    return handlePrismaError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Soft delete se a coluna deleted_at existir no modelo. Caso não exista, usar delete.
    try {
      const updated = await prisma.artigos_stock.update({
        where: { id: BigInt(id) },
        data: { deleted_at: new Date() } as any,
      });
      return new NextResponse(null, { status: 204 });
    } catch (e) {
      // Se o update falhar por inexistência de coluna, efetuar delete hard.
      await prisma.artigos_stock.delete({ where: { id: BigInt(id) } });
      return new NextResponse(null, { status: 204 });
    }
  } catch (error) {
    console.error('[API_STOCK_ID_DELETE]', error);
    return handlePrismaError(error);
  }
}
