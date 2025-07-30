// lib/pdfService.ts
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { insuranceData } from '@/app/data/insuranceData';
import type { Category } from '@/app/data/insuranceData';

// --- TIPI DI DATI ---
export type PrintMode = 'top3' | 'summary' | 'detailed' | 'filtered';

export interface OfferForPrint {
    id: number;
    company: string;
    premium_annuale: number;
    finalScore: number;
    macroScores: { [key: string]: number };
    coverages: Record<string, { covered: boolean; score: number; details?: string }>;
    variante: string;
    osservazione?: string;
}

// --- FUNZIONI HELPER (invariate) ---
const addFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Pagina ${i} di ${pageCount}`,
            doc.internal.pageSize.getWidth() - 40,
            doc.internal.pageSize.getHeight() - 20,
            { align: 'right' }
        );
        doc.text(
            `© L+G SA - ${new Date().toLocaleDateString('it-IT')}`,
            40,
            doc.internal.pageSize.getHeight() - 20
        );
    }
};

const getScoreColor = (score: number): string => {
    if (score >= 4) return '#15803d'; // Verde Intenso
    if (score >= 2.5) return '#ca8a04'; // Giallo Intenso
    return '#dc2626'; // Rosso
};

// --- FUNZIONE PRINCIPALE DI GENERAZIONE PDF ---

// MODIFICA #2: La funzione ora accetta un parametro opzionale `categoriesToPrint`
export async function generatePdf(
    mode: PrintMode,
    offers: OfferForPrint[],
    categoriesToPrint?: Category[]
) {
    const orientation = (mode === 'top3' || mode === 'filtered') ? 'portrait' : 'landscape';
    const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });

    const headStyles = { fillColor: '#155044', textColor: '#FFFFFF', fontStyle: 'bold', halign: 'center' as const };
    const macroCategoryStyles = { fontStyle: 'bold', fillColor: '#F3F4F6', textColor: '#000000' };

    const offersToPrint = mode === 'top3' ? offers.slice(0, 3) : offers;
    
    // Se le categorie filtrate sono fornite, usiamo quelle, altrimenti tutte.
    const categories = categoriesToPrint || insuranceData.categorieCoperture;

    const head: UserOptions['head'] = [[]];
    (head[0] as any[]).push({ content: 'Coperture', styles: { fontStyle: 'bold', halign: 'left' } });
    
    offersToPrint.forEach(offer => {
        (head[0] as any[]).push({
            content: `${offer.company}\n CHF ${offer.premium_annuale.toFixed(2)}\n voto: ${offer.finalScore.toFixed(1)}`,
        });
    });
    
    let body: any[][] = [];

    // Add new offer details to the PDF body

    body.push([
        { content: 'Variante', styles: macroCategoryStyles },
        ...offersToPrint.map(o => ({ content: o.variante, styles: { ...macroCategoryStyles, halign: 'center' }}))
    ]);

    categories.forEach(category => {
        body.push([
            { content: category.nome, styles: macroCategoryStyles },
            ...offersToPrint.map(o => ({
                content: `Media: ${o.macroScores[category.nome].toFixed(1)}`,
                styles: { ...macroCategoryStyles, halign: 'center' }
            }))
        ]);

        // MODIFICA #3: Aggiunta la modalità 'filtered' alla condizione
        if (mode === 'detailed' || mode === 'top3' || mode === 'filtered') {
            category.microCoperture.forEach(micro => {
                body.push([
                    { content: micro.nome, styles: { fontSize: 8, fontStyle: 'normal' } },
                    ...offersToPrint.map(o => {
                        const coverage = o.coverages[micro.id as keyof typeof o.coverages];
                        if (coverage?.covered) {
                            return {
                                content: `${Math.round(coverage.score)}\n${coverage.details || ''}`,
                                styles: { textColor: getScoreColor(coverage.score), fontSize: 7, halign: 'center' }
                            };
                        }
                        return { 
                            content: 'Non inclusa',
                            styles: { textColor: getScoreColor(0), fontSize: 7, halign: 'center' }
                        };
                    })
                ]);
            });
        }
    });
    
    body.push([
        { content: 'Osservazione Finale', styles: macroCategoryStyles },
        ...offersToPrint.map(o => ({
            content: o.osservazione || '-',
            styles: { ...macroCategoryStyles, fontStyle: 'italic', fontSize: 8 }
        }))
    ]);
    
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