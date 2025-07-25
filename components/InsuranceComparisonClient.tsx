// components/InsuranceComparisonClient.tsx
'use client'; // Fondamentale per usare hook come useState e useEffect

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { insuranceData } from '@/app/data/insuranceData';
import useComparisonLogic from '@/hooks/useComparisonLogic';

// Icons
import { SlidersHorizontal, Moon, Sun, Printer, PanelTopOpen, PanelTopClose, ListCollapse, ChevronDown, Check, X, FileDown, Star, Award, Gem, Car, User, Search } from 'lucide-react';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";


import DesktopView from './DesktopView';
import MobileView from './MobileView';
import FilterModal from './FilterModal';

// --- Componenti Ausiliari ---

// Componente per i badge (Miglior Prezzo, Qualità, etc.)
export const IconBadge = ({ icon, colorClass, bgColorClass, title }: { icon: React.ElementType, colorClass: string, bgColorClass: string, title: string }) => {
    const Icon = icon;
    return (
        <div title={title} className={`h-6 w-6 rounded-full flex items-center justify-center ${bgColorClass} ${colorClass}`}>
            <Icon className="h-3.5 w-3.5" />
        </div>
    );
};

// Componente per l'indicatore di punteggio colorato
export const ScoreIndicator = ({ score }: { score: number }) => {
    const color = score >= 4 ? 'text-green-600' : score >= 2.5 ? 'text-yellow-600' : 'text-red-600';
    return <span className={`font-bold text-base ${color}`}>{score.toFixed(1)}</span>;
};

// Componente per il cambio tema (Dark/Light)
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Cambia tema">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

// --- Componente Principale Client ---
export default function InsuranceComparisonClient() {
    const [data] = useState(insuranceData);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'full' | 'compact' | 'summary'>('full');

    const headerRef = useRef<HTMLElement>(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    const maxPremium = useMemo(() => Math.max(...data.offerte.map(o => o.premium_annuale)), [data.offerte]);

    const [filters, setFilters] = useState({
        priceRange: [0, maxPremium] as [number, number],
        scoreRange: [0, 100] as [number, number],
        selectedCoverages: [] as string[],
        searchTerm: '',
    });
    
    const areFiltersActive = useMemo(() => {
        return filters.searchTerm !== '' ||
               filters.priceRange[1] < maxPremium ||
               filters.scoreRange[0] > 0 ||
               filters.selectedCoverages.length > 0;
    }, [filters, maxPremium]);


    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        // Nasconde l'header solo se si scrolla verso il basso, non verso l'alto
        if (currentScrollY > lastScrollY.current && currentScrollY > (headerRef.current?.offsetHeight || 80)) {
            setIsHeaderVisible(false);
        } else {
            setIsHeaderVisible(true);
        }
        lastScrollY.current = currentScrollY;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const { sortedOffers } = useComparisonLogic(data, filters);
    
    const tableTopOffset = isHeaderVisible ? (headerRef.current?.offsetHeight || 0) : 0;
    
    const handleViewModeToggle = () => {
        if (viewMode === 'full') setViewMode('compact');
        else if (viewMode === 'compact') setViewMode('summary');
        else setViewMode('full');
    };

    const getViewModeButton = () => {
        switch (viewMode) {
            case 'full':
                return { Icon: PanelTopOpen, color: 'text-foreground', title: 'Vista Completa' };
            case 'compact':
                return { Icon: PanelTopClose, color: 'text-yellow-500', title: 'Vista Compatta' };
            case 'summary':
                return { Icon: ListCollapse, color: 'text-green-500', title: 'Vista Sintetica' };
            default:
                return { Icon: PanelTopOpen, color: 'text-foreground', title: 'Vista Completa' };
        }
    };

    const { Icon, color, title } = getViewModeButton();

    return (
        <>
            <div className="font-sans bg-background text-foreground min-h-screen">
                <header 
                    ref={headerRef} 
                    className={`p-3 md:p-4 border-b sticky top-0 z-40 bg-background/95 backdrop-blur-sm no-print transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}
                >
                    <div className="flex justify-end items-center">
                        <div className="flex items-center gap-2">
                   <Button onClick={handleViewModeToggle} title={title} variant="outline" size="icon" className={`hidden md:block ${color}`}>
                                 {/*Aggiunta la classe qui per centrare l'icona */}
                                 <Icon size={16} className="m-auto" />
                             </Button>

                             <Button onClick={() => window.print()} title="Stampa Tabella" variant="outline" size="icon" className="hidden md:block">
                                 <Printer size={16} className="m-auto"/>
                             </Button>

                             <Button 
                                 onClick={() => setFilterModalOpen(true)}
                                 title="Filtri"
                                 variant="outline"
                                 size="icon"
                             >
                                 <SlidersHorizontal size={16} className={areFiltersActive ? 'text-blue-500' : ''}/>
                             </Button>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
    
                <main>
                    {sortedOffers.length > 0 ? (
                        <>
                            <DesktopView data={data} offers={sortedOffers} viewMode={viewMode} tableTopOffset={tableTopOffset} />
                            <MobileView data={data} offers={sortedOffers} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-10 h-[60vh]">
                            <p className="text-xl font-semibold">Nessuna offerta trovata</p>
                            <p className="text-muted-foreground mt-2">Prova a modificare i filtri per trovare più risultati.</p>
                            <Button onClick={() => setFilterModalOpen(true)} className="mt-6">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Modifica Filtri
                            </Button>
                        </div>
                    )}
                </main>
                
                <footer className="text-center p-4 text-xs text-muted-foreground no-print">
                    copyright L+G SA Matteo Luca
                </footer>
    
                <FilterModal 
                    isOpen={isFilterModalOpen} 
                    onClose={() => setFilterModalOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                    data={data}
                />
            </div>
        </>
    );
}