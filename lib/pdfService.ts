// lib/pdfService.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { insuranceData } from '@/app/data/insuranceData';
import type { PrintMode, OfferForPrint, Category } from '@/types/insurance';

// Importiamo i moduli refattorizzati
import { headStyles } from './pdf/styles';
import { generateTableHeader } from './pdf/header';
import { generateTableBody } from './pdf/body';
import { addFooter } from './pdf/footer';

export async function generatePdf(
    mode: PrintMode,
    offers: OfferForPrint[],
    categoriesToPrint?: Category[]
) {
    const orientation = (mode === 'top3' || mode === 'filtered') ? 'portrait' : 'landscape';
    const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });

    const offersToPrint = mode === 'top3' ? offers.slice(0, 3) : offers;
    const categories = categoriesToPrint || insuranceData.categorieCoperture;

    // Utilizziamo le funzioni importate
    const head = generateTableHeader(offersToPrint);
    const body = generateTableBody(offersToPrint, categories, mode);
    
    autoTable(doc, {
        head,
        body,
        startY: 40,
        theme: 'grid',
        styles: { valign: 'middle', fontSize: 8, cellPadding: 4 },
        headStyles,
        columnStyles: {
            0: { cellWidth: 120, fontStyle: 'bold' }
        },
    });
    
    addFooter(doc);
    doc.save(`Report_Assicurazioni_${mode}_${new Date().toISOString().split('T')[0]}.pdf`);
}