// hooks/useComparisonLogic.ts

/**
 * useComparisonLogic.ts
 * ---------------------
 * Questo hook personalizzato React (basato su `useMemo`) implementa la logica completa
 * per la comparazione dinamica delle offerte assicurative in un'applicazione di confronto.
 *
 * FUNZIONALITÀ PRINCIPALI:
 * 1. CALCOLO DEI PUNTEGGI:
 *    Per ciascuna offerta, viene calcolato:
 *    - Il punteggio medio delle micro-coperture (averageMicroScore), basato sui punteggi individuali assegnati a ciascuna copertura.
 *    - I punteggi medi per ciascuna categoria di copertura (macroScores), derivati aggregando le micro-coperture per categoria.
 *
 * 2. APPLICAZIONE DEI FILTRI:
 *    Il sistema filtra dinamicamente le offerte in base ai criteri scelti dall’utente:
 *    - Range di prezzo (`priceRange`)
 *    - Range di punteggio complessivo (`scoreRange`) su scala 0–100
 *    - Compagnie assicurative selezionate
 *    - Coperture specifiche che devono essere obbligatoriamente presenti e attive nell’offerta
 *
 * 3. CALCOLO DEL PUNTEGGIO FINALE:
 *    Per ogni offerta filtrata, vengono calcolati:
 *    - `priceScore`: punteggio da 0 a 5 che penalizza i premi più elevati, calcolato su base relativa rispetto al minimo e massimo premi trovati nel set filtrato
 *    - `finalScore`: punteggio complessivo normalizzato che bilancia qualità coperture (70%) e prezzo (30%)
 *    - `bestValue`: rapporto tra punteggio finale e premio, utilizzato per determinare il miglior rapporto qualità/prezzo
 *
 * 4. IDENTIFICAZIONE OFFERTE MIGLIORI:
 *    Vengono individuate le 3 offerte più rilevanti:
 *    - Miglior punteggio totale (finalScore più alto)
 *    - Miglior prezzo (premio più basso)
 *    - Miglior valore (bestValue più alto)
 *
 * 5. ORDINAMENTO E CLASSIFICA:
 *    Le offerte vengono ordinate secondo un sistema a punteggio (rank) che assegna un peso a ciascuna delle 3 metriche sopra indicate:
 *    - Miglior valore = +4
 *    - Miglior punteggio = +2
 *    - Miglior prezzo = +1
 *    Questo consente di stabilire una gerarchia visiva e oggettiva delle offerte.
 *
 * 6. ASSEGNAZIONE BADGE:
 *    Ogni offerta finale riceve una bandierina logica (`isBestScore`, `isBestPrice`, `isBestValue`) che può essere usata nella UI
 *    per evidenziare visivamente le caratteristiche chiave.
 *
 * 7. OUTPUT:
 *    L’hook restituisce:
 *    - `sortedOffers`: lista delle offerte ordinate secondo i criteri descritti
 *    - `allMicroCoverages`: lista piatta delle micro-coperture usata per generare dinamicamente intestazioni e controlli nei componenti di visualizzazione
 *
 * SCOPO:
 *    Questo hook incapsula tutta la logica business di valutazione, filtraggio e classificazione delle offerte, 
 *    mantenendo la UI (es. `DesktopView.tsx`) pulita e focalizzata solo sulla presentazione.
 */

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