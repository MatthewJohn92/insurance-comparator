// components/InsuranceComparisonClient.tsx
'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { insuranceData } from '@/app/data/insuranceData';
import useComparisonLogic from '@/hooks/useComparisonLogic';
import { SlidersHorizontal, Moon, Sun, Printer, PanelTopOpen, PanelTopClose, ListCollapse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import FilterModal from './FilterModal';
import PrintModal from './PrintModal';

// ... (Componente ThemeToggle rimane invariato)
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
        <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Cambia tema">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 m-auto" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};


export default function InsuranceComparisonClient() {
    // ... (Tutti gli hook useState, useRef, useEffect rimangono invariati)
    const [data] = useState(insuranceData);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [isPrintModalOpen, setPrintModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'full' | 'compact' | 'summary'>('full');

    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [footerHeight, setFooterHeight] = useState(0);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const measureFooter = () => {
            if (footerRef.current) {
                setFooterHeight(footerRef.current.offsetHeight);
            }
        };
        measureFooter();
        window.addEventListener('resize', measureFooter);
        return () => window.removeEventListener('resize', measureFooter);
    }, []);

    const maxPremium = useMemo(() => Math.max(...data.offerte.map(o => o.premium_annuale)), [data.offerte]);

    const [filters, setFilters] = useState({
        priceRange: [0, maxPremium] as [number, number],
        scoreRange: [0, 100] as [number, number],
        selectedCoverages: [] as string[],
        searchTerm: '',
    });
    
    const { sortedOffers } = useComparisonLogic(data, filters);
    
    const areFiltersActive = useMemo(() => {
        return filters.searchTerm !== '' ||
               filters.priceRange[1] < maxPremium ||
               filters.scoreRange[0] > 0 ||
               filters.selectedCoverages.length > 0;
    }, [filters, maxPremium]);


    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > (headerRef.current?.offsetHeight || 80)) {
            setIsHeaderVisible(false);
        } else {
            setIsHeaderVisible(true);
        }
        lastScrollY.current = currentScrollY;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const tableTopOffset = isHeaderVisible ? (headerRef.current?.offsetHeight || 0) : 0;
    
    const handleViewModeToggle = () => {
        const modes = ['full', 'compact', 'summary'];
        const currentIndex = modes.indexOf(viewMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setViewMode(modes[nextIndex] as 'full' | 'compact' | 'summary');
    };

    const getViewModeButton = () => {
        switch (viewMode) {
            case 'full': return { Icon: PanelTopOpen, color: 'text-foreground', title: 'Vista Completa' };
            case 'compact': return { Icon: PanelTopClose, color: 'text-yellow-500', title: 'Vista Compatta' };
            case 'summary': return { Icon: ListCollapse, color: 'text-green-500', title: 'Vista Sintetica' };
        }
    };
    const { Icon, color, title } = getViewModeButton();

    return (
        <div className="font-sans bg-background text-foreground min-h-screen flex flex-col">
            <header ref={headerRef} className={`p-2 md:p-2 border-b border-b-black/20 sticky top-0 z-40 no-print transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} flex items-center justify-between`}>
                <div>
                    <Image src="/LG_original.svg" alt="L+G SA Logo" width={120} height={35} className="h-7 w-auto dark:hidden" />
                    <Image src="/LG_white.svg" alt="L+G SA Logo" width={120} height={35} className="h-7 w-auto hidden dark:block" />
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleViewModeToggle} title={title} variant="outline" size="sm" className={`${color}`}>
                        <Icon size={16} className="m-auto" />
                    </Button>
                    <Button onClick={() => setPrintModalOpen(true)} title="Stampa" variant="outline" size="sm">
                        <Printer size={16} />
                    </Button>
                    <Button onClick={() => setFilterModalOpen(true)} title="Filtri" variant="outline" size="sm">
                        <SlidersHorizontal size={16} className={areFiltersActive ? 'text-blue-500' : ''}/>
                    </Button>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-grow">
                {sortedOffers.length > 0 ? (
                    <>
                        <DesktopView 
                            data={data} 
                            offers={sortedOffers} 
                            viewMode={viewMode} 
                            tableTopOffset={tableTopOffset} 
                            // 👇 Passiamo l'altezza del footer qui
                            footerHeight={footerHeight}
                            setViewMode={setViewMode}
                            filters={filters}
                        />
                        <MobileView 
                            data={data} 
                            offers={sortedOffers} 
                            filters={filters}
                            viewMode={viewMode}
                            // 👇 Passiamo l'altezza del footer qui
                            
                        />
                    </>
                ) : (
                    // ... (blocco "Nessuna offerta trovata" invariato)
                    <div className="flex flex-col items-center justify-center text-center p-10 h-full">
                        <p className="text-xl font-semibold">Nessuna offerta trovata</p>
                        <p className="text-muted-foreground mt-2">Prova a modificare i filtri per trovare più risultati.</p>
                        <Button onClick={() => setFilterModalOpen(true)} className="mt-6">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Modifica Filtri
                        </Button>
                    </div>
                )}
            </main>
            
<footer ref={footerRef} className="text-center p-4 text-xs text-muted-foreground no-print hidden md:block">
    copyright L+G SA Matteo Luca
</footer>

            <FilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} filters={filters} setFilters={setFilters} data={data} />
            <PrintModal isOpen={isPrintModalOpen} onClose={() => setPrintModalOpen(false)} offers={sortedOffers} />
        </div>
    );
}