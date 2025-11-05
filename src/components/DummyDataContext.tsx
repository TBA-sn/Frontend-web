// src/contexts/DummyDataContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

export type Category = {
  name: string;
  score: number;
  comment?: string;
};

export type DummyAnalysis = {
  id: string;
  model_id: string;
  code: string;
  language: string;
  trigger: string;
  criteria: string[]; // e.g. ["readability","efficiency"...]
  scores: { global: number; model: number };
  categories: Category[];
  summary?: string;
  createdAt: string;
};

type DummyContextValue = {
  list: DummyAnalysis[];
  addDummy: (payload: Omit<DummyAnalysis, "id" | "createdAt">) => void;
  clearAll: () => void;
};

const DummyDataContext = createContext<DummyContextValue | undefined>(
  undefined
);

export const DummyDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [list, setList] = useState<DummyAnalysis[]>([]);

  const addDummy = (payload: Omit<DummyAnalysis, "id" | "createdAt">) => {
    const item: DummyAnalysis = {
      ...payload,
      id: `dummy_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setList((s) => [item, ...s]);
    // 콘솔에 찍어두면 편함
    console.debug("Added dummy analysis", item);
  };

  const clearAll = () => setList([]);

  return (
    <DummyDataContext.Provider value={{ list, addDummy, clearAll }}>
      {children}
    </DummyDataContext.Provider>
  );
};

export function useDummyData() {
  const ctx = useContext(DummyDataContext);
  if (!ctx)
    throw new Error("useDummyData must be used within DummyDataProvider");
  return ctx;
}
