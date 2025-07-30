// app/loading.tsx
import Image from 'next/image';

/**
 * Pagina di caricamento con un anello di progressione animato attorno al logo del brand.
 * Un piccolo arco colorato ruota continuamente per un feedback visivo dinamico.
 */
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Contenitore per il logo e l'anello di caricamento */}
        <div className="relative h-40 w-40">
          
          {/* Cerchio SVG per l'anello di caricamento */}
          <svg className="absolute top-0 left-0 h-full w-full" viewBox="0 0 100 100">
            {/* Traccia di sfondo del cerchio, leggermente più scura */}
            <circle
              className="stroke-current text-gray-200 dark:text-gray-700/50"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="5"
              fill="transparent"
            />
            
            {/* MODIFICA CHIAVE:
              - `animate-spin`: Usa l'animazione di rotazione standard di Tailwind, che è più veloce.
              - `strokeDasharray`: Imposta la lunghezza dell'arco visibile (80) e dello spazio vuoto (203). La somma (283) è la circonferenza del cerchio (2 * PI * 45). Questo crea un arco che è circa un quarto del cerchio.
              - `strokeDashoffset`: Rimosso, non è più necessario per questo tipo di animazione.
            */}
            <circle
              className="stroke-current text-brand animate-spin origin-center"
              strokeDasharray="80 203"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="5"
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Logo posizionato al centro dell'anello */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/LG_original.svg"
              alt="L+G SA Logo"
              width={120}
              height={35}
              className="h-9 w-auto dark:hidden"
              priority
            />
            <Image
              src="/LG_white.svg"
              alt="L+G SA Logo"
              width={120}
              height={35}
              className="h-9 w-auto hidden dark:block"
              priority
            />
          </div>
        </div>
        
        {/* Testo informativo */}
        <p className="text-muted-foreground mt-8 text-sm tracking-widest animate-pulse">
          PREPARAZIONE DEL CONFRONTO...
        </p>

      </div>
    </div>
  );
}