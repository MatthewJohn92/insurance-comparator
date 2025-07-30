// lib/comparison/scores.ts

import type { Offer, Category, OfferWithScores, OfferWithFinalScores } from '@/types/insurance'; // Creeremo questo file di tipi

/**
 * Calcola il punteggio medio delle micro-coperture per una singola offerta.
 */
function calculateAverageMicroScore(offer: Offer, allMicroCoverages: { id: string }[]): number {
    const microScores = allMicroCoverages.map(micro => offer.coverages[micro.id as keyof typeof offer.coverages]?.score || 0);
    const totalMicroScore = microScores.reduce((sum, score) => sum + score, 0);
    return microScores.length > 0 ? totalMicroScore / microScores.length : 0;
}

/**
 * Calcola i punteggi medi per ogni macro-categoria di una singola offerta.
 */
function calculateMacroScores(offer: Offer, categories: Category[]): { [key: string]: number } {
    return Object.fromEntries(
        categories.map(category => {
            const categoryMicroIds = category.microCoperture.map(mc => mc.id);
            const categoryScores = categoryMicroIds.map(id => offer.coverages[id as keyof typeof offer.coverages]?.score || 0);
            const avg = categoryScores.length > 0 ? categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length : 0;
            return [category.nome, avg];
        })
    );
}

/**
 * Funzione principale che arricchisce le offerte con i punteggi iniziali.
 */
export function addInitialScores(offers: Offer[], categories: Category[]): OfferWithScores[] {
    const allMicroCoverages = categories.flatMap(cat => cat.microCoperture);
    return offers.map(offer => ({
        ...offer,
        averageMicroScore: calculateAverageMicroScore(offer, allMicroCoverages),
        macroScores: calculateMacroScores(offer, categories),
    }));
}

/**
 * Calcola il punteggio finale e il bestValue per le offerte già filtrate.
 */
export function addFinalScores(offers: OfferWithScores[]): OfferWithFinalScores[] {
    if (offers.length === 0) return [];

    const minPremium = Math.min(...offers.map(o => o.premium_annuale));
    const maxPremium = Math.max(...offers.map(o => o.premium_annuale));

    return offers.map(offer => {
        let priceScore = 5;
        if (maxPremium > minPremium) {
            priceScore = 5 * (1 - (offer.premium_annuale - minPremium) / (maxPremium - minPremium));
        }

        const finalScore = (offer.averageMicroScore * 0.7) + (priceScore * 0.3);
        const bestValue = offer.premium_annuale > 0 ? finalScore / offer.premium_annuale : 0;

        return { ...offer, finalScore, bestValue };
    });
}