// app/api/insurances/route.ts
import { NextResponse } from 'next/server';
import { insuranceData } from '@/app/data/insuranceData';

export async function GET() {
  /* console.log("Fetching insurance data..."); */

  // Ritardo di 2 secondi per vedere bene lo skeleton di caricamento.
  //TODO: Rimuovere in produzione.
  await new Promise(resolve => setTimeout(resolve, 2000));

  // --- SIMULAZIONE ERRORE ---
  

  // Aggiungiamo una probabilità del 50% di generare un errore.
  // In produzione, rimuoverai questa logica.
 /*  if (Math.random() > 0.5) {
    console.error("Simulating a server error."); // Restituendo uno status 500, attiveremo il componente `error.tsx`.
    return NextResponse.json(
      { message: "Errore simulato dal server." },
      { status: 500 }
    );
  }
 */
  // Se non si verifica l'errore, restituisci i dati come prima.
  return NextResponse.json(insuranceData);
}

// Nota: per forzare l'errore in `page.tsx` che usa `fetch`,
// dobbiamo lanciare un'eccezione, non solo restituire uno status 500.
// Modifichiamo il `page.tsx` per gestire questo.