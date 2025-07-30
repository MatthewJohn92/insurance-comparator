// __tests__/comparison/ranking.test.ts

import { sortAndRankOffers } from '../../lib/comparison/ranking';
import { addInitialScores, addFinalScores } from '../../lib/comparison/scores';
import { mockInsuranceData } from '../mocks/mockInsuranceData';

const { offerte, categorieCoperture } = mockInsuranceData;

describe('Ranking Logic: ranking.ts', () => {
  it('should correctly identify and assign best offer badges', () => {
    const offersWithInitialScores = addInitialScores(offerte, categorieCoperture);
    const offersWithFinalScores = addFinalScores(offersWithInitialScores);
    const result = sortAndRankOffers(offersWithFinalScores);

    const bestPriceOffer = result.find(o => o.isBestPrice);
    const bestScoreOffer = result.find(o => o.isBestScore);
    const bestValueOffer = result.find(o => o.isBestValue);

    expect(bestPriceOffer?.company).toBe('Helvetia');
    expect(bestScoreOffer?.company).toBe('Baloise');
    expect(bestValueOffer).toBeDefined();
    // Il calcolo preciso del best value è complesso, ma dai dati Baloise è un forte candidato
    expect(bestValueOffer?.company).toBe('Baloise');
  });

  it('should sort offers based on rank, then by finalScore', () => {
    const offersWithInitialScores = addInitialScores(offerte, categorieCoperture);
    const offersWithFinalScores = addFinalScores(offersWithInitialScores);
    const result = sortAndRankOffers(offersWithFinalScores);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].rank).toBeGreaterThanOrEqual(result[i + 1].rank);
    }
    
    const offersWithSameRank = result.filter(o => o.rank === result[1].rank);
    if (offersWithSameRank.length > 1) {
      expect(offersWithSameRank[0].finalScore).toBeGreaterThanOrEqual(offersWithSameRank[1].finalScore);
    }
  });

  it('should handle an empty array without crashing', () => {
    const result = sortAndRankOffers([]);
    expect(result).toEqual([]);
  });
});