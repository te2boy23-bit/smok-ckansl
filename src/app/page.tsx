'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, SmokingLog, AppLanguage } from '@/types';
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
import { RescueShelterModal } from '@/components/RescueShelterModal';
import { GoogleAuthAndPremiumModal } from '@/components/GoogleAuthAndPremiumModal';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [logs, setLogs] = useState<SmokingLog[]>([]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShelterModalOpen, setIsShelterModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
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

  const currentLang: AppLanguage = profile.language || 'ja';

  const handleToggleLanguage = () => {
    const nextLang: AppLanguage = currentLang === 'ja' ? 'en' : 'ja';
    const updated = { ...profile, language: nextLang };
    setProfile(updated);
    saveStoredProfile(updated);
    showToast(nextLang === 'en' ? 'Switched to English!' : '日本語に切り替えました！');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    showToast(currentLang === 'en' ? 'Settings saved!' : 'カルテ設定を保存しました！');
  };

  const handleCompleteOnboarding = (updated: UserProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    setShowOnboarding(false);
    const welcome = currentLang === 'en'
      ? `Welcome ${updated.name}! Your buddy "${updated.partnerName}" is here to cheer you on!`
      : `ようこそ${updated.name}さん！相棒の「${updated.partnerName}」が全力で応援するよ！`;
    showToast(welcome);
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
    return <div className="min-h-screen bg-[#04140d]" />;
  }

  return (
    <div className="min-h-screen bg-[#04140d] text-[#ecfdf5] flex flex-col font-sans selection:bg-[#10b981] selection:text-[#04140d] relative overflow-x-hidden">
      {/* 背景の柔らかな環境発光 */}
      <div className="fixed top-0 left-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#059669]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#84cc16]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 初期オンボーディング */}
      {showOnboarding && (
        <OnboardingFlow
          initialProfile={profile}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* ナビバー（レスポンシブ＆言語切り替え＆Google/課金対応） */}
      <Navbar
        profile={profile}
        language={currentLang}
        onToggleLanguage={handleToggleLanguage}
        onOpenWidgetModal={() => setIsWidgetModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
      />

      {/* メインコンテンツ（スマホでもPCでも最適幅） */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 relative z-10">
        {/* ① タバコ代案（ワンタップ起動可能・レスポンシブ改善済み） */}
        <ReplacementBanner
          language={currentLang}
          onSuccess={(msg) => showToast(msg)}
        />

        {/* ② メイン達成カウンター＆相棒全肯定メッセージ */}
        <MainCounter
          profile={profile}
          totalSmokedSinceStart={totalSmokedCount}
        />

        {/* ③ 恋人記念日アニバーサリーカード */}
        <AnniversaryCard profile={profile} />

        {/* ④ 本数記録 ＆ アホみたいに全肯定 ＆ 救済シェルター連動 */}
        <PraiseRecorder
          todaySmoked={todaySmoked}
          onSaveLog={handleSaveSmokingLog}
          partnerName={profile.partnerName}
          partnerTone={profile.partnerTone}
          onOpenShelter={() => setIsShelterModalOpen(true)}
        />

        {/* ⑤ タバコ代「これ買えたのに」換算 ＆ 浮いたご褒美 */}
        <PriceEquivalentCard
          profile={profile}
          totalSmokedCount={totalSmokedCount}
          totalSavedCount={totalSavedCount}
        />
      </main>

      {/* フッター */}
      <footer className="mt-12 sm:mt-16 bg-[#031109] border-t border-[#113a23] py-6 sm:py-8 text-center text-xs font-semibold text-[#6ee7b7] relative z-10 px-4">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Heart className="w-4 h-4 text-[#10b981] fill-[#10b981]" />
          <span className="text-[#a7f3d0]">
            {currentLang === 'en'
              ? 'Towards fresh, clean air — Sui-Sui (Quit Smoking Companion)'
              : '煙のない綺麗な空気へ — すいすい（息抜き相棒）'}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2 text-[11px] text-[#2b724b]">
          <button
            onClick={() => setShowOnboarding(true)}
            className="underline hover:text-[#a7f3d0] transition cursor-pointer"
          >
            {currentLang === 'en' ? 'Retake Medical Chart Survey' : '禁煙カルテ・アンケートを再回答'}
          </button>
          <span>•</span>
          <button
            onClick={() => setIsPremiumModalOpen(true)}
            className="hover:text-[#a3e635] transition cursor-pointer"
          >
            {currentLang === 'en' ? 'Google Sign-In & Premium' : 'Googleログイン・プレミアム'}
          </button>
          <span>•</span>
          <span>{currentLang === 'en' ? 'Mobile & PC Fully Responsive' : 'スマホ・PC両対応'}</span>
        </div>
      </footer>

      {/* トースト通知 */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-gradient-to-r from-[#10b981] to-[#059669] text-[#04140d] px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce font-black text-xs border border-[#34d399]">
          <Sparkles className="w-4 h-4 text-[#04140d] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ウィジェット設定モーダル */}
      {isWidgetModalOpen && (
        <LockScreenWidgetModal
          profile={profile}
          onClose={() => setIsWidgetModalOpen(false)}
        />
      )}

      {/* プロファイル設定モーダル */}
      {isProfileModalOpen && (
        <LoginProfileModal
          profile={profile}
          onSave={handleUpdateProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* 救済レスキューシェルター */}
      {isShelterModalOpen && (
        <RescueShelterModal
          profile={profile}
          todaySmoked={todaySmoked}
          onRecordRelapse={handleSaveSmokingLog}
          onClose={() => setIsShelterModalOpen(false)}
        />
      )}

      {/* Googleログイン ＆ 課金プレミアムモーダル */}
      {isPremiumModalOpen && (
        <GoogleAuthAndPremiumModal
          profile={profile}
          language={currentLang}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setIsPremiumModalOpen(false)}
        />
      )}
    </div>
  );
}
