'use client';

import type { TransitionStartFunction } from 'react';
import { createContext, useTransition } from 'react';

interface TemplateTableContextType {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

export const TemplateTableContext = createContext<TemplateTableContextType>({
  isPending: false,
  startTransition: () => {},
});

export default function TemplateTableProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <TemplateTableContext.Provider value={{ isPending, startTransition }}>
      {children}
    </TemplateTableContext.Provider>
  );
}
