// __tests__/pdfService.test.ts

import { generateTableHeader } from '../lib/pdf/header';
import { generateTableBody } from '../lib/pdf/body';
import { insuranceData } from '../app/data/insuranceData';
import type { OfferForPrint, Category } from '../types/insurance';

// Prendiamo un sottoinsieme dei dati per i nostri test
const testOffers: OfferForPrint[] = insuranceData.offerte.slice(0, 2).map(o => ({
  ...o,
  finalScore: 8.5, // Aggiungiamo dati fittizi richiesti dal tipo
  macroScores: {
    'Responsabilità civile (RC)': 4.0,
    'Casco parziale': 4.5,
  },
  rank: 0,
  isBestPrice: false,
  isBestScore: false,
  isBestValue: false,
  averageMicroScore: 4.2,
  bestValue: 0.01,
}));

const testCategories: Category[] = insuranceData.categorieCoperture.slice(0, 2);

describe('PDF Generation Logic', () => {

  describe('generateTableHeader', () => {
    it('should create a header row with "Coperture" and each offer', () => {
      const header = generateTableHeader(testOffers);
      
      expect(header).toHaveLength(1);
      
      const headerRow = header[0] as any[];
      expect(headerRow).toHaveLength(testOffers.length + 1);
      
      expect(headerRow[0].content).toBe('Coperture');
      
      expect(headerRow[1].content).toContain('Zurich');
      expect(headerRow[1].content).toContain('CHF 886.80');
    });
  });

  describe('generateTableBody', () => {
    it('should generate a detailed body for "top3" mode', () => {
      const body = generateTableBody(testOffers, testCategories, 'top3');
      
      // Calcolo corretto delle righe attese
      // 1 (Variante) + (N. Categorie * (1 riga per categoria + N. micro-coperture per categoria)) + 1 (Osservazione)
      const expectedRows = 1 + testCategories.reduce((acc, cat) => acc + 1 + cat.microCoperture.length, 0) + 1;
      expect(body.length).toBe(expectedRows);

      // Controlliamo che una cella di dettaglio contenga le informazioni corrette
      // La riga 2 è la prima micro-copertura della prima categoria
      const detailCell = body[2][1]; // Dettaglio per Zurich, prima micro-copertura
      expect(detailCell.content).toContain('Copertura fino a 100M CHF.');
      expect(detailCell.styles.textColor).toBe('#15803d'); // Colore verde per punteggio alto
    });

    it('should generate a summary body for "summary" mode', () => {
      const body = generateTableBody(testOffers, testCategories, 'summary');
      
      // Calcolo corretto delle righe attese
      // 1 (Variante) + N. Categorie + 1 (Osservazione)
      const expectedRows = 1 + testCategories.length + 1;
      expect(body.length).toBe(expectedRows);
    });

    it('should handle non-covered items correctly', () => {
       const offerWithoutVandalism = testOffers[0]; // Zurich non ha 'cp_vandalismo'
       const categoryWithVandalism = insuranceData.categorieCoperture.find(c => c.nome === 'Casco parziale');
       
       const body = generateTableBody([offerWithoutVandalism], [categoryWithVandalism!], 'detailed');

       const vandalismRow = body.find(row => (row[0] as any).content === 'Atti vandalici non dolosi');
       expect(vandalismRow).toBeDefined();

       const vandalismCell = vandalismRow![1] as any;
       expect(vandalismCell.content).toBe('Non inclusa');
       expect(vandalismCell.styles.textColor).toBe('#dc2626'); // Colore rosso
    });
  });
});