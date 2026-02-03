import PDFDocument from 'pdfkit';

export async function gerarInventarioStockPDF(stockItems: any[]): Promise<Buffer> {
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
            doc.fontSize(14).font('Helvetica-Bold').text('INVENTÁRIO DE STOCK - FARMÁCIA', { align: 'center' });
            doc.moveDown(1.5);

            // Tabela de Stock
            const tableTop = 150;
            const itemX = 50;
            const codeX = 250;
            const categoryX = 350;
            const quantityX = 500;
            const unitX = 600;
            const statusX = 700;

            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Artigo', itemX, tableTop);
            doc.text('Código', codeX, tableTop);
            doc.text('Categoria', categoryX, tableTop);
            doc.text('Qtd.', quantityX, tableTop);
            doc.text('Unidade', unitX, tableTop);
            doc.text('Status', statusX, tableTop);

            doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

            let y = tableTop + 25;
            doc.font('Helvetica').fontSize(9);

            stockItems.forEach((item) => {
                if (y > 500) {
                    doc.addPage();
                    y = 50;
                }

                const isCritical = Number(item.quantidade_stock) <= Number(item.stock_minimo);
                const isWarning = Number(item.quantidade_stock) <= Number(item.stock_minimo) * 1.5;
                const status = isCritical ? 'CRÍTICO' : isWarning ? 'BAIXO' : 'NORMAL';

                doc.text(item.nome_artigo, itemX, y, { width: 190 });
                doc.text(item.codigo_artigo, codeX, y);
                doc.text(item.categoria, categoryX, y);
                doc.text(item.quantidade_stock.toString(), quantityX, y);
                doc.text(item.unidade_medida || 'UN', unitX, y);
                doc.text(status, statusX, y);

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
