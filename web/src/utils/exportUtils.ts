import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function to format currency
const formatCurrency = (value: any): string => {
  if (value === null || value === undefined) return 'R$ 0,00';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to safely get string value
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

// Helper function to safely get number value
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : Number(value);
  return isNaN(num) ? 0 : num;
};

// Export fornecedores to Excel
export const exportFornecedoresToExcel = (fornecedores: any[]): void => {
  try {
    if (!fornecedores || fornecedores.length === 0) {
      throw new Error('Nenhum fornecedor para exportar');
    }

    const ws = XLSX.utils.json_to_sheet(fornecedores.map(f => ({
      'Nome': safeString(f.nome),
      'Categoria': safeString(f.categoria),
      'CNPJ': safeString(f.cnpj),
      'Email': safeString(f.email),
      'Telefone': safeString(f.telefone),
      'Endereço': safeString(f.endereco),
      'Avaliação': safeNumber(f.avaliacao),
      'Status': safeString(f.status),
      'Total Pedidos': safeNumber(f.totalPedidos),
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fornecedores');
    XLSX.writeFile(wb, `fornecedores_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar fornecedores para Excel:', error);
    throw error;
  }
};

// Export fornecedores to PDF
export const exportFornecedoresToPDF = (fornecedores: any[]): void => {
  try {
    if (!fornecedores || fornecedores.length === 0) {
      throw new Error('Nenhum fornecedor para exportar');
    }

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Lista de Fornecedores', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [['Nome', 'Categoria', 'Email', 'Telefone', 'Avaliação', 'Status']],
      body: fornecedores.map(f => [
        safeString(f.nome),
        safeString(f.categoria),
        safeString(f.email),
        safeString(f.telefone),
        safeNumber(f.avaliacao).toString(),
        safeString(f.status),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [139, 92, 246] },
    });
    
    doc.save(`fornecedores_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar fornecedores para PDF:', error);
    throw error;
  }
};

// Export requisições to Excel
export const exportRequisicoesToExcel = (requisicoes: any[]): void => {
  try {
    if (!requisicoes || requisicoes.length === 0) {
      throw new Error('Nenhuma requisição para exportar');
    }

    const ws = XLSX.utils.json_to_sheet(requisicoes.map(r => ({
      'Código': safeString(r.codigo),
      'Título': safeString(r.titulo),
      'Solicitante': safeString(r.solicitante),
      'Departamento': safeString(r.departamento),
      'Categoria': safeString(r.categoria),
      'Valor': safeNumber(r.valor),
      'Data': safeString(r.data),
      'Status': safeString(r.status),
      'Prioridade': safeString(r.prioridade),
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requisições');
    XLSX.writeFile(wb, `requisicoes_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar requisições para Excel:', error);
    throw error;
  }
};

// Export requisições to PDF
export const exportRequisicoesToPDF = (requisicoes: any[]): void => {
  try {
    if (!requisicoes || requisicoes.length === 0) {
      throw new Error('Nenhuma requisição para exportar');
    }

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Lista de Requisições', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [['Código', 'Título', 'Solicitante', 'Valor', 'Status']],
      body: requisicoes.map(r => [
        safeString(r.codigo),
        safeString(r.titulo),
        safeString(r.solicitante),
        formatCurrency(r.valor),
        safeString(r.status),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [139, 92, 246] },
    });
    
    doc.save(`requisicoes_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar requisições para PDF:', error);
    throw error;
  }
};

// Export negociações to Excel
export const exportNegociacoesToExcel = (negociacoes: any[]): void => {
  try {
    if (!negociacoes || negociacoes.length === 0) {
      throw new Error('Nenhuma negociação para exportar');
    }

    const ws = XLSX.utils.json_to_sheet(negociacoes.map(n => ({
      'Código': safeString(n.codigo),
      'Item': safeString(n.item),
      'Fornecedor': safeString(n.fornecedor),
      'Valor Inicial': safeNumber(n.valorInicial),
      'Valor Negociado': safeNumber(n.valorNegociado),
      'Desconto': safeString(n.desconto || n.economia),
      'Status': safeString(n.status),
      'Responsável': safeString(n.responsavel),
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Negociações');
    XLSX.writeFile(wb, `negociacoes_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar negociações para Excel:', error);
    throw error;
  }
};

// Export negociações to PDF
export const exportNegociacoesToPDF = (negociacoes: any[]): void => {
  try {
    if (!negociacoes || negociacoes.length === 0) {
      throw new Error('Nenhuma negociação para exportar');
    }

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Lista de Negociações', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [['Código', 'Item', 'Fornecedor', 'Valor Inicial', 'Valor Negociado', 'Economia']],
      body: negociacoes.map(n => [
        safeString(n.codigo),
        safeString(n.item),
        safeString(n.fornecedor),
        formatCurrency(n.valorInicial),
        formatCurrency(n.valorNegociado),
        safeString(n.desconto || n.economia),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [139, 92, 246] },
    });
    
    doc.save(`negociacoes_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar negociações para PDF:', error);
    throw error;
  }
};

// Export pedidos to Excel
export const exportPedidosToExcel = (pedidos: any[]): void => {
  try {
    if (!pedidos || pedidos.length === 0) {
      throw new Error('Nenhum pedido para exportar');
    }

    const ws = XLSX.utils.json_to_sheet(pedidos.map(p => ({
      'Código': safeString(p.codigo),
      'Item': safeString(p.item),
      'Fornecedor': safeString(p.fornecedor?.nome || p.fornecedor || 'N/A'),
      'Valor': safeNumber(p.valor),
      'Data Pedido': safeString(p.dataPedido),
      'Data Entrega': safeString(p.dataEntrega),
      'Status': safeString(p.status),
      'Endereço': safeString(p.endereco),
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar pedidos para Excel:', error);
    throw error;
  }
};

// Export pedidos to PDF
export const exportPedidosToPDF = (pedidos: any[]): void => {
  try {
    if (!pedidos || pedidos.length === 0) {
      throw new Error('Nenhum pedido para exportar');
    }

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Lista de Pedidos', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [['Código', 'Item', 'Fornecedor', 'Valor', 'Status']],
      body: pedidos.map(p => [
        safeString(p.codigo),
        safeString(p.item),
        safeString(p.fornecedor?.nome || p.fornecedor || 'N/A'),
        formatCurrency(p.valor),
        safeString(p.status),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [139, 92, 246] },
    });
    
    doc.save(`pedidos_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar pedidos para PDF:', error);
    throw error;
  }
};

// Export relatórios to Excel
export const exportRelatoriosToExcel = (relatoriosData: {
  gastosMensais?: any[];
  gastosPorCategoria?: any[];
  indicadores?: any;
  topFornecedores?: any[];
}): void => {
  try {
    const wb = XLSX.utils.book_new();
    const dateStr = new Date().toISOString().split('T')[0];

    // Gastos Mensais
    if (relatoriosData.gastosMensais && relatoriosData.gastosMensais.length > 0) {
      const wsMensais = XLSX.utils.json_to_sheet(relatoriosData.gastosMensais.map(g => ({
        'Mês': safeString(g.mes || g.name),
        'Valor': safeNumber(g.valor),
        'Meta': g.meta ? safeNumber(g.meta) : null,
      })));
      XLSX.utils.book_append_sheet(wb, wsMensais, 'Gastos Mensais');
    }

    // Gastos por Categoria
    if (relatoriosData.gastosPorCategoria && relatoriosData.gastosPorCategoria.length > 0) {
      const wsCategoria = XLSX.utils.json_to_sheet(relatoriosData.gastosPorCategoria.map(g => ({
        'Categoria': safeString(g.categoria || g.name),
        'Valor': safeNumber(g.valor),
      })));
      XLSX.utils.book_append_sheet(wb, wsCategoria, 'Gastos por Categoria');
    }

    // Indicadores
    if (relatoriosData.indicadores) {
      const indicadores = relatoriosData.indicadores;
      const wsIndicadores = XLSX.utils.json_to_sheet([
        { 'Indicador': 'Economia Total', 'Valor': safeString(indicadores.economiaTotalValor || 'R$ 0') },
        { 'Indicador': 'Gastos do Mês', 'Valor': safeString(indicadores.gastosDoMesValor || 'R$ 0') },
        { 'Indicador': 'Total de Pedidos', 'Valor': safeNumber(indicadores.totalPedidos || 0) },
        { 'Indicador': 'Fornecedores Ativos', 'Valor': safeNumber(indicadores.fornecedoresAtivos || 0) },
      ]);
      XLSX.utils.book_append_sheet(wb, wsIndicadores, 'Indicadores');
    }

    // Top Fornecedores
    if (relatoriosData.topFornecedores && relatoriosData.topFornecedores.length > 0) {
      const wsFornecedores = XLSX.utils.json_to_sheet(relatoriosData.topFornecedores.map((f: any) => ({
        'Nome': safeString(f.nome),
        'Pedidos': safeNumber(f.pedidos),
        'Total': safeString(f.total),
        'Economia': safeString(f.economia),
      })));
      XLSX.utils.book_append_sheet(wb, wsFornecedores, 'Top Fornecedores');
    }

    if (wb.SheetNames.length === 0) {
      throw new Error('Nenhum dado de relatório para exportar');
    }

    XLSX.writeFile(wb, `relatorios_${dateStr}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar relatórios para Excel:', error);
    throw error;
  }
};

// Export relatórios to PDF
export const exportRelatoriosToPDF = (relatoriosData: {
  gastosMensais?: any[];
  gastosPorCategoria?: any[];
  indicadores?: any;
  topFornecedores?: any[];
}): void => {
  try {
    const doc = new jsPDF();
    const dateStr = new Date().toISOString().split('T')[0];
    let startY = 20;

    doc.setFontSize(18);
    doc.text('Relatórios & Indicadores', 14, startY);
    startY += 10;
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, startY);
    startY += 15;

    // Gastos Mensais
    if (relatoriosData.gastosMensais && relatoriosData.gastosMensais.length > 0) {
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }
      doc.setFontSize(14);
      doc.text('Gastos Mensais', 14, startY);
      startY += 8;
      
      autoTable(doc, {
        startY: startY,
        head: [['Mês', 'Valor', 'Meta']],
        body: relatoriosData.gastosMensais.map(g => [
          safeString(g.mes || g.name),
          formatCurrency(g.valor),
          g.meta ? formatCurrency(g.meta) : '-',
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] },
      });
      startY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Gastos por Categoria
    if (relatoriosData.gastosPorCategoria && relatoriosData.gastosPorCategoria.length > 0) {
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }
      doc.setFontSize(14);
      doc.text('Gastos por Categoria', 14, startY);
      startY += 8;
      
      autoTable(doc, {
        startY: startY,
        head: [['Categoria', 'Valor']],
        body: relatoriosData.gastosPorCategoria.map(g => [
          safeString(g.categoria || g.name),
          formatCurrency(g.valor),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] },
      });
      startY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Indicadores
    if (relatoriosData.indicadores) {
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }
      doc.setFontSize(14);
      doc.text('Indicadores', 14, startY);
      startY += 8;
      
      const indicadores = relatoriosData.indicadores;
      autoTable(doc, {
        startY: startY,
        head: [['Indicador', 'Valor']],
        body: [
          ['Economia Total', safeString(indicadores.economiaTotalValor || 'R$ 0')],
          ['Gastos do Mês', safeString(indicadores.gastosDoMesValor || 'R$ 0')],
          ['Total de Pedidos', safeNumber(indicadores.totalPedidos || 0).toString()],
          ['Fornecedores Ativos', safeNumber(indicadores.fornecedoresAtivos || 0).toString()],
        ],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] },
      });
      startY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Top Fornecedores
    if (relatoriosData.topFornecedores && relatoriosData.topFornecedores.length > 0) {
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }
      doc.setFontSize(14);
      doc.text('Top Fornecedores', 14, startY);
      startY += 8;
      
      autoTable(doc, {
        startY: startY,
        head: [['Nome', 'Pedidos', 'Total', 'Economia']],
        body: relatoriosData.topFornecedores.map((f: any) => [
          safeString(f.nome),
          safeNumber(f.pedidos).toString(),
          safeString(f.total),
          safeString(f.economia),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] },
      });
    }

    doc.save(`relatorios_${dateStr}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar relatórios para PDF:', error);
    throw error;
  }
};
