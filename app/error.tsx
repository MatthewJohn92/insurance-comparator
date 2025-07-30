// app/error.tsx
'use client'; // I componenti di errore devono essere Client Components

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Puoi loggare l'errore in un servizio di monitoring
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background p-4">
      <h2 className="text-2xl font-bold text-destructive mb-4">
        Qualcosa è andato storto!
      </h2>
      <p className="text-muted-foreground mb-6">
        Non è stato possibile caricare i dati per il confronto.
      </p>
<Button
  onClick={() => {
    // Aggiungiamo un log per vedere l'azione nella console del browser
    console.log('Tentativo di reset in corso...');
    reset();
  }}
>
  Riprova
</Button>
      
    </div>
  );
}