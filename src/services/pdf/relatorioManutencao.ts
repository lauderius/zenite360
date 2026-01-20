import PDFDocument from 'pdfkit';
import { OrdemManutencaoPatrimonio } from '@/types/administrativo';

export async function gerarRelatorioManutencaoPDF(ordem: any): Promise<Buffer> {
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
      doc.fontSize(18).font('Helvetica-Bold').text('RELATÓRIO DE MANUTENÇÃO', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Ordem de Serviço: ${ordem.codigo}`, { align: 'center' });
      doc.moveDown(1.5);

      // Linha divisória
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      // Informações do Equipamento
      doc.fontSize(14).font('Helvetica-Bold').text('DADOS DO EQUIPAMENTO');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      
      const equipInfo = [
        ['Código:', ordem.ativo?.codigo || '-'],
        ['Nome:', ordem.ativo?.nome || '-'],
        ['Localização:', ordem.ativo?.localizacao || '-'],
        ['Departamento:', ordem.ativo?.departamento?.nome || '-'],
      ];

      equipInfo.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').text(label, { continued: true });
        doc.font('Helvetica').text(` ${value}`);
      });
      doc.moveDown(1);

      // Informações da Manutenção
      doc.fontSize(14).font('Helvetica-Bold').text('DADOS DA MANUTENÇÃO');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      const manutInfo = [
        ['Tipo:', ordem.tipo],
        ['Prioridade:', ordem.prioridade],
        ['Data Abertura:', ordem.dataAbertura?.toLocaleDateString('pt-AO') || '-'],
        ['Data Conclusão:', ordem.dataConclusao?.toLocaleDateString('pt-AO') || '-'],
        ['Técnico:', ordem.tecnico?.nomeCompleto || '-'],
        ['Tempo de Parada:', `${ordem.tempoParadaHoras || 0} horas`],
      ];

      manutInfo.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').text(label, { continued: true });
        doc.font('Helvetica').text(` ${value}`);
      });
      doc.moveDown(1);

      // Descrição do Problema
      doc.fontSize(14).font('Helvetica-Bold').text('DESCRIÇÃO DO PROBLEMA');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(ordem.descricaoProblema || 'Não informado');
      doc.moveDown(1);

      // Diagnóstico
      doc.fontSize(14).font('Helvetica-Bold').text('DIAGNÓSTICO');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(ordem.diagnostico || 'Não informado');
      doc.moveDown(1);

      // Solução Aplicada
      doc.fontSize(14).font('Helvetica-Bold').text('SOLUÇÃO APLICADA');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(ordem.solucaoAplicada || 'Não informado');
      doc.moveDown(1);

      // Custos
      doc.fontSize(14).font('Helvetica-Bold').text('CUSTOS');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-AO', { style: 'decimal' }).format(value / 100) + ' Kz';
      };

      doc.text(`Mão de Obra: ${formatCurrency(ordem.custoMaoObra || 0)}`);
      doc.text(`Peças: ${formatCurrency(ordem.custoPecas || 0)}`);
      doc.font('Helvetica-Bold').text(`Total: ${formatCurrency(ordem.custoTotal || 0)}`);
      doc.moveDown(2);

      // Assinaturas
      doc.moveTo(50, doc.y).lineTo(250, doc.y).stroke();
      doc.moveTo(295, doc.y - 0.5).lineTo(545, doc.y - 0.5).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text('Técnico Responsável', 50, doc.y, { width: 200, align: 'center' });
      doc.text('Responsável pelo Setor', 295, doc.y - 12, { width: 250, align: 'center' });

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