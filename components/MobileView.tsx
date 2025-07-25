// components/MobileView.tsx
'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Check, X, FileDown, Gem, Award, Star, ChevronDown, Car, User } from 'lucide-react';
import { ScoreIndicator, IconBadge } from './ui/custom-components';
import useComparisonLogic from '@/hooks/useComparisonLogic';
import { insuranceData } from '@/app/data/insuranceData';
import { cn } from '@/lib/utils';
type InsuranceData = typeof insuranceData;
type OfferWithScores = ReturnType<typeof useComparisonLogic>['sortedOffers'][number];

// --- COMPONENTE NAVIGATOR (invariato) ---
interface OfferNavigatorProps {
    offers: OfferWithScores[];
    visibleOfferId: number | null;
    onNavigate: (offerId: number) => void;
}
const OfferNavigator: React.FC<OfferNavigatorProps> = ({ offers, visibleOfferId, onNavigate }) => {
    const navContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (visibleOfferId && navContainerRef.current) {
            const activeLogoElement = navContainerRef.current.querySelector(`[data-offer-id="${visibleOfferId}"]`);
            if (activeLogoElement) activeLogoElement.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
    }, [visibleOfferId]);
    return (
        <div className="sticky top-[56px] z-20 bg-muted border-b p-2">
            <div className="relative"><div ref={navContainerRef} className="flex gap-3 overflow-x-auto scrollbar-hide">{offers.map(offer => (<button key={offer.id} data-offer-id={offer.id} onClick={() => onNavigate(offer.id)} className={cn("flex-shrink-0 p-2 rounded-md border-2 bg-background transition-all duration-300", visibleOfferId === offer.id ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-100 hover:border-muted-foreground/50")}><img src={offer.logo} alt={offer.company} className="h-6 object-contain" /></button>))}</div><div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-muted to-transparent pointer-events-none" /></div>
        </div>
    );
};


interface FiltersState {
    selectedCoverages: string[];
}
interface MobileViewProps {
    data: InsuranceData;
    offers: OfferWithScores[];
    filters: FiltersState;
    viewMode: 'full' | 'compact' | 'summary';
}
interface MobileOfferCardProps {
    offer: OfferWithScores;
    data: InsuranceData;
    filters: FiltersState;
    viewMode: 'full' | 'compact' | 'summary';
    onVisible: (offerId: number) => void;
    sharedScrollTop: React.MutableRefObject<number>;
}

const MobileOfferCard = ({ offer, data, filters, viewMode, onVisible, sharedScrollTop }: MobileOfferCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                onVisible(offer.id);
                if (scrollableContentRef.current) {
                    scrollableContentRef.current.scrollTop = sharedScrollTop.current;
                }
            }
        }, { threshold: 0.7 });
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [offer.id, onVisible, sharedScrollTop]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        sharedScrollTop.current = e.currentTarget.scrollTop;
    };

    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [isObservationOpen, setIsObservationOpen] = useState(false);
    const showDetails = viewMode === 'full';

    useEffect(() => {
        const allOpen = Object.fromEntries(data.categorieCoperture.map(c => [c.nome, true]));
        const allClosed = Object.fromEntries(data.categorieCoperture.map(c => [c.nome, false]));
        if (viewMode === 'summary') setOpenCategories(allClosed);
        else setOpenCategories(allOpen);
    }, [viewMode, data.categorieCoperture]);

    const toggleCategory = (name: string) => setOpenCategories(prev => ({ ...prev, [name]: !prev[name] }));

    const displayedCategories = useMemo(() => {
        const { selectedCoverages } = filters;
        if (selectedCoverages.length === 0) return data.categorieCoperture;
        return data.categorieCoperture
            .map(category => ({ ...category, microCoperture: category.microCoperture.filter(micro => selectedCoverages.includes(micro.id)) }))
            .filter(category => category.microCoperture.length > 0);
    }, [data.categorieCoperture, filters]);

    return (
        <div ref={cardRef} id={`offer-card-${offer.id}`} className="w-screen h-full flex-shrink-0 snap-center flex flex-col">
            <div ref={scrollableContentRef} onScroll={handleScroll} className="flex-grow overflow-y-auto scrollbar-hide p-4 space-y-3">
                
                {/* 👇 BLOCCO UNICO STICKY 👇 */}
                <div className="sticky top-0 z-10 shadow-lg rounded-lg">
                    {/* Banner Info Cliente */}
                    <div className="bg-ring text-ring-foreground rounded-t-lg p-2 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 truncate">
                            <Car className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate font-semibold">{data.cliente.prodotto}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                             <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{data.cliente.nome}</span>
                        </div>
                    </div>
                    
                    {/* Card Offerta (senza angoli superiori arrotondati) */}
                    <Card className="rounded-t-none">
                        <CardHeader className="flex flex-col items-center text-center p-3">
                            <img src={offer.logo} alt={`${offer.company} Logo`} className="h-12 mb-2 object-contain" />
                            <CardTitle className="text-xl">{offer.company}</CardTitle>
                            <CardDescription className="text-xs">{offer.policyNumber}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center p-3 pt-0">
                            <div className="text-3xl font-light text-foreground mb-1">{offer.premium_annuale.toLocaleString('de-CH', { style: 'currency', currency: 'CHF' })}</div>
                            <div className="flex items-center justify-center gap-2 mb-2"><span className="text-sm text-muted-foreground">Score:</span><ScoreIndicator score={offer.finalScore} /></div>
                            <div className="flex flex-wrap justify-center gap-1.5">{offer.isBestValue && <IconBadge icon={Gem} title="Miglior Rapporto Qualità/Prezzo" colorClass="text-amber-400" bgColorClass="bg-amber-400/20" />}{offer.isBestScore && <IconBadge icon={Award} title="Miglior Punteggio" colorClass="text-teal-400" bgColorClass="bg-teal-400/20" />}{offer.isBestPrice && <IconBadge icon={Star} title="Miglior Prezzo" colorClass="text-sky-400" bgColorClass="bg-sky-400/20" />}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Card delle Coperture */}
                {displayedCategories.map(category => (<Card key={category.nome} className="shadow-lg bg-muted/50"><CardHeader onClick={() => toggleCategory(category.nome)} className="flex flex-row justify-between items-center cursor-pointer p-3"><CardTitle className="text-base">{category.nome}</CardTitle><div className="flex items-center gap-4"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground hidden sm:inline">Media:</span><ScoreIndicator score={offer.macroScores[category.nome]} /></div><ChevronDown className={`transition-transform ${openCategories[category.nome] ? 'rotate-180' : ''}`} /></div></CardHeader>{openCategories[category.nome] && (<CardContent className="p-0 border-t"><div className="divide-y divide-muted-foreground/20">{category.microCoperture.map(micro => { const coverage = offer.coverages[micro.id as keyof typeof offer.coverages]; return (<div key={micro.id} className="flex items-start justify-between p-3 bg-background"><p className="w-1/2 pr-4 font-semibold text-sm">{micro.nome}</p><div className="w-1/2 flex flex-col items-end text-right text-sm">{coverage && coverage.covered ? (<><div className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><ScoreIndicator score={coverage.score} /></div>{showDetails && <p className="text-xs text-muted-foreground mt-1">{coverage.details}</p>}</>) : (<div className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4 text-red-500" /><span>{coverage?.details || 'Non inclusa'}</span></div>)}</div></div>);})}</div></CardContent>)}</Card>))}
            
                {/* Card Osservazione Finale */}
                <Card className="shadow-lg">
                    <CardHeader onClick={() => setIsObservationOpen(prev => !prev)} className="flex flex-row justify-between items-center cursor-pointer p-3"><CardTitle className="text-base">Osservazione Finale</CardTitle><ChevronDown className={`transition-transform ${isObservationOpen ? 'rotate-180' : ''}`} /></CardHeader>
                    {isObservationOpen && (<CardContent className="pt-2 p-3"><p className="text-sm text-muted-foreground italic">{offer.osservazione}</p></CardContent>)}
                    <CardFooter className="p-2"><Button asChild className="w-full"><a href={offer.pdf_link} download><FileDown className="mr-2 h-4 w-4" />Scarica PDF</a></Button></CardFooter>
                </Card>
            </div>
        </div>
    );
};


export default function MobileView({ data, offers, filters, viewMode }: MobileViewProps) {
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const [visibleOfferId, setVisibleOfferId] = useState<number | null>(offers[0]?.id ?? null);
    const sharedScrollTop = useRef(0);

    const handleNavigation = (offerId: number) => {
        const targetElement = mainContainerRef.current?.querySelector(`#offer-card-${offerId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    };

    if (offers.length === 0) return null;
    
    const HEADER_HEIGHT = 56;
    
    return (
        <div className="md:hidden flex flex-col" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
            <OfferNavigator 
                offers={offers} 
                visibleOfferId={visibleOfferId}
                onNavigate={handleNavigation}
            />
            <div ref={mainContainerRef} className="flex-grow overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                <div className="flex h-full">
                    {offers.map(offer => (
                        <MobileOfferCard 
                            key={offer.id} 
                            offer={offer} 
                            data={data} 
                            filters={filters} 
                            viewMode={viewMode}
                            onVisible={setVisibleOfferId}
                            sharedScrollTop={sharedScrollTop}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}