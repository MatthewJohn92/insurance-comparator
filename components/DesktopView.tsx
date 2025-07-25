// components/DesktopView.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, X, FileDown, Star, Award, Gem, Car, User } from 'lucide-react';
import { IconBadge, ScoreIndicator } from './ui/custom-components';
import useComparisonLogic from '@/hooks/useComparisonLogic';
import { insuranceData } from '@/app/data/insuranceData';
type InsuranceData = typeof insuranceData;
type OfferWithScores = ReturnType<typeof useComparisonLogic>['sortedOffers'][number];

interface FiltersState {
    selectedCoverages: string[];
}

interface DesktopViewProps {
    data: InsuranceData;
    offers: OfferWithScores[];
    viewMode: 'full' | 'compact' | 'summary';
    tableTopOffset: number;
    footerHeight: number;
    setViewMode: (mode: 'full' | 'compact' | 'summary') => void;
    filters: FiltersState;
}

export default function DesktopView({ data, offers, viewMode, tableTopOffset, footerHeight, setViewMode, filters }: DesktopViewProps) {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(data.categorieCoperture.map(c => [c.nome, true]))
    );
    
    const displayedCategories = useMemo(() => {
        const { selectedCoverages } = filters;
        if (selectedCoverages.length === 0) {
            return data.categorieCoperture;
        }
        return data.categorieCoperture
            .map(category => ({
                ...category,
                microCoperture: category.microCoperture.filter(micro =>
                    selectedCoverages.includes(micro.id)
                ),
            }))
            .filter(category => category.microCoperture.length > 0);
    }, [data.categorieCoperture, filters]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeft.current = scrollContainerRef.current.scrollLeft;
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    };
    
    useEffect(() => {
        if (viewMode === 'summary') {
            setOpenCategories(Object.fromEntries(data.categorieCoperture.map(c => [c.nome, false])));
        }
        else if (viewMode === 'full') {
            setOpenCategories(Object.fromEntries(data.categorieCoperture.map(c => [c.nome, true])));
        }
    }, [viewMode, data.categorieCoperture]);

    const toggleCategory = (categoryName: string) => {
        if (viewMode === 'summary') {
            setViewMode('compact');
        }
        setOpenCategories(prev => ({ ...prev, [categoryName]: !prev[categoryName] }));
    };

    const showDetails = viewMode === 'full';
    const microRowClass = `flex flex-col p-3 transition-all duration-300 ${showDetails ? 'h-[5.5rem]' : 'h-14'}`;
    const macroRowClass = "flex items-center justify-center p-3 bg-muted h-12";

    if (offers.length === 0) return null;

    return (
        <div className="hidden md:block" id="print-area">
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide"
                style={{ height: `calc(100vh - ${tableTopOffset}px - ${footerHeight}px)` }}
            >
                <div
                    className={`grid bg-background w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{
                        gridTemplateColumns: `18rem repeat(${offers.length}, minmax(14rem, 1fr))`, 
                        minWidth: `${18 + offers.length * 14}rem`, 
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="sticky top-0 left-0 z-30 bg-background border-r border-b flex flex-col items-center justify-center p-3 text-center h-[7.5rem]">
                        <Car className="h-7 w-7 text-primary mb-1" />
                        <p className="text-xs font-bold text-foreground leading-tight">{data.cliente.prodotto}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{data.cliente.nome}</p>
                        </div>
                    </div>
                    {offers.map(offer => (
                        <div key={offer.id} className="sticky top-0 z-20 bg-muted border-r border-b p-2 h-[7.5rem]">
                           <div className="relative flex flex-col items-center text-center h-full justify-center">
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
                                {/* 👇 MODIFICA QUI: da right-1 a left-1 👇 */}
                                <a href={offer.pdf_link} download target="_blank" rel="noopener noreferrer" className="absolute bottom-1 left-1 text-muted-foreground hover:text-primary transition-colors">
                                    <FileDown className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                    
                    {displayedCategories.map(category => (<React.Fragment key={category.nome}><div className="sticky left-0 z-10 bg-muted border-r border-b flex items-center justify-between p-3 h-12"><h3 className="font-bold text-sm text-foreground">{category.nome}</h3><button type="button" onClick={() => toggleCategory(category.nome)} className="text-muted-foreground hover:text-foreground" aria-label={`Espandi o collassa la categoria ${category.nome}`}><ChevronDown className={`h-5 w-5 transition-transform ${openCategories[category.nome] ? 'rotate-180' : ''}`} /></button></div>{offers.map(offer => <div key={offer.id} className={`${macroRowClass} border-r border-b`}><span className="text-xs text-muted-foreground mr-2">Media:</span><ScoreIndicator score={offer.macroScores[category.nome]} /></div>)}{openCategories[category.nome] && category.microCoperture.map(micro => (<React.Fragment key={micro.id}><div className={`sticky left-0 z-10 bg-background border-r border-b ${microRowClass}`}><span className="font-bold text-xs text-foreground">{micro.nome}</span></div>{offers.map(offer => { const coverage = offer.coverages[micro.id as keyof typeof offer.coverages]; return (<div key={`${offer.id}-${micro.id}`} className={`bg-background border-r border-b ${microRowClass}`}>{coverage && coverage.covered ? (<><div className="flex items-center justify-center gap-2"><Check className="h-4 w-4 text-green-500" /><ScoreIndicator score={coverage.score} /></div>{showDetails && <p className="text-[11px] text-muted-foreground text-center mt-1">{coverage.details}</p>}</>) : (<div className="flex items-center justify-center gap-2 text-center"><X className="h-4 w-4 text-red-500" /><span className="text-xs text-muted-foreground">{coverage?.details || 'Non inclusa'}</span></div>)}</div>);})}</React.Fragment>))}</React.Fragment>))}
                    
                    <>
                        <div className="sticky left-0 z-10 bg-muted border-r border-t p-3 h-24 flex items-center"><h3 className="font-bold text-sm text-foreground">Osservazione Finale</h3></div>
                        {offers.map(offer => <div key={offer.id} id={`observation-cell-${offer.id}`} className="bg-muted border-r border-t p-3 h-24 flex flex-col justify-center items-center text-center"><p className="text-xs text-muted-foreground italic mb-2">{offer.osservazione}</p><a href={offer.pdf_link} download className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"><FileDown className="h-3 w-3" /><span>Scarica PDF</span></a></div>)}
                    </>
                </div>
            </div>
        </div>
    );
};