// lib/comparison/filters.ts

import type { OfferWithScores, Filters } from '@/types/insurance';

/**
 * Filtra le offerte in base ai criteri forniti.
 */
export function applyFilters(offers: OfferWithScores[], filters: Filters): OfferWithScores[] {
    return offers.filter(offer => {
        const { priceRange, scoreRange, selectedCoverages, selectedCompanies } = filters;

        if (offer.premium_annuale < priceRange[0] || offer.premium_annuale > priceRange[1]) return false;
        if (offer.averageMicroScore * 20 < scoreRange[0] || offer.averageMicroScore * 20 > scoreRange[1]) return false;
        
        if (selectedCompanies.length > 0 && !selectedCompanies.includes(offer.company)) {
            return false;
        }

        for (const covId of selectedCoverages) {
            const coverage = offer.coverages[covId as keyof typeof offer.coverages];
            if (!coverage || !coverage.covered) {
                return false;
            }
        }

        return true;
    });
}