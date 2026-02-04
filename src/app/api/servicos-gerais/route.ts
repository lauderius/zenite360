import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const registros = await prisma.registros_servicos_gerais.findMany({
            orderBy: { created_at: 'desc' },
        });

        const data = registros.map(r => ({
            ...r,
            id: Number(r.id),
            codigo: `SERV-${String(r.id).padStart(6, '0')}`,
            data: r.data_evento,
        }));

        return NextResponse.json({ data, success: true });
    } catch (error) {
        console.error('Erro ao buscar serviços gerais:', error);
        return NextResponse.json({ data: [], success: false }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const registro = await prisma.registros_servicos_gerais.create({
            data: {
                tipo: body.tipo,
                descricao: body.descricao,
                data_evento: new Date(body.data || Date.now()),
                status: 'Ativo',
            },
        });

        return NextResponse.json({ data: { ...registro, id: Number(registro.id) }, success: true }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar registro de serviço geral:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
