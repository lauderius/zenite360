import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('categoria');
        const query = searchParams.get('q');

        const stock = await prisma.artigos_stock.findMany({
            where: {
                AND: [
                    category ? { categoria: category as any } : {},
                    query ? { nome_artigo: { contains: query } } : {},
                    { deleted_at: null }
                ]
            },
            orderBy: { nome_artigo: 'asc' }
        });

        const serialized = JSON.parse(JSON.stringify(stock, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json({ data: serialized, success: true });
    } catch (error) {
        console.error('[API_STOCK_GET]', error);
        return NextResponse.json({ success: false, error: 'Erro ao buscar stock' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            nome_artigo,
            codigo_artigo,
            categoria,
            quantidade_stock,
            unidade_medida,
            preco_venda,
            registado_por
        } = body;

        const novoItem = await prisma.artigos_stock.create({
            data: {
                nome_artigo,
                codigo_artigo,
                categoria,
                quantidade_stock: Number(quantidade_stock),
                unidade_medida,
                preco_venda: Number(preco_venda),
                registado_por: BigInt(registado_por || 1),
                localizacao_stock: 'Farmacia_Central' // Default
            }
        });

        const serialized = JSON.parse(JSON.stringify(novoItem, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        return NextResponse.json({ data: serialized, success: true }, { status: 201 });
    } catch (error) {
        console.error('[API_STOCK_POST]', error);
        return NextResponse.json({ success: false, error: 'Erro ao criar item de stock' }, { status: 500 });
    }
}
