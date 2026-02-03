import PDFDocument from 'pdfkit';

export async function gerarRelatorioConsultasPDF(consultas: any[]): Promise<Buffer> {
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
            doc.fontSize(14).font('Helvetica-Bold').text('RELATÓRIO SEMANAL DE CONSULTAS', { align: 'center' });
            doc.moveDown(1.5);

            // Tabela
            const tableTop = 150;
            const dateX = 50;
            const patientX = 150;
            const doctorX = 350;
            const specX = 500;
            const statusX = 650;

            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Data/Hora', dateX, tableTop);
            doc.text('Paciente', patientX, tableTop);
            doc.text('Médico', doctorX, tableTop);
            doc.text('Especialidade', specX, tableTop);
            doc.text('Status', statusX, tableTop);

            doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

            let y = tableTop + 25;
            doc.font('Helvetica').fontSize(9);

            consultas.forEach((c) => {
                if (y > 500) {
                    doc.addPage();
                    y = 50;
                }

                doc.text(new Date(c.data_hora_inicio).toLocaleString('pt-AO').substring(0, 16), dateX, y);
                doc.text(c.pacientes?.nome_completo || 'N/A', patientX, y, { width: 190 });
                doc.text(`Dr(a). ${c.utilizadores_consultas_medico_idToutilizadores?.nome_completo || 'N/A'}`, doctorX, y, { width: 140 });
                doc.text(c.especialidade || 'Geral', specX, y);
                doc.text(c.status, statusX, y);

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
