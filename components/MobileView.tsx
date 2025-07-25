// components/MobileView.tsx
'use client';

import React from 'react';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

// Icons
import { Check, X, FileDown, Gem, Award, Star } from 'lucide-react';

// Helper Components & Types
import { ScoreIndicator, IconBadge } from './ui/custom-components';
import useComparisonLogic from '@/hooks/useComparisonLogic';
import { insuranceData } from '@/app/data/insuranceData';
type InsuranceData = typeof insuranceData;
type OfferWithScores = ReturnType<typeof useComparisonLogic>['sortedOffers'][number];

// Props for the main component
interface MobileViewProps {
    data: InsuranceData;
    offers: OfferWithScores[];
}

// Props for a single card
interface MobileOfferCardProps {
    offer: OfferWithScores;
    data: InsuranceData;
}

const MobileOfferCard = ({ offer, data }: MobileOfferCardProps) => {
    return (
        <div className="w-full flex-shrink-0 snap-center p-4">
            {/* Card principale con le info dell'offerta */}
            <Card className="shadow-lg">
                <CardHeader className="text-center items-center">
                    <img src={offer.logo} alt={`${offer.company} Logo`} className="h-10 mb-3 object-contain dark:invert" />
                    <CardTitle>{offer.company}</CardTitle>
                    <CardDescription>{offer.policyNumber}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="text-4xl font-light text-foreground mb-3">
                        {offer.premium_annuale.toLocaleString('de-CH', { style: 'currency', currency: 'CHF' })}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-md text-muted-foreground">Score:</span>
                        <ScoreIndicator score={offer.finalScore} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {offer.isBestValue && <IconBadge icon={Gem} title="Miglior Rapporto Qualità/Prezzo" colorClass="text-amber-400" bgColorClass="bg-amber-400/20" />}
                        {offer.isBestScore && <IconBadge icon={Award} title="Miglior Punteggio" colorClass="text-teal-400" bgColorClass="bg-teal-400/20" />}
                        {offer.isBestPrice && <IconBadge icon={Star} title="Miglior Prezzo" colorClass="text-sky-400" bgColorClass="bg-sky-400/20" />}
                    </div>
                </CardContent>
            </Card>

            {/* Dettagli delle coperture per questa offerta */}
            <div className="mt-4 space-y-4">
                {data.categorieCoperture.map(category => (
                    <div key={category.nome} className="bg-background rounded-lg border">
                        <h3 className="font-bold text-lg p-3 bg-muted/50 rounded-t-lg flex justify-between items-center">
                            {category.nome}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-muted-foreground">Media:</span>
                                <ScoreIndicator score={offer.macroScores[category.nome]} />
                            </div>
                        </h3>
                        <div className="divide-y">
                            {category.microCoperture.map(micro => {
                                const coverage = offer.coverages[micro.id as keyof typeof offer.coverages];
                                return (
                                    <div key={micro.id} className="p-3 grid grid-cols-3 gap-2 items-start">
                                        <div className="col-span-1 font-bold text-sm text-foreground">{micro.nome}</div>
                                        <div className="col-span-2 text-sm text-muted-foreground">
                                            {coverage && coverage.covered ? (
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                        <ScoreIndicator score={coverage.score} />
                                                    </div>
                                                    <p className="text-xs">{coverage.details}</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                    <span>{coverage?.details || 'Non inclusa'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sezione finale con osservazioni e download */}
            <Card className="mt-4 shadow-lg">
                <CardHeader>
                    <CardTitle>Osservazione Finale</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic mb-4">{offer.osservazione}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <a href={offer.pdf_link} download>
                            <FileDown className="mr-2 h-4 w-4" />
                            Scarica PDF
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default function MobileView({ data, offers }: MobileViewProps) {
    if (offers.length === 0) return null;
    
    return (
        // Container per lo scroll orizzontale a "scatto"
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            <div className="flex w-max">
                {offers.map(offer => (
                    <MobileOfferCard key={offer.id} offer={offer} data={data} />
                ))}
            </div>
        </div>
    );
}