'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { PARTNER_TONE_MESSAGES } from '@/lib/constants';
import { Sparkles, TrendingUp, Coins, Activity, Flame, Heart } from 'lucide-react';

interface MainCounterProps {
  profile: UserProfile;
  totalSmokedSinceStart: number;
}

export function MainCounter({ profile, totalSmokedSinceStart }: MainCounterProps) {
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  useEffect(() => {
    const updateElapsed = () => {
      const start = new Date(profile.startDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ days, hours, minutes, seconds, totalSeconds });
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [profile.startDate]);

  const pricePerCig = profile.pricePerPack / profile.cigarettesPerPack;
  const totalDays = elapsed.totalSeconds / 86400;
  const expectedCigarettes = Math.floor(totalDays * profile.dailyCigarettesBefore);
  const savedCigarettes = Math.max(0, expectedCigarettes - totalSmokedSinceStart);
  const savedMoney = Math.floor(savedCigarettes * pricePerCig);
  const healthPercent = Math.min(100, Math.floor((elapsed.totalSeconds / (30 * 86400)) * 100));

  const tone = profile.partnerTone || 'deredere';
  const greetings = PARTNER_TONE_MESSAGES[tone]?.homeGreeting || PARTNER_TONE_MESSAGES.deredere.homeGreeting;
  const greeting = greetings[elapsed.days % greetings.length];

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#0c3823] via-[#082919] to-[#051c11] border-2 border-[#195c3a] p-6 sm:p-8 shadow-2xl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 相棒「すいすい」の全肯定応援メッセージ吹き出し */}
      <div className="bg-[#0b3320] border border-[#207248] rounded-2xl p-4 mb-6 shadow-md flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#84cc16] flex items-center justify-center text-xl shrink-0">
          🌱
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-[#86efac] flex items-center gap-1">
            <Heart className="w-3 h-3 fill-[#34d399] text-[#34d399]" />
            相棒「{profile.partnerName}」の全肯定メッセージ
          </span>
          <p className="text-xs sm:text-sm font-black text-[#ecfdf5] mt-0.5 truncate sm:whitespace-normal">
            「{greeting}」
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d4027] border border-[#217349] text-xs font-black text-[#a3e635] shadow-md shadow-[#059669]/20">
          <Flame className="w-4 h-4 text-[#a3e635] fill-[#a3e635]" />
          <span>煙ゼロストリーク継続中！</span>
        </div>

        <span className="text-xs font-bold text-[#6ee7b7] tracking-wider uppercase mt-4">
          タバコをやめて
        </span>

        <div className="flex items-baseline justify-center gap-2 my-1">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#ecfdf5] via-[#a7f3d0] to-[#34d399] drop-shadow-sm">
            {elapsed.days}
          </span>
          <span className="text-2xl sm:text-4xl font-extrabold text-[#34d399]">
            日目
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#062013]/90 border border-[#174e30] text-xs sm:text-sm font-bold text-[#ecfdf5] shadow-inner mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[#a3e635]">{elapsed.hours}</span>
            <span className="text-[11px] text-[#6ee7b7]">時間</span>
          </div>
          <span className="text-[#1e5434]">•</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[#a3e635]">{elapsed.minutes}</span>
            <span className="text-[11px] text-[#6ee7b7]">分</span>
          </div>
          <span className="text-[#1e5434]">•</span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-base sm:text-lg font-black text-[#10b981]">{elapsed.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[11px] text-[#6ee7b7]">秒</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-6 border-t border-[#14472c] relative z-10">
        <div className="bg-[#0b2f1d]/90 border border-[#195636] hover:border-[#10b981]/50 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6ee7b7]">累計節約タバコ代</span>
            <div className="p-1.5 bg-[#0f3d26] rounded-xl text-[#a3e635]">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ecfdf5] tracking-tight">
            ¥{savedMoney.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-[#34d399] mt-1">
            自由なお金が増加中💰
          </div>
        </div>

        <div className="bg-[#0b2f1d]/90 border border-[#195636] hover:border-[#10b981]/50 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6ee7b7]">我慢できたタバコ</span>
            <div className="p-1.5 bg-[#0f3d26] rounded-xl text-[#34d399]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ecfdf5] tracking-tight flex items-baseline gap-1">
            <span>{savedCigarettes}</span>
            <span className="text-xs font-bold text-[#6ee7b7]">本撃退</span>
          </div>
          <div className="text-[11px] font-semibold text-[#34d399] mt-1">
            煙を吸わなかった偉業✨
          </div>
        </div>

        <div className="bg-[#0b2f1d]/90 border border-[#195636] hover:border-[#10b981]/50 rounded-2xl p-4 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6ee7b7]">肺と細胞の回復</span>
            <div className="p-1.5 bg-[#0f3d26] rounded-xl text-[#10b981]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold text-[#a7f3d0]">クリーン化進捗</span>
              <span className="text-lg font-black text-[#a3e635]">{healthPercent}%</span>
            </div>
            <div className="w-full bg-[#051c11] h-2.5 rounded-full overflow-hidden border border-[#154b2e]">
              <div
                className="h-full bg-gradient-to-r from-[#059669] via-[#10b981] to-[#84cc16] rounded-full transition-all duration-700"
                style={{ width: `${Math.max(6, healthPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
