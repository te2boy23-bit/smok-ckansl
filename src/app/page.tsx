'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, SmokingLog } from '@/types';
import {
  DEFAULT_PROFILE,
  getStoredProfile,
  saveStoredProfile,
  getStoredLogs,
  saveSmokingLog,
} from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
import { ReplacementBanner } from '@/components/ReplacementBanner';
import { MainCounter } from '@/components/MainCounter';
import { AnniversaryCard } from '@/components/AnniversaryCard';
import { PraiseRecorder } from '@/components/PraiseRecorder';
import { PriceEquivalentCard } from '@/components/PriceEquivalentCard';
import { LockScreenWidgetModal } from '@/components/LockScreenWidgetModal';
import { LoginProfileModal } from '@/components/LoginProfileModal';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [logs, setLogs] = useState<SmokingLog[]>([]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredProfile();
    setProfile(stored);
    setLogs(getStoredLogs());
    if (!stored.isOnboarded) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);
  }, []);

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    showToast('プロファイル設定を保存しました！');
  };

  const handleCompleteOnboarding = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    setShowOnboarding(false);
    showToast(`${updated.name}さん、禁煙チャレンジ開始！全力で応援します！`);
  };

  const handleSaveSmokingLog = (count: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedLogs = saveSmokingLog(today, count);
    setLogs(updatedLogs);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((l) => l.date === todayStr);
  const todaySmoked = todayLog ? todayLog.smokedCount : 0;

  const totalSmokedCount = logs.reduce((acc, cur) => acc + cur.smokedCount, 0);

  const start = new Date(profile.startDate).getTime();
  const currentDays = Math.max(0, (Date.now() - start) / (1000 * 60 * 60 * 24));
  const expectedCigarettes = Math.floor(currentDays * profile.dailyCigarettesBefore);
  const totalSavedCount = Math.max(0, expectedCigarettes - totalSmokedCount);

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#071c12]" />;
  }

  return (
    <div className="min-h-screen bg-[#071c12] text-[#ecfdf5] flex flex-col font-sans selection:bg-[#10b981] selection:text-[#071c12] relative overflow-x-hidden">
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#059669]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#84cc16]/10 rounded-full blur-[140px] pointer-events-none" />

      {showOnboarding && (
        <OnboardingFlow
          initialProfile={profile}
          onComplete={handleCompleteOnboarding}
        />
      )}

      <Navbar
        profile={profile}
        onOpenWidgetModal={() => setIsWidgetModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6 relative z-10">
        <ReplacementBanner onSuccess={(msg) => showToast(msg)} />

        <MainCounter
          profile={profile}
          totalSmokedSinceStart={totalSmokedCount}
        />

        <AnniversaryCard profile={profile} />

        <PraiseRecorder
          todaySmoked={todaySmoked}
          onSaveLog={handleSaveSmokingLog}
          partnerName={profile.partnerName}
        />

        <PriceEquivalentCard
          profile={profile}
          totalSmokedCount={totalSmokedCount}
          totalSavedCount={totalSavedCount}
        />
      </main>

      <footer className="mt-16 bg-[#05170f] border-t border-[#143a25] py-8 text-center text-xs font-semibold text-[#6ee7b7] relative z-10">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Heart className="w-4 h-4 text-[#10b981] fill-[#10b981]" />
          <span className="text-[#a7f3d0]">煙のない健やかな明日へ — Smok-Ckansl</span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-[#347852]">
          <button
            onClick={() => setShowOnboarding(true)}
            className="underline hover:text-[#a7f3d0] transition cursor-pointer"
          >
            銘柄アンケート・初期設定をやり直す
          </button>
          <span>•</span>
          <span>白・黒・オレンジ完全排除グリーンUI</span>
        </div>
      </footer>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#10b981] to-[#059669] text-[#071c12] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce font-black text-xs border border-[#34d399]">
          <Sparkles className="w-4 h-4 text-[#071c12]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isWidgetModalOpen && (
        <LockScreenWidgetModal
          profile={profile}
          onClose={() => setIsWidgetModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <LoginProfileModal
          profile={profile}
          onSave={handleUpdateProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}
