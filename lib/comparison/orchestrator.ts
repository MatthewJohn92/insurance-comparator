// lib/comparison/orchestrator.ts

import type { InsuranceData, Filters, RankedOffer } from '@/types/insurance';
import { addInitialScores, addFinalScores } from './scores';
import { applyFilters } from './filters';
import { sortAndRankOffers } from './ranking';

/**
 * Esegue l'intero pipeline di comparazione: calcolo punteggi, filtri e ordinamento.
 */
export function processInsuranceComparison(data: InsuranceData, filters: Filters): RankedOffer[] {
    const { offerte, categorieCoperture } = data;

    const offersWithInitialScores = addInitialScores(offerte, categorieCoperture);
    const filteredOffers = applyFilters(offersWithInitialScores, filters);
    const offersWithFinalScores = addFinalScores(filteredOffers);
    const sortedAndRankedOffers = sortAndRankOffers(offersWithFinalScores);

    return sortedAndRankedOffers;
}