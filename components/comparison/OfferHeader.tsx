// components/comparison/OfferHeader.tsx
import React from 'react';
import { FileDown, Gem, Award, Star } from 'lucide-react';
import { ScoreIndicator, IconBadge } from '@/components/ui/custom-components';
import useComparisonLogic from '@/hooks/useComparisonLogic';

// Usiamo un trucco per ottenere il tipo di un singolo elemento dell'array
type OfferWithScores = ReturnType<typeof useComparisonLogic>['sortedOffers'][number];

interface OfferHeaderProps {
  offer: OfferWithScores;
}

export const OfferHeader: React.FC<OfferHeaderProps> = ({ offer }) => {
  return (
    <div className="relative flex flex-col items-center text-center h-full justify-center p-2">
      <div className="flex items-center gap-2 mb-1.5">
        <img src={offer.logo} alt={`${offer.company} Logo`} className="h-5 w-5 rounded-full object-contain border bg-white" />
        <p className="font-bold text-sm text-foreground">{offer.company}</p>
      </div>
      <p className="text-[11px] text-muted-foreground mb-1.5">{offer.policyNumber}</p>
      <div className="text-xl font-bold text-foreground mb-1.5">
        {offer.premium_annuale.toLocaleString('de-CH', { style: 'currency', currency: 'CHF', minimumFractionDigits: 2 }).replace('CHF', '').trim()}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Score:</span>
        <ScoreIndicator score={offer.finalScore} />
      </div>
      <div className="absolute top-1 right-1 flex flex-col gap-1.5">
        {offer.isBestValue && <IconBadge icon={Gem} title="Miglior Rapporto Qualità/Prezzo" colorClass="text-amber-400" bgColorClass="bg-amber-400/20" />}
        {offer.isBestScore && <IconBadge icon={Award} title="Miglior Punteggio" colorClass="text-teal-400" bgColorClass="bg-teal-400/20" />}
        {offer.isBestPrice && <IconBadge icon={Star} title="Miglior Prezzo" colorClass="text-sky-400" bgColorClass="bg-sky-400/20" />}
      </div>
      <a href={offer.pdf_link} download target="_blank" rel="noopener noreferrer" className="absolute bottom-1 left-1 text-muted-foreground hover:text-primary transition-colors">
        <FileDown className="h-4 w-4" />
        <span className="sr-only">Scarica PDF</span>
      </a>
    </div>
  );
};