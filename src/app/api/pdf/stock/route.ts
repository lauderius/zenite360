import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gerarInventarioStockPDF } from '@/services/pdf/inventarioStock';

export async function GET() {
    try {
        const stockItems = await prisma.artigos_stock.findMany({
            where: { deleted_at: null },
        });

        const pdfBuffer = await gerarInventarioStockPDF(stockItems);

        return new Response(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="inventario_stock.pdf"',
            },
        });
    } catch (error) {
        console.error('[API_PDF_STOCK_GET]', error);
        return NextResponse.json({ message: 'Erro ao gerar PDF' }, { status: 500 });
    }
}
