// lib/comparison/ranking.ts
import type { OfferWithFinalScores, RankedOffer } from '@/types/insurance';

/**
 * Identifica le offerte migliori per prezzo, punteggio e valore.
 */
function identifyBestOffers(offers: OfferWithFinalScores[]): { bestScoreOfferId: number; bestPriceOfferId: number; bestValueOfferId: number } {
    if (offers.length === 0) {
        return { bestScoreOfferId: -1, bestPriceOfferId: -1, bestValueOfferId: -1 };
    }
    const bestScoreOfferId = offers.reduce((prev, curr) => curr.finalScore > prev.finalScore ? curr : prev).id;
    const bestPriceOfferId = offers.reduce((prev, curr) => curr.premium_annuale < prev.premium_annuale ? curr : prev).id;
    const bestValueOfferId = offers.reduce((prev, curr) => curr.bestValue > prev.bestValue ? curr : prev).id;
    
    return { bestScoreOfferId, bestPriceOfferId, bestValueOfferId };
}

/**
 * Assegna un punteggio di rank e ordina la lista finale di offerte.
 */
export function sortAndRankOffers(offers: OfferWithFinalScores[]): RankedOffer[] {
    if (offers.length === 0) return [];

    const { bestScoreOfferId, bestPriceOfferId, bestValueOfferId } = identifyBestOffers(offers);

    const rankedOffers = offers.map(offer => {
        const rank = (offer.id === bestValueOfferId ? 4 : 0) +
                     (offer.id === bestScoreOfferId ? 2 : 0) +
                     (offer.id === bestPriceOfferId ? 1 : 0);
        return {
            ...offer,
            isBestValue: offer.id === bestValueOfferId,
            isBestScore: offer.id === bestScoreOfferId,
            isBestPrice: offer.id === bestPriceOfferId,
            rank,
        };
    });

    return rankedOffers.sort((a, b) => {
        if (a.rank !== b.rank) return b.rank - a.rank;
        return b.finalScore - a.finalScore;
    });
}