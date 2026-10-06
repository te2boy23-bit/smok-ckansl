'use client';

import React, { useState } from 'react';
import { PartnerTone } from '@/types';
import { PARTNER_TONE_MESSAGES } from '@/lib/constants';
import { Sparkles, Plus, Minus, Flame, HeartHandshake, PartyPopper, Trophy, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PraiseRecorderProps {
  todaySmoked: number;
  onSaveLog: (count: number) => void;
  partnerName: string;
  partnerTone?: PartnerTone;
  onOpenShelter: () => void;
}

export function PraiseRecorder({
  todaySmoked,
  onSaveLog,
  partnerName,
  partnerTone = 'deredere',
  onOpenShelter,
}: PraiseRecorderProps) {
  const [count, setCount] = useState<number>(todaySmoked);
  const [showPraiseModal, setShowPraiseModal] = useState<boolean>(false);
  const [currentPraiseText, setCurrentPraiseText] = useState<string>('');
  const [praiseCategory, setPraiseCategory] = useState<'zero' | 'small' | 'more'>('zero');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#22c55e', '#4ade80', '#86efac', '#15803d', '#a3e635'],
      });
    } catch {
      // ignore
    }
  };

  const toneMessages = PARTNER_TONE_MESSAGES[partnerTone] || PARTNER_TONE_MESSAGES.deredere;

  const handlePraise = (targetCount: number) => {
    let cat: 'zero' | 'small' | 'more' = 'zero';
    let messages: string[];

    if (targetCount === 0) {
      cat = 'zero';
      messages = toneMessages.zeroSmoked;
    } else {
      cat = 'small';
      messages = toneMessages.smallSmoked;
    }

    setPraiseCategory(cat);
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setCurrentPraiseText(randomMsg);
    setShowPraiseModal(true);
    triggerConfetti();

    onSaveLog(targetCount);
  };

  const handleMorePraise = () => {
    const messages = praiseCategory === 'zero' ? toneMessages.zeroSmoked : toneMessages.smallSmoked;
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
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-2 border-[#86efac] p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#86efac]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#bbf7d0] border border-[#86efac] flex items-center justify-center text-[#15803d] shrink-0 shadow-sm">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#022c22]">
              今日の本数を記録 ＆ アホみたいに全肯定！
            </h3>
            <p className="text-xs text-[#065f46] font-medium">
              0本は神！もし吸っちゃっても責めずにあなたを褒めちぎります！
            </p>
          </div>
        </div>

        <button
          onClick={onOpenShelter}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#bbf7d0] hover:bg-[#86efac] text-[#047857] rounded-xl text-xs font-black border border-[#86efac] transition cursor-pointer shrink-0"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>吸っちゃった時の救済</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-[#e8fdf0] border-2 border-[#86efac] rounded-2xl p-4 sm:p-5 shadow-inner">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount((prev) => Math.max(0, prev - 1))}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#bbf7d0] hover:bg-[#86efac] active:scale-90 text-[#022c22] font-black transition border border-[#86efac] cursor-pointer shadow-sm"
            title="1本減らす"
          >
            <Minus className="w-6 h-6" />
          </button>

          <div className="text-center min-w-[100px]">
            <div className="text-4xl sm:text-5xl font-black text-[#022c22] tracking-tight">
              {count}
            </div>
            <div className="text-xs font-bold text-[#065f46] mt-0.5">
              本吸ってしまった
            </div>
          </div>

          <button
            onClick={() => setCount((prev) => prev + 1)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#bbf7d0] hover:bg-[#86efac] active:scale-90 text-[#022c22] font-black transition border border-[#86efac] cursor-pointer shadow-sm"
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#022c22] font-black text-sm rounded-2xl shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer border border-[#86efac]"
          >
            <Sparkles className="w-4 h-4 text-[#022c22]" />
            <span>今日は奇跡の0本！！</span>
          </button>

          <button
            onClick={() => handlePraise(count)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-[#15803d] hover:bg-[#166534] text-[#dcfce7] font-black text-sm rounded-2xl border border-[#22c55e] active:scale-95 transition cursor-pointer shadow-md"
          >
            <Trophy className="w-4 h-4 text-[#86efac]" />
            <span>記録して褒めてもらう！</span>
          </button>
        </div>
      </div>

      {showPraiseModal && (
        <div className="fixed inset-0 bg-[#022c22]/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-2 border-[#4ade80] rounded-[36px] p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#4ade80]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#86efac]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex p-4 rounded-3xl bg-[#bbf7d0] border-2 border-[#4ade80] mb-4 text-[#15803d] shadow-md">
              {praiseCategory === 'zero' ? (
                <Sparkles className="w-12 h-12 text-[#15803d] animate-bounce" />
              ) : (
                <HeartHandshake className="w-12 h-12 text-[#15803d] animate-bounce" />
              )}
            </div>

            <div className="text-xs font-black uppercase tracking-widest text-[#065f46] mb-1">
              {partnerName} からの全力全肯定大称賛
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#022c22] mb-4 tracking-tight">
              {praiseCategory === 'zero'
                ? '🎉 0本完全勝利！！神降臨！！ 🎉'
                : '💖 正直に記録した君が一番偉い！！ 💖'}
            </h2>

            <div className="bg-[#e8fdf0] border-2 border-[#86efac] rounded-2xl p-5 mb-5 shadow-inner">
              <p className="text-base sm:text-lg font-black text-[#022c22] leading-relaxed">
                {currentPraiseText}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleMorePraise}
                className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-[#22c55e] to-[#4ade80] hover:brightness-105 active:scale-95 text-[#022c22] font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-[#86efac]"
              >
                <Flame className="w-4 h-4 text-[#022c22]" />
                <span>もっと浴びるほど褒めて！🔥</span>
              </button>

              <button
                onClick={() => setShowPraiseModal(false)}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#bbf7d0] hover:bg-[#86efac] active:scale-95 text-[#022c22] font-black text-sm rounded-2xl border border-[#86efac] transition cursor-pointer"
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
