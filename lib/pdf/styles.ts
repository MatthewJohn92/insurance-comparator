// lib/pdf/styles.ts

export const headStyles = { 
    fillColor: '#155044', 
    textColor: '#FFFFFF', 
    fontStyle: 'bold' as const, 
    halign: 'center' as const 
};

export const macroCategoryStyles = { 
    fontStyle: 'bold' as const, 
    fillColor: '#F3F4F6', 
    textColor: '#000000' 
};

export const getScoreColor = (score: number): string => {
    if (score >= 4) return '#15803d'; // Verde Intenso
    if (score >= 2.5) return '#ca8a04'; // Giallo Intenso
    return '#dc2626'; // Rosso
};