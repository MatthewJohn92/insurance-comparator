// lib/pdf/header.ts

import type { UserOptions } from 'jspdf-autotable';
import type { OfferForPrint } from '@/types/insurance';

export function generateTableHeader(offersToPrint: OfferForPrint[]): UserOptions['head'] {
    const head: UserOptions['head'] = [[]];

    (head[0] as any[]).push({ 
        content: 'Coperture', 
        styles: { fontStyle: 'bold', halign: 'left' } 
    });
    
    offersToPrint.forEach(offer => {
        (head[0] as any[]).push({
            content: `${offer.company}\n CHF ${offer.premium_annuale.toFixed(2)}\n voto: ${offer.finalScore.toFixed(1)}`,
        });
    });

    return head;
}