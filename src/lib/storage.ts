import { UserProfile, SmokingLog } from '@/types';

const PROFILE_KEY = 'smok_ckansl_user_profile';
const LOGS_KEY = 'smok_ckansl_smoking_logs';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user-default',
  name: '禁煙チャレンジャー',
  startDate: new Date().toISOString(),
  dailyCigarettesBefore: 15,
  pricePerPack: 600,
  cigarettesPerPack: 20,
  partnerName: 'みどり',
  brands: ['メビウス (紙巻き／レギュラー等)'],
  useFuturePrice: true,
  isOnboarded: false,
};

export function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredLogs(): SmokingLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSmokingLog(dateStr: string, count: number, note?: string): SmokingLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const logs = getStoredLogs();
    const existingIndex = logs.findIndex((log) => log.date === dateStr);
    
    if (existingIndex >= 0) {
      logs[existingIndex].smokedCount = count;
      if (note !== undefined) logs[existingIndex].note = note;
      logs[existingIndex].loggedAt = new Date().toISOString();
    } else {
      logs.unshift({
        date: dateStr,
        smokedCount: count,
        note,
        loggedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return logs;
  } catch (e) {
    console.error('Failed to save log', e);
    return [];
  }
}
