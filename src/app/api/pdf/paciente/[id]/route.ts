import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gerarFichaPacientePDF } from '@/services/pdf/fichaPaciente';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const paciente = await prisma.pacientes.findUnique({
            where: { id: BigInt(id) },
        });

        if (!paciente) {
            return NextResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
        }

        const pdfBuffer = await gerarFichaPacientePDF(paciente);

        return new Response(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ficha_paciente_${id}.pdf"`,
            },
        });
    } catch (error) {
        console.error('[API_PDF_PACIENTE_GET]', error);
        return NextResponse.json({ message: 'Erro ao gerar PDF' }, { status: 500 });
    }
}
