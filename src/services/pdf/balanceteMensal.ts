import PDFDocument from 'pdfkit';

export async function gerarBalanceteMensalPDF(dados: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'portrait',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(20).font('Helvetica-Bold').text('ZÊNITE 360 - SISTEMA HOSPITALAR', { align: 'center' });
            doc.moveDown(0.2);
            doc.fontSize(14).font('Helvetica-Bold').text('BALANCETE FINANCEIRO MENSAL', { align: 'center' });
            doc.fontSize(10).font('Helvetica').text(`Período: 01/${new Date().getMonth() + 1}/${new Date().getFullYear()} - 30/${new Date().getMonth() + 1}/${new Date().getFullYear()}`, { align: 'center' });
            doc.moveDown(2);

            // Resumo de Receitas e Despesas
            doc.fontSize(12).font('Helvetica-Bold').text('RESUMO CONSOLIDADO');
            doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).stroke();
            doc.moveDown(1);

            doc.fontSize(10).font('Helvetica');
            doc.text('Total de Receitas (Faturação):', 50, doc.y);
            doc.font('Helvetica-Bold').text('45.280.000,00 AOA', 400, doc.y - 12);

            doc.moveDown(0.5);
            doc.font('Helvetica').text('Total de Despesas Operacionais:', 50, doc.y);
            doc.font('Helvetica-Bold').text('28.150.400,00 AOA', 400, doc.y - 12);

            doc.moveDown(1);
            doc.fontSize(12).font('Helvetica-Bold').text('SALDO LÍQUIDO:', 50, doc.y);
            doc.text('17.129.600,00 AOA', 400, doc.y - 14);
            doc.moveDown(2);

            // Detalhamento por Categoria (Mock)
            doc.fontSize(12).font('Helvetica-Bold').text('DETALHAMENTO POR CATEGORIA');
            doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).stroke();
            doc.moveDown(1);

            const categorias = [
                { cat: 'Consultas Médicas', val: '22.400.000,00' },
                { cat: 'Farmácia Central', val: '15.120.000,00' },
                { cat: 'Laboratório', val: '7.760.000,00' },
                { cat: 'Gastos com Pessoal', val: '-18.500.000,00' },
                { cat: 'Suprimentos e Manutenção', val: '-9.650.400,00' },
            ];

            doc.fontSize(10).font('Helvetica');
            categorias.forEach(item => {
                doc.text(item.cat, 50, doc.y);
                doc.text(item.val + ' AOA', 400, doc.y - 12);
                doc.moveDown(0.5);
            });

            // Rodapé
            doc.fontSize(8).text(
                `Documento gerado em ${new Date().toLocaleString('pt-AO')} - Departamento de Gestão Financeira`,
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
