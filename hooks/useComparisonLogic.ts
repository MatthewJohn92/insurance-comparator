// hooks/useComparisonLogic.ts
'use client';

import { useMemo } from 'react';
import { insuranceData } from '@/app/data/insuranceData';

// Definisco i tipi per una maggiore leggibilità 
type InsuranceData = typeof insuranceData;
type Offer = InsuranceData['offerte'][0];
type Category = InsuranceData['categorieCoperture'][0];

// --- MODIFICA #1: Aggiornamento dell'interfaccia dei filtri ---
interface Filters {
    priceRange: [number, number];
    scoreRange: [number, number];
    selectedCoverages: string[];
    selectedCompanies: string[]; // Sostituisce searchTerm
}

const useComparisonLogic = (data: InsuranceData, filters: Filters) => {
    return useMemo(() => {
        const { offerte, categorieCoperture } = data;
        const allMicroCoverages = categorieCoperture.flatMap(cat => cat.microCoperture);

        // 1. Calcolo punteggi per ogni offerta
        const offersWithScores = offerte.map(offer => {
            const microScores = allMicroCoverages.map(micro => offer.coverages[micro.id as keyof typeof offer.coverages]?.score || 0);
            const totalMicroScore = microScores.reduce((sum, score) => sum + score, 0);
            const averageMicroScore = microScores.length > 0 ? totalMicroScore / microScores.length : 0;

            const macroScores = categorieCoperture.map(category => {
                const categoryMicroIds = category.microCoperture.map(mc => mc.id);
                const categoryScores = categoryMicroIds.map(id => offer.coverages[id as keyof typeof offer.coverages]?.score || 0);
                const avg = categoryScores.length > 0 ? categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length : 0;
                return { category: category.nome, score: avg };
            });

            return {
                ...offer,
                averageMicroScore,
                macroScores: Object.fromEntries(macroScores.map(ms => [ms.category, ms.score])),
            };
        });
        
         // 2. Applicazione filtri
        const filteredOffers = offersWithScores.filter(offer => {
            // Aggiorniamo le variabili destrutturate
            const { priceRange, scoreRange, selectedCoverages, selectedCompanies } = filters;

            if (offer.premium_annuale < priceRange[0] || offer.premium_annuale > priceRange[1]) return false;
            if (offer.averageMicroScore * 20 < scoreRange[0] || offer.averageMicroScore * 20 > scoreRange[1]) return false;
            
            // --- MODIFICA #2: Nuova logica di filtro per le compagnie ---
            // Se ci sono compagnie selezionate e la compagnia dell'offerta non è tra quelle, la scartiamo.
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


        if (filteredOffers.length === 0) return { sortedOffers: [], allMicroCoverages };

        // 3. Calcolo punteggio prezzo e finale
        const minPremium = Math.min(...filteredOffers.map(o => o.premium_annuale));
        const maxPremium = Math.max(...filteredOffers.map(o => o.premium_annuale));

        const offersWithFinalScores = filteredOffers.map(offer => {
            let priceScore = 0;
            if (maxPremium > minPremium) {
                priceScore = 5 * (1 - (offer.premium_annuale - minPremium) / (maxPremium - minPremium));
            } else if (filteredOffers.length > 0) {
                priceScore = 5;
            }

            const finalScore = (offer.averageMicroScore * 0.7) + (priceScore * 0.3);
            const bestValue = offer.premium_annuale > 0 ? finalScore / offer.premium_annuale : 0;

            return { ...offer, finalScore, bestValue };
        });

        // 4. Identificazione delle migliori offerte
        let bestScoreOfferId = -1;
        let bestPriceOfferId = -1;
        let bestValueOfferId = -1;
        
        if (offersWithFinalScores.length > 0) {
            bestScoreOfferId = offersWithFinalScores.reduce((prev, curr) => curr.finalScore > prev.finalScore ? curr : prev).id;
            bestPriceOfferId = offersWithFinalScores.reduce((prev, curr) => curr.premium_annuale < prev.premium_annuale ? curr : prev).id;
            bestValueOfferId = offersWithFinalScores.reduce((prev, curr) => curr.bestValue > prev.bestValue ? curr : prev).id;
        }

        // 5. Ordinamento finale
        const sortedOffers = [...offersWithFinalScores].sort((a, b) => {
            const aIsBestValue = a.id === bestValueOfferId;
            const bIsBestValue = b.id === bestValueOfferId;
            const aIsBestScore = a.id === bestScoreOfferId;
            const bIsBestScore = b.id === bestScoreOfferId;
            const aIsBestPrice = a.id === bestPriceOfferId;
            const bIsBestPrice = b.id === bestPriceOfferId;

            const aRank = (aIsBestValue ? 4 : 0) + (aIsBestScore ? 2 : 0) + (aIsBestPrice ? 1 : 0);
            const bRank = (bIsBestValue ? 4 : 0) + (bIsBestScore ? 2 : 0) + (bIsBestPrice ? 1 : 0);

            if (aRank !== bRank) return bRank - aRank;
            return b.finalScore - a.finalScore;
        });
        
        // Assegnazione badge
        const finalSortedOffers = sortedOffers.map(offer => ({
            ...offer,
            isBestValue: offer.id === bestValueOfferId,
            isBestScore: offer.id === bestScoreOfferId,
            isBestPrice: offer.id === bestPriceOfferId,
        }));

        return { sortedOffers: finalSortedOffers, allMicroCoverages };

    }, [data, filters]);
};

export default useComparisonLogic;