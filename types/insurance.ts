// types/insurance.ts
import type { insuranceData } from "@/app/data/insuranceData";

export type InsuranceData = typeof insuranceData;
export type Offer = InsuranceData['offerte'][0];
export type Category = InsuranceData['categorieCoperture'][0];

export interface Filters {
    priceRange: [number, number];
    scoreRange: [number, number];
    selectedCoverages: string[];
    selectedCompanies: string[];
}

// Tipi arricchiti
export type OfferWithScores = Offer & {
  averageMicroScore: number;
  macroScores: { [key: string]: number };
};

export type OfferWithFinalScores = OfferWithScores & {
  finalScore: number;
  bestValue: number;
};

export type RankedOffer = OfferWithFinalScores & {
  isBestValue: boolean;
  isBestScore: boolean;
  isBestPrice: boolean;
  rank: number;
};



// --- TIPI PER LA GENERAZIONE PDF ---
export type PrintMode = 'top3' | 'summary' | 'detailed' | 'filtered';

export interface OfferForPrint {
    id: number;
    company: string;
    premium_annuale: number;
    finalScore: number;
    macroScores: { [key: string]: number };
    coverages: Record<string, { covered: boolean; score: number; details?: string }>;
    variante: string;
    osservazione?: string;
}