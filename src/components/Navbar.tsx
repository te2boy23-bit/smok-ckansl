'use client';

import React from 'react';
import { UserProfile, AppLanguage } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Smartphone, Settings, Heart, Globe, Sparkles } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  language: AppLanguage;
  onToggleLanguage: () => void;
  onOpenWidgetModal: () => void;
  onOpenProfileModal: () => void;
  onOpenPremiumModal: () => void;
}

export function Navbar({
  profile,
  language,
  onToggleLanguage,
  onOpenWidgetModal,
  onOpenProfileModal,
  onOpenPremiumModal,
}: NavbarProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ja;

  const toneLabel = {
    deredere: t.partnerToneDeredere,
    forest: t.partnerToneForest,
    passionate: t.partnerTonePassionate,
  }[profile.partnerTone || 'deredere'];

  const isGoogleConnected = !!profile.googleAccount;
  const isPremium = !!profile.isPremium;

  return (
    <header className="sticky top-0 z-40 bg-[#072417]/95 backdrop-blur-md border-b border-[#14472c] shadow-lg">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* 左側：ロゴ ＆ パートナー情報 */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#059669] via-[#10b981] to-[#84cc16] flex items-center justify-center text-[#04140d] text-base sm:text-lg font-black shadow-md shadow-[#059669]/40 border border-[#34d399]/40">
              🌱
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#84cc16] border-2 border-[#072417] rounded-full animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black tracking-tight text-[#ecfdf5]">
                {t.appName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#0d3f28] text-[#a3e635] border border-[#1b633b] truncate max-w-[120px] sm:max-w-none">
                {toneLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#a7f3d0] font-semibold truncate">
              <span className="truncate">{profile.name}</span>
              <Heart className="w-3 h-3 fill-[#10b981] text-[#10b981] shrink-0" />
              <span className="truncate">{t.companionOf}{profile.partnerName}</span>
            </div>
          </div>
        </div>

        {/* 右側：コントロールボタン群（スマホでもPCでも綺麗に収まる） */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 言語切り替えトグル */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] font-black text-[#a7f3d0] bg-[#0c3621] hover:bg-[#12492d] active:scale-95 rounded-xl border border-[#1c5d3a] transition cursor-pointer"
            title="Switch Language / 言語切り替え"
          >
            <Globe className="w-3.5 h-3.5 text-[#34d399]" />
            <span>{language === 'ja' ? 'EN' : 'JP'}</span>
          </button>

          {/* Google / プレミアムプランボタン */}
          <button
            onClick={onOpenPremiumModal}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] font-black rounded-xl border transition cursor-pointer ${
              isPremium
                ? 'bg-gradient-to-r from-[#059669] to-[#84cc16] text-[#04140d] border-[#34d399] shadow-md'
                : isGoogleConnected
                ? 'bg-[#0f4428] text-[#ecfdf5] border-[#22c55e]'
                : 'bg-[#0c3621] text-[#a7f3d0] border-[#1c5d3a] hover:bg-[#12492d]'
            }`}
            title="Google連携 ＆ プレミアムプラン"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
            <span className="hidden sm:inline">
              {isPremium ? t.premiumBadge : isGoogleConnected ? t.googleConnected : t.goPremium}
            </span>
            <span className="sm:hidden">
              {isPremium ? 'PRO' : 'G'}
            </span>
          </button>

          {/* ウィジェットボタン */}
          <button
            onClick={onOpenWidgetModal}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-[#ecfdf5] bg-[#0c3621] hover:bg-[#12492d] active:scale-95 transition-all rounded-xl border border-[#1c5d3a] cursor-pointer"
            title={t.widgetBtn}
          >
            <Smartphone className="w-4 h-4 text-[#34d399]" />
            <span className="hidden md:inline">{t.widgetBtn}</span>
          </button>

          {/* 設定ボタン */}
          <button
            onClick={onOpenProfileModal}
            className="p-1.5 sm:p-2 text-[#a7f3d0] bg-[#0c3621] hover:bg-[#12492d] hover:text-[#ecfdf5] active:scale-95 transition-all rounded-xl border border-[#1c5d3a] cursor-pointer"
            title={t.settingsBtn}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
