export interface MarketItem {
  id: string;
  name: string;
  purchased: boolean;
  cost: number | null;
  createdAt: Date;
}

export interface MarketList {
  id: string;
  date: string;
  items: MarketItem[];
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseRecord {
  date: string;
  totalCost: number;
  itemCount: number;
}

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  language: Language;
  theme: Theme;
}