import PDFDocument from 'pdfkit';

export async function gerarFaturaPDF(faturaData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Logo/Brand
            doc.fontSize(20).font('Helvetica-Bold').text('ZÊNITE 360', 50, 50);
            doc.fontSize(10).font('Helvetica').text('Gestão Hospitalar Avançada', 50, 75);
            doc.text('Luanda - Angola', 50, 90);
            doc.text('NIF: 5401234567', 50, 105);

            // Título Documento
            doc.fontSize(16).font('Helvetica-Bold').text('FATURA / RECIBO', 350, 50, { align: 'right' });
            doc.fontSize(10).font('Helvetica').text(`Número: ${faturaData.numero}`, 350, 70, { align: 'right' });
            doc.text(`Data: ${new Date().toLocaleDateString('pt-AO')}`, 350, 85, { align: 'right' });

            doc.moveDown(4);

            // Cliente / Paciente
            doc.fontSize(12).font('Helvetica-Bold').text('CLIENTE / PACIENTE', 50);
            doc.fontSize(10).font('Helvetica');
            doc.text(`Nome: ${faturaData.paciente_nome}`);
            doc.text(`NIF: ${faturaData.paciente_nif || 'Consumidor Final'}`);
            doc.moveDown(2);

            // Tabela de Itens
            const itemTop = doc.y;
            doc.font('Helvetica-Bold');
            doc.text('Descrição', 50, itemTop);
            doc.text('Qtd.', 300, itemTop);
            doc.text('P. Unitário', 350, itemTop, { width: 80, align: 'right' });
            doc.text('Total', 450, itemTop, { width: 95, align: 'right' });

            doc.moveTo(50, itemTop + 15).lineTo(545, itemTop + 15).stroke();

            let y = itemTop + 25;
            doc.font('Helvetica');

            const itens = faturaData.itens || [];
            itens.forEach((item: any) => {
                doc.text(item.descricao, 50, y);
                doc.text(item.qtd.toString(), 300, y);
                doc.text(Number(item.preco).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + ' Kz', 350, y, { width: 80, align: 'right' });
                doc.text((item.qtd * item.preco).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + ' Kz', 450, y, { width: 95, align: 'right' });
                y += 20;
            });

            doc.moveTo(50, y + 5).lineTo(545, y + 5).stroke();
            y += 15;

            // Totais
            doc.font('Helvetica-Bold');
            doc.text('SUBTOTAL:', 350, y, { width: 100, align: 'left' });
            doc.text(faturaData.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + ' Kz', 450, y, { width: 95, align: 'right' });

            y += 15;
            doc.text('IMPOSTO (14%):', 350, y, { width: 100, align: 'left' });
            doc.text(faturaData.imposto.toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + ' Kz', 450, y, { width: 95, align: 'right' });

            y += 20;
            doc.fontSize(14);
            doc.text('TOTAL:', 350, y, { width: 100, align: 'left' });
            doc.text(faturaData.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + ' Kz', 450, y, { width: 95, align: 'right' });

            // Rodapé legal
            doc.fontSize(8).font('Helvetica-Oblique').text('Os bens/serviços foram colocados à disposição do adquirente na data e local do documento.', 50, doc.page.height - 70, { align: 'center' });
            doc.text('Processado por computador - Zênite 360', 50, doc.page.height - 60, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
