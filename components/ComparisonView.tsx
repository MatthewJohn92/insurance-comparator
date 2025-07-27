// components/ComparisonView.tsx
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, Car, User, FileDown } from 'lucide-react';
import { ScoreIndicator } from './ui/custom-components';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

import type { InsuranceData, Category } from '@/app/data/insuranceData';
import useComparisonLogic from '@/hooks/useComparisonLogic';
import { OfferHeader as DesktopOfferHeader } from './comparison/OfferHeader';
import { CoverageRow } from './comparison/CoverageRow';
import { DesktopHeaderRow } from './comparison/DesktopHeaderRow';

type OfferWithScores = ReturnType<typeof useComparisonLogic>['sortedOffers'][number];

interface ComparisonViewProps {
  data: InsuranceData;
  offers: OfferWithScores[];
  viewMode: 'full' | 'compact' | 'summary';
  tableTopOffset: number;
  footerHeight: number;
  setViewMode: (mode: 'full' | 'compact' | 'summary') => void;
  filters: { selectedCoverages: string[] };
}

// === SOTTO-COMPONENTI PER LA VISTA MOBILE ===
const MobileOfferNavigator: React.FC<{ offers: OfferWithScores[]; visibleOfferId: number | null; onNavigate: (id: number) => void; }> = ({ offers, visibleOfferId, onNavigate }) => {
    const navRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (visibleOfferId && navRef.current) {
            const activeEl = navRef.current.querySelector(`[data-offer-id="${visibleOfferId}"]`);
            activeEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [visibleOfferId]);
    return (
        <div className="relative bg-sidebar-foreground p-2">
            <div ref={navRef} className="flex gap-3 overflow-x-auto scrollbar-hide">
                {offers.map((offer) => (
                    <button key={offer.id} data-offer-id={offer.id} onClick={() => onNavigate(offer.id)}
                        className={cn("flex-shrink-0 p-2 rounded-md border-2 bg-background transition-all duration-300",
                            visibleOfferId === offer.id ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-100")}>
                        <img src={offer.logo} alt={offer.company} className="h-6 object-contain" />
                    </button>
                ))}
            </div>
        </div>
    );
};
const MobileVisibleOfferHeader: React.FC<{ offer: OfferWithScores | undefined; clientData: InsuranceData['cliente']; }> = ({ offer, clientData }) => {
    if (!offer) return <div className="h-[152px] bg-background shadow-lg" />;
    return (
        <div className="bg-background shadow-lg">
            <div className="bg-sidebar-primary text-background p-2 flex items-center justify-between gap-4 text-xs font-medium border-b">
                <div className="flex items-center gap-2 truncate"><Car className="h-4 w-4 shrink-0" /><span className="truncate">{clientData.prodotto}</span></div>
                <div className="flex items-center gap-2 truncate"><User className="h-4 w-4 shrink-0" /><span className="truncate">{clientData.nome}</span></div>
            </div>
            <div className="p-4"><DesktopOfferHeader offer={offer} /></div>
        </div>
    );
};


// === COMPONENTE PRINCIPALE UNIFICATO ===
export default function ComparisonView({ data, offers, viewMode, tableTopOffset, footerHeight, setViewMode, filters }: ComparisonViewProps) {
    const isMobile = useIsMobile();
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        const allOpen = viewMode === 'full' || viewMode === 'compact';
        setOpenCategories(Object.fromEntries(data.categorieCoperture.map(c => [c.nome, allOpen])));
    }, [viewMode, data.categorieCoperture]);

    const toggleCategory = (categoryName: string) => {
        setOpenCategories(prev => ({ ...prev, [categoryName]: !prev[categoryName] }));
    };

    const shouldShowDetails = (categoryName: string) => {
        if (viewMode === 'full') return true;
        if (viewMode === 'summary' && openCategories[categoryName]) return true;
        return false;
    };
    
    const [visibleOfferId, setVisibleOfferId] = useState<number | null>(offers[0]?.id ?? null);
    const mainScrollContainerRef = useRef<HTMLDivElement>(null);
    const desktopScrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    
    const displayedCategories = useMemo(() => {
        const { selectedCoverages } = filters;
        if (selectedCoverages.length === 0) return data.categorieCoperture;
        return data.categorieCoperture
            .map(c => ({ ...c, microCoperture: c.microCoperture.filter(m => selectedCoverages.includes(m.id)) }))
            .filter(c => c.microCoperture.length > 0);
    }, [data.categorieCoperture, filters]);
    
    const visibleOffer = useMemo(() => offers.find((o) => o.id === visibleOfferId), [offers, visibleOfferId]);

    useEffect(() => {
        if (!isMobile || !mainScrollContainerRef.current) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const offerId = Number(entry.target.id.replace('offer-card-', ''));
                    setVisibleOfferId(offerId);
                }
            });
        }, { threshold: 0.7, root: mainScrollContainerRef.current });
        
        const cards = mainScrollContainerRef.current.querySelectorAll('[id^="offer-card-"]');
        cards.forEach(card => observer.observe(card));
        
        return () => observer.disconnect();
    }, [isMobile, offers, data]);

    const handleMobileNavigate = (id: number) => {
        const target = mainScrollContainerRef.current?.querySelector(`#offer-card-${id}`);
        target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };
    
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!desktopScrollContainerRef.current) return;
        setIsDragging(true);
        startX.current = e.pageX - desktopScrollContainerRef.current.offsetLeft;
        scrollLeft.current = desktopScrollContainerRef.current.scrollLeft;
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !desktopScrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - desktopScrollContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        desktopScrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    };

    if (isMobile === undefined) return null;
    
    // =================================================================
    // = RENDERIZZAZIONE MOBILE
    // =================================================================
    if (isMobile) {
        return (
            <Drawer>
                <div className="md:hidden flex flex-col bg-muted/30" style={{ height: `calc(100vh - ${tableTopOffset}px)` }}>
                    <header className="sticky top-0 z-10">
                        <MobileOfferNavigator offers={offers} visibleOfferId={visibleOfferId} onNavigate={handleMobileNavigate} />
                        <MobileVisibleOfferHeader offer={visibleOffer} clientData={data.cliente} />
                    </header>
                    <main ref={mainScrollContainerRef} className="flex-grow flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        {offers.map(offer => (
                            <div key={offer.id} id={`offer-card-${offer.id}`} className="w-screen h-full flex-shrink-0 snap-center overflow-y-auto scrollbar-hide p-4 space-y-4 pb-24">
                                {displayedCategories.map((category: Category) => (
                                    <Card key={category.nome} className="shadow-lg bg-card">
                                        <CardHeader onClick={() => toggleCategory(category.nome)} className="flex flex-row justify-between items-center cursor-pointer p-3">
                                            <CardTitle className="text-base">{category.nome}</CardTitle>
                                            <div className="flex items-center gap-4">
                                                <ScoreIndicator score={offer.macroScores[category.nome]} />
                                                <ChevronDown className={`transition-transform ${openCategories[category.nome] ? 'rotate-180' : ''}`} />
                                            </div>
                                        </CardHeader>
                                        {openCategories[category.nome] && (
                                            <CardContent className="p-0 border-t">
                                                <div className="divide-y">
                                                    {category.microCoperture.map(micro => (
                                                        <CoverageRow 
                                                            key={`${offer.id}-${micro.id}`} 
                                                            offer={offer} 
                                                            microCoverage={micro} 
                                                            showDetails={shouldShowDetails(category.nome)} 
                                                            isMobile={true}
                                                        />
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </main>
                </div>
                <DrawerTrigger asChild>
                    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none md:hidden">
                        <div className="w-20 h-2 bg-muted-foreground/50 rounded-full pointer-events-auto cursor-pointer" />
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4" />
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="text-xl">Osservazione Finale</DrawerTitle>
                        <DrawerDescription className="pt-2">{visibleOffer?.osservazione}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        {/* === MODIFICA QUI === */}
                        <Button asChild className="bg-[#155044] text-white hover:bg-[#155044]/90">
                            <a href={visibleOffer?.pdf_link} target="_blank" rel="noopener noreferrer">
                                <FileDown className="mr-2 h-4 w-4" />Scarica Offerta PDF
                            </a>
                        </Button>
                        {/* === FINE MODIFICA === */}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    // =================================================================
    // = RENDERIZZAZIONE DESKTOP
    // =================================================================
    return (
        <div className="hidden md:block" id="print-area">
             <div ref={desktopScrollContainerRef} className="overflow-x-auto scrollbar-hide"
                style={{ height: `calc(100vh - ${tableTopOffset}px - ${footerHeight}px)` }}
                onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                <div className={`grid bg-background w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ gridTemplateColumns: `18rem repeat(${offers.length}, minmax(14rem, 1fr))`, minWidth: `${18 + offers.length * 14}rem` }}>
                    <div className="sticky top-0 left-0 z-30 bg-[#155044] border-r border-b flex flex-col items-center justify-center p-3 text-center h-[7.5rem]">
                        <Car className="h-7 w-7 text-white mb-1" /><p className="text-xs font-bold text-white leading-tight">{data.cliente.prodotto}</p>
                        <div className="flex items-center gap-1.5 mt-2"><User className="h-3 w-3 text-white" /><p className="text-xs text-gray-50">{data.cliente.nome}</p></div>
                    </div>
                    {offers.map(offer => (
                        <div key={offer.id} className="sticky top-0 z-20 bg-muted border-r border-b h-[7.5rem]"><DesktopOfferHeader offer={offer} /></div>
                    ))}
                    {displayedCategories.map((category: Category) => (
                        <React.Fragment key={category.nome}>
                            <div className="sticky left-0 z-10 bg-muted border-b border-r flex items-center justify-between p-3 h-12">
                                <h3 className="font-bold text-sm text-foreground">{category.nome}</h3>
                                <button type="button" onClick={() => toggleCategory(category.nome)} className="text-muted-foreground hover:text-foreground" title={openCategories[category.nome] ? `Comprimi ${category.nome}` : `Espandi ${category.nome}`}>
                                    <ChevronDown className={`h-5 w-5 transition-transform ${openCategories[category.nome] ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            {offers.map(offer => (
                                <div key={offer.id} className="flex items-center justify-center p-3 bg-muted h-12 border-b border-r">
                                    <span className="text-xs text-muted-foreground mr-2">Media:</span>
                                    <ScoreIndicator score={offer.macroScores[category.nome]} />
                                </div>
                            ))}
                            {openCategories[category.nome] && category.microCoperture.map(micro => (
                                <React.Fragment key={micro.id}>
                                    <DesktopHeaderRow label={micro.nome} showDetails={shouldShowDetails(category.nome)} />
                                    {offers.map(offer => (
                                        <CoverageRow 
                                            key={`${offer.id}-${micro.id}`} 
                                            offer={offer} 
                                            microCoverage={micro} 
                                            showDetails={shouldShowDetails(category.nome)} 
                                            isMobile={false}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                     <div className="sticky left-0 z-10 bg-muted border-r border-t p-3 h-24 flex items-center"><h3 className="font-bold text-sm text-foreground">Osservazione Finale</h3></div>
                        {offers.map(offer => 
                            <div key={offer.id} id={`observation-cell-${offer.id}`} className="bg-muted border-r border-t p-3 h-24 flex flex-col justify-center items-center text-center">
                                <p className="text-xs text-muted-foreground italic mb-2">{offer.osservazione}</p>
                                <a 
                                    href={offer.pdf_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                >
                                    <FileDown className="h-3 w-3" />
                                    <span>Apri PDF</span>
                                </a>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}