'use client';

import React from 'react';
import { UserProfile, AppLanguage } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Smartphone, Settings, Heart, Globe, Sparkles } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  language?: AppLanguage;
  onToggleLanguage?: () => void;
  onOpenWidgetModal: () => void;
  onOpenProfileModal: () => void;
  onOpenPremiumModal?: () => void;
}

export function Navbar({
  profile,
  language = 'ja',
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
    <header className="sticky top-0 z-40 bg-[#dcfce7]/95 backdrop-blur-md border-b-2 border-[#86efac] shadow-md shadow-[#4ade80]/15">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* 左側：ロゴ画像 ＆ アプリ名・相棒 */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src="/logo.png?v=2"
              alt="すいすいロゴ"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-md shadow-[#22c55e]/25 border-2 border-[#4ade80]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#22c55e] border-2 border-[#dcfce7] rounded-full animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#022c22]">
                {t.appName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#bbf7d0] text-[#065f46] border border-[#4ade80] truncate max-w-[130px] sm:max-w-none">
                {toneLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#065f46] font-bold truncate">
              <span className="truncate">{profile.name}</span>
              <Heart className="w-3 h-3 fill-[#22c55e] text-[#22c55e] shrink-0" />
              <span className="truncate">{t.companionOf}{profile.partnerName}</span>
            </div>
          </div>
        </div>

        {/* 右側：コントロールボタン群 */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 言語切り替えトグル */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] font-black text-[#022c22] bg-[#bbf7d0] hover:bg-[#86efac] active:scale-95 rounded-xl border border-[#4ade80] transition cursor-pointer shadow-sm"
              title="言語切り替え / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#059669]" />
              <span>{language === 'ja' ? 'EN' : 'JP'}</span>
            </button>
          )}

          {/* Google / プレミアムプランボタン */}
          {onOpenPremiumModal && (
            <button
              onClick={onOpenPremiumModal}
              className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] font-black rounded-xl border transition cursor-pointer shadow-sm ${
                isPremium
                  ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#022c22] border-[#16a34a]'
                  : isGoogleConnected
                  ? 'bg-[#a7f3d0] text-[#022c22] border-[#22c55e]'
                  : 'bg-[#bbf7d0] text-[#064e3b] border-[#4ade80] hover:bg-[#86efac]'
              }`}
              title="Google連携 ＆ プレミアムプラン"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">
                {isPremium ? t.premiumBadge : isGoogleConnected ? t.googleConnected : t.goPremium}
              </span>
              <span className="sm:hidden">
                {isPremium ? 'PRO' : 'G'}
              </span>
            </button>
          )}

          {/* ウィジェットボタン */}
          <button
            onClick={onOpenWidgetModal}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-[#022c22] bg-[#bbf7d0] hover:bg-[#86efac] active:scale-95 transition-all rounded-xl border border-[#4ade80] cursor-pointer shadow-sm"
            title={t.widgetBtn}
          >
            <Smartphone className="w-4 h-4 text-[#059669]" />
            <span className="hidden md:inline">{t.widgetBtn}</span>
          </button>

          {/* 設定ボタン */}
          <button
            onClick={onOpenProfileModal}
            className="p-1.5 sm:p-2 text-[#022c22] bg-[#bbf7d0] hover:bg-[#86efac] active:scale-95 transition-all rounded-xl border border-[#4ade80] cursor-pointer shadow-sm"
            title={t.settingsBtn}
          >
            <Settings className="w-4 h-4 text-[#059669]" />
          </button>
        </div>
      </div>
    </header>
  );
}
