import PDFDocument from 'pdfkit';

export async function gerarFichaPacientePDF(paciente: any): Promise<Buffer> {
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

            // Logo e Cabeçalho
            doc.fontSize(20).font('Helvetica-Bold').text('ZÊNITE 360 - HOSPITAL MANAGEMENT', { align: 'center' });
            doc.moveDown(0.2);
            doc.fontSize(14).font('Helvetica-Bold').text('FICHA DO PACIENTE', { align: 'center' });
            doc.moveDown(1.5);

            // Linha divisória
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(1);

            // Informações Pessoais
            doc.fontSize(14).font('Helvetica-Bold').text('INFORMAÇÕES PESSOAIS');
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');

            const personalInfo = [
                ['Nome Completo:', paciente.nome_completo],
                ['B.I. Número:', paciente.bi_numero],
                ['Número de Processo:', paciente.numero_processo],
                ['Data de Nascimento:', new Date(paciente.data_nascimento).toLocaleDateString('pt-AO')],
                ['Gênero:', paciente.genero],
                ['Telefone:', paciente.telefone_principal || 'N/A'],
            ];

            personalInfo.forEach(([label, value]) => {
                doc.font('Helvetica-Bold').text(label, { continued: true });
                doc.font('Helvetica').text(` ${value}`);
            });
            doc.moveDown(1);

            // Endereço
            doc.fontSize(14).font('Helvetica-Bold').text('ENDEREÇO E LOCALIZAÇÃO');
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');

            const addressInfo = [
                ['Província:', paciente.provincia],
                ['Município:', paciente.municipio || 'N/A'],
            ];

            addressInfo.forEach(([label, value]) => {
                doc.font('Helvetica-Bold').text(label, { continued: true });
                doc.font('Helvetica').text(` ${value}`);
            });
            doc.moveDown(1);

            // Contacto de Emergência
            if (paciente.contacto_emergencia_nome) {
                doc.fontSize(14).font('Helvetica-Bold').text('CONTACTO DE EMERGÊNCIA');
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica');
                doc.font('Helvetica-Bold').text('Nome: ', { continued: true }).font('Helvetica').text(paciente.contacto_emergencia_nome);
                doc.font('Helvetica-Bold').text('Telefone: ', { continued: true }).font('Helvetica').text(paciente.contacto_emergencia_telefone);
                doc.moveDown(1);
            }

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
