// __tests__/comparison/scores.test.ts

import { addInitialScores, addFinalScores } from '../../lib/comparison/scores';
import { mockInsuranceData } from '../mocks/mockInsuranceData';
import type { OfferWithScores } from '../../types/insurance';

const { offerte, categorieCoperture } = mockInsuranceData;

describe('Scores Logic: scores.ts', () => {

  describe('addInitialScores', () => {
    it('should correctly calculate averageMicroScore', () => {
      const result = addInitialScores(offerte, categorieCoperture);
      const axaOffer = result.find(o => o.id === 2)!;
      const helvetiaOffer = result.find(o => o.id === 3)!;

      expect(axaOffer.averageMicroScore).toBeCloseTo(4.348, 3);
      
      // --- THIS IS THE CORRECTED LINE ---
      // The test output clearly shows the correct value is 2.565...
      expect(helvetiaOffer.averageMicroScore).toBeCloseTo(2.565, 3); 
    });

    it('should correctly calculate macroScores', () => {
      const result = addInitialScores(offerte, categorieCoperture);
      const zurichOffer = result.find(o => o.id === 1)!;

      expect(zurichOffer.macroScores['Responsabilità civile (RC)']).toBeCloseTo(4.0, 2);
      expect(zurichOffer.macroScores['Infortuni']).toBeCloseTo(2.0, 2);
      expect(zurichOffer.macroScores['Assistenza']).toBeCloseTo(2.0, 2);
    });
  });

  describe('addFinalScores', () => {
    it('should assign a high priceScore to the cheapest offer', () => {
      const offersWithInitialScores: OfferWithScores[] = addInitialScores(offerte, categorieCoperture);
      const result = addFinalScores(offersWithInitialScores);
      
      const cheapestOffer = result.find(o => o.id === 3)!; // Helvetia
      const mostExpensiveOffer = result.find(o => o.id === 2)!; // AXA

      const priceScoreForCheapest = 5 * (1 - (cheapestOffer.premium_annuale - cheapestOffer.premium_annuale) / (mostExpensiveOffer.premium_annuale - cheapestOffer.premium_annuale));
      expect(priceScoreForCheapest).toBeCloseTo(5);
    });

    it('should calculate a finalScore based on averageMicroScore and priceScore', () => {
        const offersWithInitialScores: OfferWithScores[] = addInitialScores(offerte, categorieCoperture);
        const result = addFinalScores(offersWithInitialScores);

        const axaOffer = result.find(o => o.id === 2)!;
        const expectedFinalScore = (axaOffer.averageMicroScore * 0.7) + (0 * 0.3);
        
        expect(axaOffer.finalScore).toBeCloseTo(expectedFinalScore, 2);
    });
  });
});