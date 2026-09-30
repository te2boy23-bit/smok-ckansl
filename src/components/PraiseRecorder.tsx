'use client';

import React, { useState } from 'react';
import { PRAISE_MESSAGES } from '@/lib/constants';
import { Sparkles, Plus, Minus, Flame, HeartHandshake, PartyPopper, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PraiseRecorderProps {
  todaySmoked: number;
  onSaveLog: (count: number) => void;
  partnerName: string;
}

export function PraiseRecorder({ todaySmoked, onSaveLog, partnerName }: PraiseRecorderProps) {
  const [count, setCount] = useState<number>(todaySmoked);
  const [showPraiseModal, setShowPraiseModal] = useState<boolean>(false);
  const [currentPraiseText, setCurrentPraiseText] = useState<string>('');
  const [praiseCategory, setPraiseCategory] = useState<'zero' | 'small' | 'more'>('zero');

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#10b981', '#34d399', '#84cc16', '#a3e635', '#6ee7b7', '#059669'],
    });
  };

  const handlePraise = (targetCount: number) => {
    let cat: 'zero' | 'small' | 'more' = 'zero';
    if (targetCount === 0) {
      cat = 'zero';
    } else if (targetCount <= 3) {
      cat = 'small';
    } else {
      cat = 'more';
    }

    setPraiseCategory(cat);
    const messages = PRAISE_MESSAGES[cat];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setCurrentPraiseText(randomMsg);
    setShowPraiseModal(true);
    triggerConfetti();

    onSaveLog(targetCount);
  };

  const handleMorePraise = () => {
    const messages = PRAISE_MESSAGES[praiseCategory];
    let nextMsg = messages[Math.floor(Math.random() * messages.length)];
    if (messages.length > 1) {
      while (nextMsg === currentPraiseText) {
        nextMsg = messages[Math.floor(Math.random() * messages.length)];
      }
    }
    setCurrentPraiseText(nextMsg);
    triggerConfetti();
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#123824] via-[#0d2a1b] to-[#081e13] border-2 border-[#1d5937] p-6 sm:p-7 shadow-2xl">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1b4b31]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#18462f] border border-[#2b7149] flex items-center justify-center text-[#a3e635]">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#ecfdf5]">
              今日の本数を記録 ＆ アホみたいに激褒め！
            </h3>
            <p className="text-xs text-[#a7f3d0] font-medium">
              0本は神！もし吸っちゃっても全肯定であなたを褒めちぎります！
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-[#0a2317]/90 border border-[#1f5636] rounded-2xl p-5 shadow-inner">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount((prev) => Math.max(0, prev - 1))}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#143d28] hover:bg-[#1a4e33] active:scale-90 text-[#a7f3d0] font-black transition border border-[#276842]"
            title="1本減らす"
          >
            <Minus className="w-6 h-6" />
          </button>

          <div className="text-center min-w-[100px]">
            <div className="text-4xl sm:text-5xl font-black text-[#ecfdf5] tracking-tight">
              {count}
            </div>
            <div className="text-xs font-bold text-[#6ee7b7] mt-0.5">
              本吸ってしまった
            </div>
          </div>

          <button
            onClick={() => setCount((prev) => prev + 1)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#143d28] hover:bg-[#1a4e33] active:scale-90 text-[#a7f3d0] font-black transition border border-[#276842]"
            title="1本増やす"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setCount(0);
              handlePraise(0);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#10b981] to-[#a3e635] text-[#071c12] font-black text-sm rounded-2xl shadow-lg shadow-[#10b981]/25 hover:brightness-110 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-[#071c12]" />
            <span>今日は奇跡の0本！！</span>
          </button>

          <button
            onClick={() => handlePraise(count)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-[#18462f] hover:bg-[#20583b] text-[#ecfdf5] font-black text-sm rounded-2xl border border-[#2c754d] active:scale-95 transition"
          >
            <Trophy className="w-4 h-4 text-[#a3e635]" />
            <span>記録して褒めてもらう！</span>
          </button>
        </div>
      </div>

      {showPraiseModal && (
        <div className="fixed inset-0 bg-[#04130b]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-[#133d26] via-[#0d2a1b] to-[#071d12] border-3 border-[#34d399] rounded-[36px] p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#a3e635]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#10b981]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex p-4 rounded-3xl bg-[#1c4d32] border-2 border-[#34d399] mb-4 text-[#a3e635] shadow-lg shadow-[#059669]/30">
              {praiseCategory === 'zero' ? (
                <Sparkles className="w-12 h-12 text-[#a3e635] animate-bounce" />
              ) : (
                <HeartHandshake className="w-12 h-12 text-[#34d399] animate-bounce" />
              )}
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-[#a3e635] mb-1">
              {partnerName} ＆ 全宇宙からの全力大称賛
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#ecfdf5] mb-4 tracking-tight">
              {praiseCategory === 'zero'
                ? '🎉 0本完全勝利！！神降臨！！ 🎉'
                : count <= 3
                ? '✨ 驚異の自制心！！偉すぎ！！ ✨'
                : '💖 記録した君が優勝！！ 💖'}
            </h2>

            <div className="bg-[#0a2317]/90 border-2 border-[#2b7149] rounded-2xl p-5 mb-5 shadow-inner">
              <p className="text-base sm:text-lg font-black text-[#ecfdf5] leading-relaxed">
                {currentPraiseText}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleMorePraise}
                className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-[#84cc16] to-[#a3e635] hover:brightness-110 active:scale-95 text-[#071c12] font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-[#071c12]" />
                <span>もっと浴びるほど褒めて！🔥</span>
              </button>

              <button
                onClick={() => setShowPraiseModal(false)}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#143a25] hover:bg-[#1a4a30] active:scale-95 text-[#ecfdf5] font-black text-sm rounded-2xl border border-[#26633e] transition"
              >
                満足した！ありがとう♡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
