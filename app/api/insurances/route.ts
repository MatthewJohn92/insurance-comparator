// app/api/insurances/route.ts

import { NextResponse } from 'next/server';
import { insuranceData } from '@/app/data/insuranceData';


export async function GET() {
  // --- Simulazione e Logica Futura ---
  // In un'applicazione reale, qui effettueresti una chiamata a un database
  // o a un servizio esterno per recuperare i dati.
  // Per ora, continuiamo a usare i nostri dati statici.

  // Aggiungiamo un piccolo ritardo artificiale di 500 millisecondi (mezzo secondo)
  // per simulare il tempo che impiegherebbe una vera chiamata di rete.
  // Questo ci aiuterà a vedere gli stati di caricamento in futuro.
  
  await new Promise(resolve => setTimeout(resolve, 500));

  // Usiamo NextResponse.json() per restituire i nostri dati assicurativi
  // in formato JSON, con uno status code HTTP 200 (OK).
  return NextResponse.json(insuranceData);
}