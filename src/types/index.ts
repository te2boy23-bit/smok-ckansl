export interface BrandDetail {
  id: string;
  name: string;
  category: 'paper' | 'heated';
  maker: string;
  currentPrice: number;
  futurePrice?: number;
  note?: string;
}

export type PartnerTone = 'deredere' | 'forest' | 'passionate';

export interface UserProfile {
  id: string;
  name: string;
  partnerName: string;
  partnerTone: PartnerTone;
  startDate: string;
  dailyCigarettesBefore: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  brands: string[];
  smokingTiming: string[];
  quitMotive: string[];
  targetReward: string;
  targetRewardCost: number;
  useFuturePrice?: boolean;
  isOnboarded?: boolean;
  authProvider?: 'line' | 'apple' | 'google' | 'email';
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
  durationSeconds?: number;
}

export interface PriceEquivalent {
  minCigarettes: number;
  cost: number;
  itemName: string;
  category: string;
  emoji: string;
  description: string;
}

export interface RescueMission {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  emoji: string;
}
