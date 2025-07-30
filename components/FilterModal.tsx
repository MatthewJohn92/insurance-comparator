// components/FilterModal.tsx

/**
 * FilterModal.tsx
 * ----------------
 * Questo componente React fornisce una finestra modale per filtrare le offerte assicurative
 * visualizzate nell'interfaccia di comparazione. È parte integrante dell'esperienza utente
 * in quanto consente una ricerca mirata e personalizzata basata su parametri reali.
 *
 * FUNZIONALITÀ PRINCIPALI:
 *
 * 1. SELEZIONE COMPAGNIE:
 *    Mostra dinamicamente tutte le compagnie presenti nei dati delle offerte.
 *    L'utente può selezionare una o più compagnie da includere nei risultati,
 *    con gestione dello stato tramite `selectedCompanies` nel filtro.
 *
 * 2. SLIDER INTERATTIVI:
 *    - **Premio Annuale**: consente di impostare un tetto massimo sul costo dell’assicurazione.
 *    - **Punteggio Qualità**: permette di filtrare le offerte in base a una soglia minima di qualità media
 *      (score calcolato sulle microcoperture, riportato su scala 0–100).
 *
 * 3. FILTRAGGIO PER COPERTURE:
 *    Consente all’utente di selezionare coperture obbligatorie.
 *    Se viene selezionata una copertura, solo le offerte che la includono come “attiva” (`covered: true`)
 *    saranno mostrate nei risultati.
 *    Include una barra di ricerca con filtro in tempo reale sulle microcoperture disponibili.
 *
 * 4. GESTIONE STATO E RESET:
 *    - I filtri sono gestiti esternamente tramite lo stato `filters` e `setFilters`.
 *    - Il bottone "Resetta Filtri" riporta tutte le selezioni ai valori iniziali:
 *      prezzo massimo, punteggio minimo = 0, nessuna copertura o compagnia selezionata.
 *
 * 5. INTERFACCIA E DESIGN:
 *    Il contenuto è impaginato all’interno del componente `Dialog` di shadcn/ui.
 *    Il layout è responsive e ottimizzato per schermate medio-grandi.
 *    Le interazioni sono progettate per offrire feedback immediato e semplicità d’uso.
 *
 * SCOPO:
 *    Questo componente permette di costruire in tempo reale una query di filtro applicabile
 *    alle offerte assicurative, migliorando l’esperienza di comparazione e aiutando l’utente
 *    a trovare con precisione le opzioni più rilevanti in base alle proprie esigenze.
 *
 * DIPENDENZE:
 *    - Componenti UI da shadcn/ui (Dialog, Button, Input, Slider, Checkbox, Label)
 *    - Icone da `lucide-react`
 *    - Stato dei filtri e dati passati dal componente genitore
 *
 * NOTE:
 *    L’hook `useMemo` è usato per ottimizzare il calcolo delle compagnie, coperture e filtri derivati.
 */

'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import type { InsuranceData } from '@/app/data/insuranceData';

// --- MODIFICA #1: Aggiornamento dell'interfaccia dei filtri ---
interface FiltersState {
    priceRange: [number, number];
    scoreRange: [number, number];
    selectedCoverages: string[];
    selectedCompanies: string[]; // Sostituisce searchTerm
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
    data: InsuranceData;
}

export default function FilterModal({ isOpen, onClose, filters, setFilters, data }: FilterModalProps) {
    const [coverageSearchTerm, setCoverageSearchTerm] = useState('');

    // Otteniamo una lista unica di tutte le compagnie per generare le checkbox
    const allCompanies = useMemo(() => [...new Set(data.offerte.map(o => o.company))].sort(), [data.offerte]);

    const allMicroCoverages = useMemo(() => data.categorieCoperture.flatMap(cat => cat.microCoperture), [data]);
    const maxPremium = useMemo(() => Math.ceil(Math.max(...data.offerte.map(o => o.premium_annuale)) / 10) * 10, [data.offerte]);

    const filteredMicroCoverages = useMemo(() => {
        if (!coverageSearchTerm) {
            return allMicroCoverages;
        }
        return allMicroCoverages.filter(cov =>
            cov.nome.toLowerCase().includes(coverageSearchTerm.toLowerCase())
        );
    }, [allMicroCoverages, coverageSearchTerm]);

    // --- MODIFICA #2: Nuova funzione per gestire la selezione delle compagnie ---
    const handleCompanyCheckboxChange = (companyName: string) => {
        setFilters(prev => {
            const newSelection = new Set(prev.selectedCompanies);
            if (newSelection.has(companyName)) {
                newSelection.delete(companyName);
            } else {
                newSelection.add(companyName);
            }
            return { ...prev, selectedCompanies: Array.from(newSelection) };
        });
    };

    const handleCoverageCheckboxChange = (covId: string) => {
        setFilters(prev => {
            const newSelection = new Set(prev.selectedCoverages);
            if (newSelection.has(covId)) {
                newSelection.delete(covId);
            } else {
                newSelection.add(covId);
            }
            return { ...prev, selectedCoverages: Array.from(newSelection) };
        });
    };
    
    // --- MODIFICA #3: Aggiornamento della funzione di reset ---
    const resetFilters = () => {
        setFilters({
            priceRange: [0, maxPremium],
            scoreRange: [0, 100],
            selectedCoverages: [],
            selectedCompanies: [], // Resetta l'array delle compagnie
        });
        setCoverageSearchTerm('');
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col no-print">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Filtra Offerte</DialogTitle>
                    <DialogDescription>Affina la tua ricerca per trovare un offerta perfetta.</DialogDescription>
                </DialogHeader>

                <div className="p-1 pr-3 flex-grow overflow-y-auto space-y-6">
                    {/* --- MODIFICA #4: Sostituzione dell'input con le checkbox delle compagnie --- */}
                    <div>
                        <Label className="text-base font-semibold">Seleziona compagnie</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 mt-2 p-3 border rounded-md">
                            {allCompanies.map(company => (
                                <div key={company} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`company-${company}`}
                                        checked={filters.selectedCompanies.includes(company)}
                                        onCheckedChange={() => handleCompanyCheckboxChange(company)}
                                    />
                                    <Label htmlFor={`company-${company}`} className="font-normal cursor-pointer">{company}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sezione Sliders (invariata) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <Label htmlFor="price-slider" className="text-base font-semibold">Premio Annuale (max)</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Slider
                                    id="price-slider"
                                    max={maxPremium}
                                    step={10}
                                    value={[filters.priceRange[1]]}
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
                                    onValueChange={(value) => setFilters(f => ({ ...f, scoreRange: [value[0], f.scoreRange[1]] }))}
                                />
                                <span className="font-mono text-muted-foreground text-sm w-24 text-right">
                                    {filters.scoreRange[0]} / 100
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sezione Coperture (invariata) */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Coperture Essenziali</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                value={coverageSearchTerm}
                                onChange={(e) => setCoverageSearchTerm(e.target.value)}
                                placeholder="Cerca copertura (es. Furto, Danni...)"
                                className="pl-10"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 max-h-60 overflow-y-auto p-3 border rounded-md">
                            {filteredMicroCoverages.map(cov => (
                                <div key={cov.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={cov.id}
                                        checked={filters.selectedCoverages.includes(cov.id)}
                                        onCheckedChange={() => handleCoverageCheckboxChange(cov.id)}
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