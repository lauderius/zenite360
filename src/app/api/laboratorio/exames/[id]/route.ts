import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const exame = await prisma.exames_solicitados.findUnique({ where: { id: BigInt(id) } });
    if (!exame) return NextResponse.json({ message: 'Exame não encontrado' }, { status: 404 });

    const serialized = JSON.parse(
      JSON.stringify(exame, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );
    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error('[API_LAB_EXAMES_ID_GET]', error);
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

    // Campos controlados de resultado
    if (updateData.data_resultado) updateData.data_resultado = new Date(updateData.data_resultado);

    const updated = await prisma.exames_solicitados.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    const serialized = JSON.parse(
      JSON.stringify(updated, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error('[API_LAB_EXAMES_ID_PUT]', error);
    return handlePrismaError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.exames_solicitados.delete({ where: { id: BigInt(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[API_LAB_EXAMES_ID_DELETE]', error);
    return handlePrismaError(error);
  }
}
