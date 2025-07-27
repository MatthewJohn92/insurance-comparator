// app/page.tsx
import InsuranceComparisonClient from "@/components/InsuranceComparisonClient";

// Modifichiamo l'import per usare il nostro nuovo tipo 'InsuranceData'
import type { InsuranceData } from "@/app/data/insuranceData";

async function getInsuranceData(): Promise<InsuranceData> {
  const res = await fetch('http://localhost:3000/api/insurances', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Errore durante il recupero dei dati assicurativi');
  }

  // Usiamo il nostro tipo per garantire che i dati corrispondano
  const data: InsuranceData = await res.json();
  return data;
}

export default async function HomePage() {
  const initialData = await getInsuranceData();

  return (
      <InsuranceComparisonClient initialData={initialData} />
  );
}