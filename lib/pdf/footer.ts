// lib/pdf/footer.ts

import type jsPDF from 'jspdf';

export const addFooter = (doc: jsPDF) => {
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