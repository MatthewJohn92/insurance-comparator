// __tests__/comparison/filters.test.ts

import { applyFilters } from '../../lib/comparison/filters';
import { addInitialScores } from '../../lib/comparison/scores';
import { insuranceData } from '../../app/data/insuranceData';
import type { Filters } from '../../types/insurance';

const { offerte, categorieCoperture } = insuranceData;
const offersWithScores = addInitialScores(offerte, categorieCoperture);

describe('PDF Generation Logic › filters.ts', () => {
  
  it('should not filter any offer with default filters', () => {
    const defaultFilters: Filters = {
      priceRange: [0, 2000],
      scoreRange: [0, 100],
      selectedCompanies: [],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, defaultFilters);
    expect(result.length).toBe(offerte.length);
  });

  it('should filter by a single company', () => {
    const filters: Filters = {
      priceRange: [0, 2000],
      scoreRange: [0, 100],
      selectedCompanies: ['Allianz'],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, filters);
    expect(result.length).toBe(1);
    expect(result[0].company).toBe('Allianz');
  });

  it('should filter by multiple companies', () => {
    const filters: Filters = {
      priceRange: [0, 2000],
      scoreRange: [0, 100],
      selectedCompanies: ['Allianz', 'Zurich'],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, filters);
    expect(result.length).toBe(2);
    expect(result.some(o => o.company === 'Allianz')).toBe(true);
    expect(result.some(o => o.company === 'Zurich')).toBe(true);
  });

  it('should filter by minimum score', () => {
    const filters: Filters = {
      priceRange: [0, 2000],
      scoreRange: [85, 100], // Solo AXA ha un averageMicroScore * 20 > 85
      selectedCompanies: [],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, filters);
    expect(result.length).toBe(1);
    expect(result[0].company).toBe('AXA');
  });

  it('should return an empty array if no offer matches', () => {
    const filters: Filters = {
      priceRange: [0, 800], // Nessuna offerta sotto 800
      scoreRange: [0, 100],
      selectedCompanies: [],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, filters);
    expect(result.length).toBe(0);
  });
});