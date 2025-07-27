// components/comparison/CoverageRow.tsx
import React from 'react';
import { Check, X } from 'lucide-react';
import { ScoreIndicator } from '@/components/ui/custom-components';
import type useComparisonLogic from '@/hooks/useComparisonLogic';
import { cn } from '@/lib/utils';

type OfferWithScores = ReturnType<typeof useComparisonLogic>['sortedOffers'][number];
type MicroCoverage = { id: string; nome: string };

interface CoverageRowProps {
  offer: OfferWithScores;
  microCoverage: MicroCoverage;
  showDetails: boolean;
  isMobile: boolean; // Prop per decidere il layout
}

export const CoverageRow: React.FC<CoverageRowProps> = ({ offer, microCoverage, showDetails, isMobile }) => {
  const coverage = offer.coverages[microCoverage.id as keyof typeof offer.coverages];

  // Contenuto comune: il simbolo, lo score e i dettagli
  const coverageContent = (
    <div className={cn(
      "flex flex-col text-sm",
       isMobile ? "w-1/2 items-end text-right" : "w-full items-center text-center justify-center"
    )}>
        {coverage && coverage.covered ? (
          <>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <ScoreIndicator score={coverage.score} />
            </div>
            {showDetails && (
              <p className="text-xs text-muted-foreground mt-1">
                {coverage.details}
              </p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <X className="h-4 w-4 text-red-500" />
            <span>{coverage?.details || "Non inclusa"}</span>
          </div>
        )}
    </div>
  );

  // === Layout per Mobile ===
  // Renderizza una riga completa con nome a sinistra e contenuto a destra
  if (isMobile) {
    return (
        <div className="flex items-start justify-between p-3 bg-background">
            <p className="w-1/2 pr-4 font-semibold text-sm">
                {microCoverage.nome}
            </p>
            {coverageContent}
        </div>
    )
  }

  // === Layout per Desktop ===
  // Renderizza solo la cella con il contenuto
  return (
    <div className={cn(
        "flex p-3 transition-all duration-300 bg-background border-r border-b",
        showDetails ? 'h-[5.5rem]' : 'h-14'
    )}>
        {coverageContent}
    </div>
  );
};