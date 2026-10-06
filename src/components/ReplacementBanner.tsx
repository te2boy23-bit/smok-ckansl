'use client';

import React, { useState, useEffect } from 'react';
import { AppLanguage } from '@/types';
import { REPLACEMENT_IDEAS } from '@/lib/constants';
import { TRANSLATIONS } from '@/lib/translations';
import { Droplet, Wind, Sparkles, Activity, Smile, Music, ShieldCheck, RefreshCw, CheckCircle2, Zap, Play, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReplacementBannerProps {
  language?: AppLanguage;
  onSuccess: (message: string) => void;
}

export function ReplacementBanner({ language = 'ja', onSuccess }: ReplacementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  const t = TRANSLATIONS[language] || TRANSLATIONS.ja;
  const idea = REPLACEMENT_IDEAS[currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerOpen && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleSuccess();
            setIsTimerOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerOpen, timerSeconds]);

  // 呼吸フェーズのトグル（3秒吸って7秒吐く）
  useEffect(() => {
    if (!isTimerOpen) return;
    const cycle = setInterval(() => {
      setBreathPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
    }, 4000);
    return () => clearInterval(cycle);
  }, [isTimerOpen]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % REPLACEMENT_IDEAS.length);
      setIsAnimating(false);
    }, 150);
  };

  const handleStartPractice = () => {
    setTimerSeconds(idea.durationSeconds || 30);
    setIsTimerOpen(true);
  };

  const handleSuccess = () => {
    setSavedCount((prev) => prev + 1);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.25 },
        colors: ['#059669', '#34d399', '#84cc16', '#a3e635', '#6ee7b7'],
      });
    } catch {
      // ignore
    }
    const cheer = language === 'en'
      ? `Crushed craving with "${idea.title}"! Way to go!!`
      : `「${idea.title}」でタバコ欲求を華麗に撃退！さすが相棒！！`;
    onSuccess(cheer);
  };

  const getIcon = (name: string) => {
    const props = { className: 'w-6 h-6 text-[#a3e635]' };
    switch (name) {
      case 'Droplet': return <Droplet {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'Music': return <Music {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0c3823] via-[#082819] to-[#051c11] border-2 border-[#195c3a] shadow-xl p-5 sm:p-6 transition-all">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#84cc16]/10 rounded-full blur-2xl pointer-events-none" />

        {/* 上部ステータスバッジ */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3f28] border border-[#207046] text-[11px] font-black text-[#a3e635] tracking-wide shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#a3e635] animate-pulse" />
            <span>{t.sosTitle}</span>
          </div>

          {savedCount > 0 && (
            <span className="text-xs font-black px-3 py-1 rounded-full bg-[#064e3b] border border-[#10b981] text-[#a7f3d0]">
              ⚡ {t.sosSuccessCount}{savedCount}{t.sosTimes}
            </span>
          )}
        </div>

        {/* メインコンテンツ */}
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1 transition-all duration-150 ${isAnimating ? 'opacity-40 scale-98' : 'opacity-100 scale-100'}`}>
          {/* 左側：アイコン ＆ タイトル ＆ 説明 */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            <div className="w-13 h-13 rounded-2xl bg-[#0f4428] border-2 border-[#206f45] flex items-center justify-center shrink-0 shadow-inner">
              {getIcon(idea.iconName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#ecfdf5] tracking-tight leading-snug">
                  {idea.title}
                </h3>
                <span className="text-[10px] text-[#a3e635] bg-[#072818] px-2 py-0.5 rounded-full border border-[#155030] font-bold shrink-0">
                  {t.approx}{idea.durationSeconds || 30}{t.seconds}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#a7f3d0] font-medium mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {idea.description}
              </p>
            </div>
          </div>

          {/* 右側：ボタングループ（絶対に縮小・変形させない shrink-0 & whitespace-nowrap） */}
          <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#154b2e] w-full lg:w-auto justify-end flex-wrap sm:flex-nowrap">
            {/* 別の代案ボタン */}
            <button
              type="button"
              onClick={handleNext}
              className="shrink-0 whitespace-nowrap min-w-fit flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-[#a7f3d0] bg-[#092c1c] hover:bg-[#0e3b26] active:scale-95 rounded-2xl border border-[#1a5a38] transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#34d399]" />
              <span>{t.nextIdea}</span>
            </button>

            {/* 今すぐ起動ボタン */}
            <button
              type="button"
              onClick={handleStartPractice}
              className="shrink-0 whitespace-nowrap min-w-fit flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-black text-[#ecfdf5] bg-[#0c4028] hover:bg-[#125334] rounded-2xl border border-[#217349] transition cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]"
            >
              <Play className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>{t.startNow}</span>
            </button>

            {/* 乗り切った！ボタン */}
            <button
              type="button"
              onClick={handleSuccess}
              className="flex-1 sm:flex-none shrink-0 whitespace-nowrap min-w-fit flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black text-[#04140d] bg-gradient-to-r from-[#059669] to-[#84cc16] hover:brightness-110 active:scale-95 rounded-2xl shadow-lg transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#04140d]" />
              <span>{t.managedIt}</span>
            </button>
          </div>
        </div>
      </div>

      {/* インタラクティブ代案タイマーモーダル */}
      {isTimerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04140d]/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#092c1d] to-[#04150e] border-2 border-[#165a38] w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setIsTimerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#86efac] hover:bg-[#0c3621] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-4xl block mb-2">🌿</span>
            <h4 className="font-black text-base text-[#ecfdf5] mb-1">{idea.title}</h4>
            <p className="text-xs text-[#86efac] mb-6">{idea.description}</p>

            {/* 呼吸サークルアニメーション */}
            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#059669] to-[#84cc16] opacity-30 transition-transform duration-1000 ${
                  breathPhase === 'inhale' ? 'scale-110' : 'scale-90'
                }`}
              />
              <div className="relative z-10 text-center">
                <span className="text-4xl font-black text-[#a3e635] block">{timerSeconds}</span>
                <span className="text-[11px] font-bold text-[#ecfdf5]">
                  {breathPhase === 'inhale' ? t.inhaleText : t.exhaleText}
                </span>
              </div>
            </div>

            <button
              onClick={handleSuccess}
              className="w-full py-3 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black text-xs transition cursor-pointer shadow-lg focus:outline-none"
            >
              {t.finishBreath}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
