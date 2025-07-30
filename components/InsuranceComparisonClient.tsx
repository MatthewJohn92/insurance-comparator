// components/InsuranceComparisonClient.tsx
'use client';

// <-- MODIFICA 1: Aggiunti gli hook per la gestione dell'URL -->
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import useComparisonLogic from '@/hooks/useComparisonLogic';
import { SlidersHorizontal, Moon, Sun, Printer, PanelTopOpen, PanelTopClose, ListCollapse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";
import FilterModal from './FilterModal';
import PrintModal from './PrintModal';
import ComparisonView from './ComparisonView';

import type { InsuranceData } from '@/app/data/insuranceData';

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

export default function InsuranceComparisonClient({ initialData }: { initialData: InsuranceData }) {
    const [data] = useState(initialData);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [isPrintModalOpen, setPrintModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'full' | 'compact' | 'summary'>('full');

    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [footerHeight, setFooterHeight] = useState(0);
    const lastScrollY = useRef(0);

    // <-- MODIFICA 2: Inizializzazione degli hook per l'URL -->
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const maxPremium = useMemo(() => Math.max(...data.offerte.map(o => o.premium_annuale)), [data.offerte]);

    // <-- MODIFICA 3: Lo stato dei filtri viene ora inizializzato leggendo i parametri dall'URL -->
    // Se un parametro non è presente nell'URL, viene usato un valore di default.
    const [filters, setFilters] = useState({
        priceRange: [0, Number(searchParams.get('maxPrice')) || maxPremium] as [number, number],
        scoreRange: [Number(searchParams.get('minScore')) || 0, 100] as [number, number],
        selectedCoverages: searchParams.get('coverages')?.split(',') || [],
        selectedCompanies: searchParams.get('companies')?.split(',') || [],
    });

    // <-- MODIFICA 4: Aggiunto un useEffect per aggiornare l'URL quando i filtri cambiano -->
    useEffect(() => {
        // Creiamo un nuovo oggetto URLSearchParams per costruire la query string.
        const params = new URLSearchParams();

        // Aggiungiamo i parametri all'URL solo se sono diversi dai valori di default per mantenerlo pulito.
        if (filters.priceRange[1] < maxPremium) {
            params.set('maxPrice', filters.priceRange[1].toString());
        }
        if (filters.scoreRange[0] > 0) {
            params.set('minScore', filters.scoreRange[0].toString());
        }
        if (filters.selectedCompanies.length > 0) {
            params.set('companies', filters.selectedCompanies.join(','));
        }
        if (filters.selectedCoverages.length > 0) {
            params.set('coverages', filters.selectedCoverages.join(','));
        }
        
        // Trasformiamo i parametri in una stringa (es. "maxPrice=950&companies=AXA")
        const queryString = params.toString();

        // Usiamo router.replace per aggiornare l'URL. Questo non ricarica la pagina e non
        // crea una nuova voce nella cronologia del browser, permettendo un'esperienza fluida.
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });

    }, [filters, pathname, router, maxPremium]); // Questo effetto si attiva ogni volta che i filtri cambiano.


    const { sortedOffers } = useComparisonLogic(data, filters);
    
    const displayedCategories = useMemo(() => {
        const { selectedCoverages } = filters;
        if (selectedCoverages.length === 0) {
            return data.categorieCoperture;
        }
        return data.categorieCoperture
            .map(c => ({ ...c, microCoperture: c.microCoperture.filter(m => selectedCoverages.includes(m.id)) }))
            .filter(c => c.microCoperture.length > 0);
    }, [data.categorieCoperture, filters]);
    
    const areFiltersActive = useMemo(() => {
        return filters.selectedCompanies.length > 0 ||
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
        const measureFooter = () => {
            if (footerRef.current) {
                setFooterHeight(footerRef.current.offsetHeight);
            }
        };
        measureFooter();
        window.addEventListener('resize', measureFooter);
        return () => window.removeEventListener('resize', measureFooter);
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
                    <ComparisonView
                        data={data}
                        offers={sortedOffers}
                        viewMode={viewMode}
                        tableTopOffset={tableTopOffset}
                        footerHeight={footerHeight}
                        setViewMode={setViewMode}
                        filters={filters}
                        displayedCategories={displayedCategories}
                    />
                ) : (
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
            <PrintModal 
                isOpen={isPrintModalOpen} 
                onClose={() => setPrintModalOpen(false)} 
                offers={sortedOffers} 
                displayedCategories={displayedCategories}
            />
        </div>
    );
}