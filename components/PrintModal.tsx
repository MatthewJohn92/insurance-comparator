// components/PrintModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { generatePdf, PrintMode } from '@/lib/pdfService';
import type { OfferForPrint } from '@/lib/pdfService';
import type { Category } from '@/app/data/insuranceData';

// --- MODIFICA #1: Aggiorniamo le props per ricevere le categorie filtrate ---
interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: OfferForPrint[];
  displayedCategories: Category[];
}

export default function PrintModal({ isOpen, onClose, offers, displayedCategories }: PrintModalProps) {
  const [mode, setMode] = useState<PrintMode>('top3');

  if (!isOpen) return null;

  const handleGenerate = () => {
    // --- MODIFICA #2: Passiamo le categorie filtrate alla funzione di generazione ---
    // La funzione generatePdf ora userà queste categorie quando mode === 'filtered'
    generatePdf(mode, offers, displayedCategories);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Genera PDF</DialogTitle>
          <DialogDescription>Seleziona la modalità di esportazione.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={mode} onValueChange={(val: string) => setMode(val as PrintMode)} className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top3" id="top3" />
            <Label htmlFor="top3">Top 3 Dettagli</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="summary" id="summary" />
            <Label htmlFor="summary">Tutte Sintetiche</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="detailed" id="detailed" />
            <Label htmlFor="detailed">Tutte Dettagliate</Label>
          </div>
          {/* --- MODIFICA #3: Aggiunta la nuova opzione di stampa --- */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="filtered" id="filtered" />
            <Label htmlFor="filtered">Dettagli Filtrati (Selezione Corrente)</Label>
          </div>
        </RadioGroup>
        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose}>Annulla</Button>
          <Button onClick={handleGenerate}>Genera PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}