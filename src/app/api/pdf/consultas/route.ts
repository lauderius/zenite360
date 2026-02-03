import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gerarRelatorioConsultasPDF } from '@/services/pdf/relatorioConsultas';

export async function GET() {
    try {
        const consultas = await prisma.consultas.findMany({
            include: {
                pacientes: true,
                utilizadores_consultas_medico_idToutilizadores: true,
            },
            orderBy: [
                { data_consulta: 'desc' },
                { hora_inicio: 'desc' }
            ],
            take: 50, // Limite para o relatório rápido
        });

        const pdfBuffer = await gerarRelatorioConsultasPDF(consultas);

        return new Response(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="relatorio_consultas.pdf"',
            },
        });
    } catch (error) {
        console.error('[API_PDF_CONSULTAS_GET]', error);
        return NextResponse.json({ message: 'Erro ao gerar PDF' }, { status: 500 });
    }
}
