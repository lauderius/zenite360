import PDFDocument from 'pdfkit';

export async function gerarGuiaSaidaCorpoPDF(guia: any): Promise<Buffer> {
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

      const registro = guia.registroObito;

      // Cabeçalho
      doc.fontSize(18).font('Helvetica-Bold').text('GUIA DE LIBERAÇÃO DE CORPO', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text('CASA MORTUÁRIA', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica-Bold').text(`Nº ${guia.numero}`, { align: 'center' });
      doc.moveDown(1);

      // Linha
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      // Dados do Falecido
      doc.fontSize(12).font('Helvetica-Bold').text('DADOS DO FALECIDO');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      const dadosFalecido = [
        ['Nome Completo:', registro.nomeCompleto],
        ['Documento:', `${registro.tipoDocumento}: ${registro.numeroDocumento}`],
        ['Data de Nascimento:', registro.dataNascimento?.toLocaleDateString('pt-AO') || '-'],
        ['Idade:', `${registro.idade} anos`],
        ['Género:', registro.genero === 'MASCULINO' ? 'Masculino' : 'Feminino'],
        ['Nacionalidade:', registro.nacionalidade || '-'],
      ];

      dadosFalecido.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').text(label, { continued: true });
        doc.font('Helvetica').text(` ${value}`);
      });
      doc.moveDown(1);

      // Dados do Óbito
      doc.fontSize(12).font('Helvetica-Bold').text('DADOS DO ÓBITO');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      const dadosObito = [
        ['Data/Hora do Óbito:', registro.dataHoraObito?.toLocaleString('pt-AO') || '-'],
        ['Local do Óbito:', registro.localObito],
        ['Declaração de Óbito:', registro.declaracaoObitoNumero],
        ['Câmara Fria:', `${registro.camaraFria} - Posição ${registro.posicao}`],
        ['Data de Admissão:', registro.dataAdmissao?.toLocaleString('pt-AO') || '-'],
      ];

      dadosObito.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').text(label, { continued: true });
        doc.font('Helvetica').text(` ${value}`);
      });
      doc.moveDown(1);

      // Dados da Liberação
      doc.fontSize(12).font('Helvetica-Bold').text('DADOS DA LIBERAÇÃO');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      const dadosLiberacao = [
        ['Data/Hora da Liberação:', `${guia.dataEmissao?.toLocaleDateString('pt-AO')} às ${guia.horaEmissao}`],
        ['Responsável pela Retirada:', guia.responsavelRetirada],
        ['Documento:', guia.documentoResponsavel],
        ['Parentesco:', guia.parentesco || '-'],
        ['Funerária:', guia.funeraria || '-'],
        ['Destino:', guia.destino],
      ];

      dadosLiberacao.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').text(label, { continued: true });
        doc.font('Helvetica').text(` ${value}`);
      });
      doc.moveDown(1);

      if (guia.observacoes) {
        doc.fontSize(12).font('Helvetica-Bold').text('OBSERVAÇÕES');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(guia.observacoes);
        doc.moveDown(1);
      }

      // Declaração
      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica').text(
        'Declaro que recebi o corpo acima identificado, responsabilizando-me pelo seu destino final conforme indicado.',
        { align: 'justify' }
      );
      doc.moveDown(2);

      // Assinaturas
      const yPos = doc.y;
      doc.moveTo(50, yPos + 40).lineTo(250, yPos + 40).stroke();
      doc.moveTo(295, yPos + 40).lineTo(545, yPos + 40).stroke();
      
      doc.text('Responsável pela Retirada', 50, yPos + 45, { width: 200, align: 'center' });
      doc.text('Funcionário da Casa Mortuária', 295, yPos + 45, { width: 250, align: 'center' });
      
      doc.text(guia.responsavelRetirada, 50, yPos + 60, { width: 200, align: 'center' });
      doc.text(guia.emitidoPor?.nomeCompleto || '', 295, yPos + 60, { width: 250, align: 'center' });

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