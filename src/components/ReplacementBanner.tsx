'use client';

import React, { useState } from 'react';
import { REPLACEMENT_IDEAS } from '@/lib/constants';
import { Droplet, Wind, Sparkles, Activity, Smile, Music, ShieldCheck, RefreshCw, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReplacementBannerProps {
  onSuccess: (message: string) => void;
}

export function ReplacementBanner({ onSuccess }: ReplacementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const idea = REPLACEMENT_IDEAS[currentIndex];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % REPLACEMENT_IDEAS.length);
      setIsAnimating(false);
    }, 150);
  };

  const handleSuccess = () => {
    setSavedCount((prev) => prev + 1);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.25 },
      colors: ['#10b981', '#34d399', '#84cc16', '#a3e635', '#6ee7b7'],
    });
    onSuccess(`「${idea.title}」でタバコ欲求を撃破！さすが！！`);
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123824] via-[#0f2e1e] to-[#0a2317] border-2 border-[#1f5939] shadow-xl p-5 sm:p-6 transition-all">
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#84cc16]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b4b31] border border-[#2d734c] text-[11px] font-black text-[#a3e635] tracking-wide shadow-sm">
          <Zap className="w-3.5 h-3.5 text-[#a3e635] animate-pulse" />
          <span>吸いたくなったら即実践！レスキュー代案</span>
        </div>

        {savedCount > 0 && (
          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#059669]/40 border border-[#10b981] text-[#a7f3d0]">
            ⚡ 撃退成功: {savedCount}回
          </span>
        )}
      </div>

      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 transition-all duration-150 ${isAnimating ? 'opacity-40 scale-98' : 'opacity-100 scale-100'}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#18462f] border-2 border-[#2b724b] flex items-center justify-center shrink-0 shadow-inner">
            {getIcon(idea.iconName)}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#ecfdf5] tracking-tight leading-snug">
              {idea.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#a7f3d0] font-medium mt-1 leading-relaxed max-w-lg">
              {idea.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1b4b31]">
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-[#a7f3d0] bg-[#143825] hover:bg-[#1a462f] active:scale-95 rounded-2xl border border-[#27613f] transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#34d399]" />
            <span>別の代案</span>
          </button>

          <button
            onClick={handleSuccess}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black text-[#071c12] bg-gradient-to-r from-[#10b981] to-[#a3e635] hover:brightness-110 active:scale-95 rounded-2xl shadow-lg shadow-[#10b981]/25 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-[#071c12]" />
            <span>これで乗り切った！</span>
          </button>
        </div>
      </div>
    </div>
  );
}
