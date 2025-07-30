// __tests__/comparison/filters.test.ts

import { applyFilters } from '../../lib/comparison/filters';
import { addInitialScores } from '../../lib/comparison/scores';
import { mockInsuranceData } from '../mocks/mockInsuranceData';
import type { Filters } from '../../types/insurance';

const { offerte, categorieCoperture } = mockInsuranceData;
const offersWithScores = addInitialScores(offerte, categorieCoperture);

describe('Filtering Logic: filters.ts', () => {
  
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
      priceRange: [0, 2000], scoreRange: [0, 100],
      selectedCompanies: ['Allianz'],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, filters);
    expect(result.length).toBe(1);
    expect(result[0].company).toBe('Allianz');
  });

  it('should filter by required coverage and exclude offers without it', () => {
    // Dai mock data, solo Helvetia (ID 3) e Baloise (ID 5) hanno 'pg_assistenza_litigi'
    const filters: Filters = {
      priceRange: [0, 2000], scoreRange: [0, 100],
      selectedCompanies: [],
      selectedCoverages: ['pg_assistenza_litigi'],
    };
    const result = applyFilters(offersWithScores, filters);
    
    // CORREZIONE: Ci aspettiamo 2 risultati
    expect(result.length).toBe(2);
    
    const companyNames = result.map(o => o.company);
    expect(companyNames).toContain('Helvetia');
    expect(companyNames).toContain('Baloise');
  });

  it('should return an empty array if no offer matches all criteria', () => {
    const filters: Filters = {
      priceRange: [0, 800], // Nessuna offerta
      scoreRange: [0, 100],
      selectedCompanies: [],
      selectedCoverages: [],
    };
    const result = applyFilters(offersWithScores, filters);
    expect(result.length).toBe(0);
  });
});