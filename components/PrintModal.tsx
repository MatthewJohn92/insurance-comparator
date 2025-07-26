// components/PrintModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { generatePdf, OfferForPrint } from '@/lib/pdfService';

type PrintMode = 'top3' | 'summary' | 'detailed';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: OfferForPrint[];
}

export default function PrintModal({ isOpen, onClose, offers }: PrintModalProps) {
  const [mode, setMode] = useState<PrintMode>('top3');

  if (!isOpen) return null;

  const handleGenerate = () => {
    generatePdf(mode, offers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Genera PDF</DialogTitle>
          <DialogDescription>Seleziona la modalità di esportazione.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={mode} onValueChange={(val: PrintMode) => setMode(val)} className="space-y-2">
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
            <Label htmlFor="detailed">Tutto Dettagli</Label>
          </div>
        </RadioGroup>
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>Annulla</Button>
          <Button onClick={handleGenerate}>Genera PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
