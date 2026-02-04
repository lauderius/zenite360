import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const paciente = await prisma.pacientes.findUnique({
            where: { id: BigInt(id) },
            include: {
                agendamentos: {
                    take: 10,
                    orderBy: { created_at: 'desc' },
                    include: { utilizadores_agendamentos_medico_idToutilizadores: { select: { name: true } } }
                },
                consultas: {
                    take: 10,
                    orderBy: { created_at: 'desc' },
                    include: { utilizadores_consultas_medico_idToutilizadores: { select: { name: true } } }
                },
                exames_solicitados: { take: 10, orderBy: { created_at: 'desc' } }
            }
        });

        if (!paciente) {
            return NextResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
        }

        const serialized = JSON.parse(JSON.stringify(paciente, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error('[API_PACIENTE_ID_GET]', error);
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
        const updateData = { ...body };

        // Remover campos sensíveis ou IDs que não devem ser alterados
        delete updateData.id;
        delete updateData.created_at;

        if (updateData.data_nascimento) {
            updateData.data_nascimento = new Date(updateData.data_nascimento);
        }

        const pacienteActualizado = await prisma.pacientes.update({
            where: { id: BigInt(id) },
            data: updateData
        });

        const serialized = JSON.parse(JSON.stringify(pacienteActualizado, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error('[API_PACIENTE_ID_PUT]', error);
        return handlePrismaError(error);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // Soft delete
        await prisma.pacientes.update({
            where: { id: BigInt(id) },
            data: { deleted_at: new Date() }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[API_PACIENTE_ID_DELETE]', error);
        return handlePrismaError(error);
    }
}
