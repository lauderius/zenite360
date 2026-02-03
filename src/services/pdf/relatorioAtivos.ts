import PDFDocument from 'pdfkit';

export async function gerarRelatorioAtivosPDF(ativos: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(20).font('Helvetica-Bold').text('ZÊNITE 360 - HOSPITAL MANAGEMENT', { align: 'center' });
            doc.moveDown(0.2);
            doc.fontSize(14).font('Helvetica-Bold').text('RELATÓRIO DE ATIVOS E PATRIMÓNIO', { align: 'center' });
            doc.moveDown(1.5);

            // Tabela
            const tableTop = 150;
            const codeX = 50;
            const nameX = 130;
            const categoryX = 350;
            const locationX = 500;
            const statusX = 650;

            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Código', codeX, tableTop);
            doc.text('Equipamento', nameX, tableTop);
            doc.text('Categoria', categoryX, tableTop);
            doc.text('Localização', locationX, tableTop);
            doc.text('Status', statusX, tableTop);

            doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

            let y = tableTop + 25;
            doc.font('Helvetica').fontSize(9);

            ativos.forEach((a) => {
                if (y > 500) {
                    doc.addPage();
                    y = 50;
                }

                doc.text(a.codigo, codeX, y);
                doc.text(a.nome, nameX, y, { width: 210 });
                doc.text(a.categoria, categoryX, y);
                doc.text(a.localizacao, locationX, y);
                doc.text(a.status, statusX, y);

                y += 20;
            });

            // Rodapé
            doc.fontSize(8).text(
                `Documento gerado em ${new Date().toLocaleString('pt-AO')} - Sistema Zênite360`,
                50,
                doc.page.height - 50,
                { align: 'center' }
            );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
