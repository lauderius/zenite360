import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const atividades = await prisma.atividades_recentes.findMany({
            where: {
                utilizador_id: BigInt(userId),
            },
            orderBy: {
                created_at: 'desc',
            },
            take: 10,
        });

        // Converter BigInt para Number/String para o JSON
        const atividadesFormatadas = atividades.map((at) => ({
            ...at,
            id: at.id.toString(),
            utilizador_id: at.utilizador_id.toString(),
        }));

        return NextResponse.json(atividadesFormatadas);
    } catch (error: any) {
        console.error('Erro ao buscar atividades:', error);
        return NextResponse.json(
            { error: 'Erro interno no servidor', message: error.message },
            { status: 500 }
        );
    }
}
