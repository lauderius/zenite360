import PDFDocument from 'pdfkit';

export async function gerarManifestoResiduosPDF(coleta: any, manifestoNumero: string): Promise<Buffer> {
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

      // Cabeçalho
      doc.fontSize(16).font('Helvetica-Bold').text('MANIFESTO DE TRANSPORTE DE', { align: 'center' });
      doc.fontSize(16).text('RESÍDUOS DE SERVIÇOS DE SAÚDE', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Nº ${manifestoNumero}`, { align: 'center' });
      doc.moveDown(1);

      // Linha
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      // Gerador (Hospital)
      doc.fontSize(12).font('Helvetica-Bold').text('1. IDENTIFICAÇÃO DO GERADOR');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text('Razão Social: Hospital Central - Sistema Zênite360');
      doc.text('NIF: 5000000001');
      doc.text('Endereço: Luanda, Angola');
      doc.text('Responsável Técnico: Coordenador de Serviços Gerais');
      doc.moveDown(1);

      // Transportador
      doc.fontSize(12).font('Helvetica-Bold').text('2. IDENTIFICAÇÃO DO TRANSPORTADOR');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Empresa: ${coleta.empresaColetaExterna || 'Equipe Interna'}`);
      doc.text(`Responsável: ${coleta.responsavelExterno || coleta.coletor?.nomeCompleto || '-'}`);
      doc.text(`Veículo: ${coleta.veiculoPlaca || 'N/A'}`);
      doc.moveDown(1);

      // Dados da Coleta
      doc.fontSize(12).font('Helvetica-Bold').text('3. DADOS DA COLETA');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Data: ${coleta.data?.toLocaleDateString('pt-AO')}`);
      doc.text(`Turno: ${coleta.turno}`);
      doc.text(`Código: ${coleta.codigo}`);
      doc.moveDown(1);

      // Resíduos
      doc.fontSize(12).font('Helvetica-Bold').text('4. ESPECIFICAÇÃO DOS RESÍDUOS');
      doc.moveDown(0.5);

      // Tabela de resíduos
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 100;
      const col3 = 250;
      const col4 = 350;
      const col5 = 420;
      const col6 = 490;

      // Cabeçalho da tabela
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Classe', col1, tableTop);
      doc.text('Setor', col2, tableTop);
      doc.text('Descrição', col3, tableTop);
      doc.text('Qtd', col4, tableTop);
      doc.text('Peso (kg)', col5, tableTop);
      doc.text('Vol (L)', col6, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

      // Linhas da tabela
      let yPos = tableTop + 20;
      doc.font('Helvetica').fontSize(8);

      coleta.itens?.forEach((item: any) => {
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }
        doc.text(item.residuo?.classe || '-', col1, yPos);
        doc.text(item.setorOrigem?.substring(0, 15) || '-', col2, yPos);
        doc.text(item.residuo?.descricao?.substring(0, 20) || '-', col3, yPos);
        doc.text(String(item.quantidade), col4, yPos);
        doc.text(item.pesoKg?.toFixed(2) || '0', col5, yPos);
        doc.text(item.volumeLitros?.toFixed(0) || '0', col6, yPos);
        yPos += 15;
      });

      doc.moveTo(50, yPos).lineTo(545, yPos).stroke();

      // Totais
      yPos += 5;
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text(`PESO TOTAL: ${coleta.pesoTotalKg?.toFixed(2) || 0} kg`, col4, yPos);
      doc.text(`VOLUME: ${coleta.volumeTotalLitros?.toFixed(0) || 0} L`, col5 + 30, yPos);
      doc.moveDown(2);

      // Destino Final
      doc.y = yPos + 30;
      doc.fontSize(12).font('Helvetica-Bold').text('5. DESTINO FINAL');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Destino: ${coleta.destinoFinal || 'A definir'}`);
      doc.text(`Tratamento: Conforme classificação dos resíduos`);
      doc.moveDown(1);

      // Declaração
      doc.fontSize(9).font('Helvetica').text(
        'Declaro que as informações constantes neste manifesto são verdadeiras e que os resíduos foram acondicionados, coletados e transportados de acordo com as normas vigentes.',
        { align: 'justify' }
      );
      doc.moveDown(2);

      // Assinaturas
      const sigY = doc.y;
      doc.moveTo(50, sigY + 40).lineTo(180, sigY + 40).stroke();
      doc.moveTo(205, sigY + 40).lineTo(380, sigY + 40).stroke();
      doc.moveTo(405, sigY + 40).lineTo(545, sigY + 40).stroke();

      doc.fontSize(8);
      doc.text('Gerador', 50, sigY + 45, { width: 130, align: 'center' });
      doc.text('Transportador', 205, sigY + 45, { width: 175, align: 'center' });
      doc.text('Receptor', 405, sigY + 45, { width: 140, align: 'center' });

      // Rodapé
      doc.fontSize(7).text(
        `Documento gerado em ${new Date().toLocaleString('pt-AO')} - Sistema Zênite360 - Via: Gerador`,
        50,
        doc.page.height - 40,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}