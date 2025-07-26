import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export type PrintMode = 'top3' | 'summary' | 'detailed';

export interface OfferForPrint {
  id: number;
  company: string;
  premium_annuale: number;
  finalScore: number;
  coverages: Record<string, { covered: boolean; score: number }>;
}

export function generatePdf(mode: PrintMode, offers: OfferForPrint[]) {
  const orientation = mode === 'top3' ? 'p' : 'landscape';
  const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });

  const titleMap: Record<PrintMode, string> = {
    top3: 'Top 3 Dettagli',
    summary: 'Tutte Sintetiche',
    detailed: 'Tutto Dettagli',
  };

  doc.setFontSize(16);
  doc.text(`Report offerte – ${titleMap[mode]}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  const date = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFontSize(10);
  doc.text(date, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

  let rows: (string | number)[][] = [];

  if (mode === 'top3') {
    rows = offers.slice(0, 3).map((o, idx) => [idx + 1, o.company, o.premium_annuale.toFixed(2), o.finalScore.toFixed(1)]);
    autoTable(doc, {
      head: [['#', 'Compagnia', 'Premio (CHF)', 'Punteggio']],
      body: rows,
      startY: 80,
    });
  } else if (mode === 'summary') {
    rows = offers.map((o, idx) => [idx + 1, o.company, o.premium_annuale.toFixed(2)]);
    autoTable(doc, {
      head: [['#', 'Compagnia', 'Premio (CHF)']],
      body: rows,
      startY: 80,
    });
  } else {
    rows = offers.map((o, idx) => [idx + 1, o.company, o.premium_annuale.toFixed(2), Object.keys(o.coverages).join(', ')]);
    autoTable(doc, {
      head: [['#', 'Compagnia', 'Premio (CHF)', 'Coperture']],
      body: rows,
      startY: 80,
    });
  }

  doc.save('report.pdf');
}
