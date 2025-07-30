// app/page.tsx
import InsuranceComparisonClient from "@/components/InsuranceComparisonClient";
import type { InsuranceData } from "@/app/data/insuranceData";

async function getInsuranceData(): Promise<InsuranceData> {
  // <-- MODIFICA: Usiamo la variabile d'ambiente per l'URL -->
  // Questo rende la chiamata più robusta e pronta per la produzione.
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/insurances`;

  const res = await fetch(apiUrl, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Errore durante il recupero dei dati assicurativi');
  }

  const data: InsuranceData = await res.json();
  return data;
}

export default async function HomePage() {
  const initialData = await getInsuranceData();

  return (
      <InsuranceComparisonClient initialData={initialData} />
  );
}