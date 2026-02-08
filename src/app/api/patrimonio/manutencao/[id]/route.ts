import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = BigInt(params.id);
        const ordem = await prisma.ordens_manutencao.findUnique({
            where: { id },
        });

        if (!ordem) {
            return NextResponse.json({ success: false, error: 'Ordem não encontrada' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                ...ordem,
                id: Number(ordem.id),
                ativo_id: Number(ordem.ativo_id),
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erro ao buscar ordem' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = BigInt(params.id);
        const body = await request.json();

        const ordemAtualizada = await prisma.ordens_manutencao.update({
            where: { id },
            data: {
                tipo: body.tipo,
                descricao: body.descricao,
                prioridade: body.prioridade,
                status: body.status,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                ...ordemAtualizada,
                id: Number(ordemAtualizada.id),
                ativo_id: Number(ordemAtualizada.ativo_id),
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erro ao atualizar ordem' }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = BigInt(params.id);
        await prisma.ordens_manutencao.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Ordem deletada com sucesso' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erro ao deletar ordem' }, { status: 500 });
    }
}
