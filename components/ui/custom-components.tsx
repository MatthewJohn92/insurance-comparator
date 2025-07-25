// components/ui/custom-components.tsx
'use client';

import React from 'react';

// Componente per i badge (Miglior Prezzo, Qualità, etc.)
export const IconBadge = ({ icon, colorClass, bgColorClass, title }: { icon: React.ElementType, colorClass: string, bgColorClass: string, title: string }) => {
    const Icon = icon;
    return (
        <div title={title} className={`h-6 w-6 rounded-full flex items-center justify-center ${bgColorClass} ${colorClass}`}>
            <Icon className="h-3.5 w-3.5" />
        </div>
    );
};

// Componente per l'indicatore di punteggio colorato
export const ScoreIndicator = ({ score }: { score: number }) => {
    const color = score >= 4 ? 'text-green-600' : score >= 2.5 ? 'text-yellow-600' : 'text-red-600';
    return <span className={`font-bold text-base ${color}`}>{score.toFixed(1)}</span>;
};