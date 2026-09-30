export interface BrandDetail {
  id: string;
  name: string;
  category: 'paper' | 'heated';
  maker: string;
  currentPrice: number;
  futurePrice?: number;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  startDate: string;
  dailyCigarettesBefore: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  partnerName: string;
  brands: string[];
  useFuturePrice?: boolean;
  isOnboarded?: boolean;
}

export interface SmokingLog {
  date: string;
  smokedCount: number;
  note?: string;
  loggedAt: string;
}

export interface Milestone {
  days: number;
  title: string;
  badge: string;
  loveMessage: string;
  bodyBenefit: string;
}

export interface ReplacementIdea {
  id: string;
  title: string;
  category: 'drink' | 'body' | 'mind' | 'mouth';
  description: string;
  iconName: string;
}

export interface PriceEquivalent {
  minCigarettes: number;
  itemName: string;
  category: string;
  emoji: string;
  description: string;
}
