import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ForecastFilterState {
  year: number;
  startDate: Date | null;
  endDate: Date | null;
  teamId: string | null;
  responsibleId: string | null;
  tagId: string | null;
  scenarioId: string | null;
}

interface ForecastFilterContextValue {
  filters: ForecastFilterState;
  update: (patch: Partial<ForecastFilterState>) => void;
  reset: () => void;
}

const ForecastFilterContext = createContext<ForecastFilterContextValue | undefined>(undefined);

const initialState = (): ForecastFilterState => {
  const now = new Date();
  const year = now.getFullYear();
  return {
    year,
    startDate: new Date(year, 0, 1),
    endDate: new Date(year, 11, 31),
    teamId: null,
    responsibleId: null,
    tagId: null,
    scenarioId: null,
  };
};

export function ForecastFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ForecastFilterState>(initialState());

  const update = useCallback((patch: Partial<ForecastFilterState>) => {
    setFilters(prev => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => { setFilters(initialState()); }, []);

  return (
    <ForecastFilterContext.Provider value={{ filters, update, reset }}>
      {children}
    </ForecastFilterContext.Provider>
  );
}

export function useForecastFilters() {
  const ctx = useContext(ForecastFilterContext);
  if (!ctx) throw new Error('useForecastFilters must be used within ForecastFilterProvider');
  return ctx;
}
