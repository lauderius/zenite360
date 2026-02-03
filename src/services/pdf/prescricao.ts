import PDFDocument from 'pdfkit';

export async function gerarPrescricaoPDF(prescricao: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A5', // Prescrições costumam ser menores
                margins: { top: 40, bottom: 40, left: 40, right: 40 },
            });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(14).font('Helvetica-Bold').text('ZÊNITE 360 - HOSPITAL MANAGEMENT', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica-Bold').text('RECEITUÁRIO MÉDICO', { align: 'center' });
            doc.moveDown(1);

            // Linha divisória
            doc.moveTo(40, doc.y).lineTo(380, doc.y).stroke();
            doc.moveDown(1);

            // Dados do Paciente
            doc.fontSize(10).font('Helvetica-Bold').text('Paciente: ', { continued: true }).font('Helvetica').text(prescricao.paciente_nome);
            doc.font('Helvetica-Bold').text('Processo: ', { continued: true }).font('Helvetica').text(prescricao.paciente_processo);
            doc.moveDown(1);

            // Prescrição (Corpo)
            doc.fontSize(12).font('Helvetica-Bold').text('Rp.', { underline: true });
            doc.moveDown(0.5);

            const medicamentos = prescricao.itens || [];
            medicamentos.forEach((item: any, index: number) => {
                doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. ${item.medicamento}`);
                doc.fontSize(9).font('Helvetica').text(`   Posologia: ${item.posologia}`, { indent: 15 });
                doc.moveDown(0.5);
            });

            if (prescricao.observacoes) {
                doc.moveDown(0.5);
                doc.fontSize(9).font('Helvetica-Bold').text('Observações:');
                doc.fontSize(9).font('Helvetica').text(prescricao.observacoes);
            }

            // Rodapé / Assinatura
            doc.moveDown(3);
            const signatureY = doc.y;
            doc.moveTo(100, signatureY).lineTo(320, signatureY).stroke();
            doc.fontSize(9).text('Assinatura e Carimbo do Médico', 40, signatureY + 5, { align: 'center' });

            doc.fontSize(7).text(
                `Documento gerado em ${new Date().toLocaleString('pt-AO')} - Sistema Zênite360`,
                40,
                doc.page.height - 30,
                { align: 'center' }
            );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
