import { NextResponse } from 'next/server';
import { gerarBalanceteMensalPDF } from '@/services/pdf/balanceteMensal';

export async function GET() {
    try {
        // Num cenário real, buscaríamos dados agregados do banco aqui
        const mockDados = {};

        const pdfBuffer = await gerarBalanceteMensalPDF(mockDados);

        return new Response(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="balancete_mensal.pdf"',
            },
        });
    } catch (error) {
        console.error('[API_PDF_FINANCEIRO_BALANCETE_GET]', error);
        return NextResponse.json({ message: 'Erro ao gerar Balancete PDF' }, { status: 500 });
    }
}
