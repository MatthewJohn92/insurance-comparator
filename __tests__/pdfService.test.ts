import { generatePdf } from '../lib/pdfService';
import { insuranceData } from '../app/data/insuranceData';

test('generatePdf top3 does not throw', () => {
  const offers = insuranceData.offerte.slice(0, 3).map(o => ({
    ...o,
    finalScore: 5,
  }));
  expect(() => generatePdf('top3', offers)).not.toThrow();
});
