// hooks/useComparisonLogic.ts
'use client';

import { useMemo } from 'react';
import type { InsuranceData, Filters } from '@/types/insurance';
import { processInsuranceComparison } from '@/lib/comparison/orchestrator';

const useComparisonLogic = (data: InsuranceData, filters: Filters) => {
    return useMemo(() => {
        const sortedOffers = processInsuranceComparison(data, filters);
        return { sortedOffers };
    }, [data, filters]);
};

export default useComparisonLogic;