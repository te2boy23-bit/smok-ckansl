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
        colors: ['#22c55e', '#4ade80', '#86efac', '#10b981', '#34d399'],
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
    const props = { className: 'w-6 h-6 text-[#047857]' };
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
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-2 border-[#4ade80] shadow-lg shadow-[#22c55e]/15 p-5 sm:p-6 transition-all">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4ade80]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#86efac]/30 rounded-full blur-2xl pointer-events-none" />

        {/* 上部ステータスバッジ */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a7f3d0] border border-[#34d399] text-[11px] font-black text-[#065f46] tracking-wide shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#059669] animate-pulse" />
            <span>{t.sosTitle}</span>
          </div>

          {savedCount > 0 && (
            <span className="text-xs font-black px-3 py-1 rounded-full bg-[#86efac] border border-[#22c55e] text-[#022c22]">
              ⚡ {t.sosSuccessCount}{savedCount}{t.sosTimes}
            </span>
          )}
        </div>

        {/* メインコンテンツ */}
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1 transition-all duration-150 ${isAnimating ? 'opacity-40 scale-98' : 'opacity-100 scale-100'}`}>
          {/* 左側：アイコン ＆ タイトル ＆ 説明 */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            <div className="w-13 h-13 rounded-2xl bg-[#a7f3d0] border-2 border-[#34d399] flex items-center justify-center shrink-0 shadow-inner">
              {getIcon(idea.iconName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#022c22] tracking-tight leading-snug">
                  {idea.title}
                </h3>
                <span className="text-[10px] text-[#065f46] bg-[#a7f3d0] px-2 py-0.5 rounded-full border border-[#4ade80] font-black shrink-0">
                  {t.approx}{idea.durationSeconds || 30}{t.seconds}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#064e3b] font-bold mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {idea.description}
              </p>
            </div>
          </div>

          {/* 右側：ボタングループ */}
          <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#86efac] w-full lg:w-auto justify-end flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleNext}
              className="shrink-0 whitespace-nowrap min-w-fit flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-black text-[#022c22] bg-[#bbf7d0] hover:bg-[#86efac] active:scale-95 rounded-2xl border border-[#4ade80] transition cursor-pointer shadow-sm focus:outline-none"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#059669]" />
              <span>{t.nextIdea}</span>
            </button>

            <button
              type="button"
              onClick={handleStartPractice}
              className="shrink-0 whitespace-nowrap min-w-fit flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-black text-[#022c22] bg-[#a7f3d0] hover:bg-[#86efac] rounded-2xl border border-[#34d399] transition cursor-pointer shadow-sm focus:outline-none"
            >
              <Play className="w-3.5 h-3.5 text-[#059669]" />
              <span>{t.startNow}</span>
            </button>

            <button
              type="button"
              onClick={handleSuccess}
              className="flex-1 sm:flex-none shrink-0 whitespace-nowrap min-w-fit flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black text-[#dcfce7] bg-gradient-to-r from-[#16a34a] to-[#22c55e] hover:brightness-110 active:scale-95 rounded-2xl shadow-md transition cursor-pointer focus:outline-none"
            >
              <CheckCircle2 className="w-4 h-4 text-[#dcfce7]" />
              <span>{t.managedIt}</span>
            </button>
          </div>
        </div>
      </div>

      {/* インタラクティブ代案タイマーモーダル */}
      {isTimerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022c22]/70 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-3 border-[#22c55e] w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setIsTimerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#047857] hover:bg-[#a7f3d0] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-4xl block mb-2">🌿</span>
            <h4 className="font-black text-base text-[#022c22] mb-1">{idea.title}</h4>
            <p className="text-xs text-[#065f46] font-bold mb-6">{idea.description}</p>

            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#4ade80] to-[#22c55e] opacity-40 transition-transform duration-1000 ${
                  breathPhase === 'inhale' ? 'scale-110' : 'scale-90'
                }`}
              />
              <div className="relative z-10 text-center">
                <span className="text-4xl font-black text-[#15803d] block">{timerSeconds}</span>
                <span className="text-[11px] font-black text-[#022c22]">
                  {breathPhase === 'inhale' ? t.inhaleText : t.exhaleText}
                </span>
              </div>
            </div>

            <button
              onClick={handleSuccess}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-[#dcfce7] font-black text-xs transition cursor-pointer shadow-lg focus:outline-none"
            >
              {t.finishBreath}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
