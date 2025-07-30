// lib/pdf/body.ts

import { macroCategoryStyles, getScoreColor } from './styles';
import type { OfferForPrint, Category, PrintMode } from '@/types/insurance';

export function generateTableBody(
    offersToPrint: OfferForPrint[],
    categories: Category[],
    mode: PrintMode
): any[][] {
    let body: any[][] = [];

    // Riga Variante
    body.push([
        { content: 'Variante', styles: macroCategoryStyles },
        ...offersToPrint.map(o => ({ content: o.variante, styles: { ...macroCategoryStyles, halign: 'center' }}))
    ]);

    // Righe Categorie e Micro-Coperture
    categories.forEach(category => {
        body.push([
            { content: category.nome, styles: macroCategoryStyles },
            ...offersToPrint.map(o => ({
                content: `Media: ${o.macroScores[category.nome].toFixed(1)}`,
                styles: { ...macroCategoryStyles, halign: 'center' }
            }))
        ]);

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
    
    // Riga Osservazione Finale
    body.push([
        { content: 'Osservazione Finale', styles: macroCategoryStyles },
        ...offersToPrint.map(o => ({
            content: o.osservazione || '-',
            styles: { ...macroCategoryStyles, fontStyle: 'italic', fontSize: 8 }
        }))
    ]);
    
    return body;
}