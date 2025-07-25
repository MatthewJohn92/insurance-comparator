// components/FilterModal.tsx
'use client';

import React, { useMemo } from 'react';
import { Search } from 'lucide-react';

// Shadcn UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Tipizzazione dei dati
import { insuranceData } from '@/app/data/insuranceData';
type InsuranceData = typeof insuranceData;

// --- SEZIONE CORRETTA: Definiamo un tipo per i filtri ---
interface FiltersState {
    priceRange: [number, number];
    scoreRange: [number, number];
    selectedCoverages: string[];
    searchTerm: string;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>; // Usiamo il nostro tipo
    data: InsuranceData;
}

export default function FilterModal({ isOpen, onClose, filters, setFilters, data }: FilterModalProps) {
    // Calcoliamo questi valori una sola volta
    const allMicroCoverages = useMemo(() => data.categorieCoperture.flatMap(cat => cat.microCoperture), [data]);
    const maxPremium = useMemo(() => Math.ceil(Math.max(...data.offerte.map(o => o.premium_annuale)) / 10) * 10, [data.offerte]);

    // Gestore per le checkbox delle coperture
    const handleCheckboxChange = (covId: string) => {
        const newSelection = new Set(filters.selectedCoverages);
        if (newSelection.has(covId)) {
            newSelection.delete(covId);
        } else {
            newSelection.add(covId);
        }
        // Non serve più ': any'
        setFilters(prev => ({ ...prev, selectedCoverages: Array.from(newSelection) }));
    };
    
    // Funzione per resettare tutti i filtri
    const resetFilters = () => {
        setFilters({
            priceRange: [0, maxPremium],
            scoreRange: [0, 100],
            selectedCoverages: [],
            searchTerm: '',
        });
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col no-print">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Filtra Offerte</DialogTitle>
                    <DialogDescription>Affina la tua ricerca per trovare l offerta perfetta.</DialogDescription>
                </DialogHeader>

                <div className="p-1 pr-3 flex-grow overflow-y-auto space-y-6">
                    {/* Search Input */}
                    <div>
                        <Label className="text-base font-semibold">Cerca per compagnia</Label>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                value={filters.searchTerm}
                                // Non serve più ': any'
                                onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
                                placeholder="Es. AXA, Zurich..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <Label htmlFor="price-slider" className="text-base font-semibold">Premio Annuale (max)</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Slider
                                    id="price-slider"
                                    max={maxPremium}
                                    step={10}
                                    value={[filters.priceRange[1]]}
                                    // Non serve più ': any'
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value[0]] }))}
                                />
                                <span className="font-mono text-muted-foreground text-sm w-24 text-right">
                                    CHF {filters.priceRange[1].toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="score-slider" className="text-base font-semibold">Punteggio Qualità (min)</Label>
                             <div className="flex items-center gap-4 mt-2">
                                <Slider
                                    id="score-slider"
                                    max={100}
                                    step={5}
                                    value={[filters.scoreRange[0]]}
                                    // Non serve più ': any'
                                    onValueChange={(value) => setFilters(f => ({ ...f, scoreRange: [value[0], f.scoreRange[1]] }))}
                                />
                                <span className="font-mono text-muted-foreground text-sm w-24 text-right">
                                    {filters.scoreRange[0]} / 100
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div>
                        <Label className="text-base font-semibold">Coperture Essenziali</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 max-h-60 overflow-y-auto p-3 mt-2 border rounded-md">
                            {allMicroCoverages.map(cov => (
                                <div key={cov.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={cov.id}
                                        checked={filters.selectedCoverages.includes(cov.id)}
                                        onCheckedChange={() => handleCheckboxChange(cov.id)}
                                    />
                                    <Label htmlFor={cov.id} className="font-normal cursor-pointer">{cov.nome}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4 pt-4 border-t">
                    <Button variant="ghost" onClick={resetFilters}>Resetta Filtri</Button>
                    <Button onClick={onClose}>Mostra Risultati</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}