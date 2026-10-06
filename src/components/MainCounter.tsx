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
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-2 border-[#4ade80] p-6 sm:p-8 shadow-xl shadow-[#22c55e]/15">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#4ade80]/20 rounded-full blur-3xl pointer-events-none" />

      {/* 相棒「すいすい」の全肯定応援メッセージ吹き出し */}
      <div className="bg-[#e8fdf0] border-2 border-[#34d399] rounded-3xl p-4 mb-6 shadow-md flex items-center gap-3.5">
        <img
          src="/logo.png?v=2"
          alt="すいすい"
          className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-[#4ade80] shrink-0"
        />
        <div className="min-w-0">
          <span className="text-[11px] font-black text-[#047857] flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-[#10b981] text-[#10b981]" />
            相棒「{profile.partnerName}」の全肯定メッセージ
          </span>
          <p className="text-sm sm:text-base font-black text-[#022c22] mt-0.5 leading-snug">
            「{greeting}」
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a7f3d0] border border-[#34d399] text-xs font-black text-[#065f46] shadow-sm">
          <Flame className="w-4 h-4 text-[#059669] fill-[#059669]" />
          <span>煙ゼロストリーク継続中！</span>
        </div>

        <span className="text-xs font-black text-[#047857] tracking-wider uppercase mt-4">
          タバコをやめて
        </span>

        <div className="flex items-baseline justify-center gap-2 my-1">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#022c22] via-[#065f46] to-[#15803d] drop-shadow-sm">
            {elapsed.days}
          </span>
          <span className="text-2xl sm:text-4xl font-black text-[#15803d]">
            日目
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#e8fdf0] border border-[#4ade80] text-xs sm:text-sm font-black text-[#022c22] shadow-sm mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[#16a34a]">{elapsed.hours}</span>
            <span className="text-[11px] text-[#047857]">時間</span>
          </div>
          <span className="text-[#34d399]">•</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[#16a34a]">{elapsed.minutes}</span>
            <span className="text-[11px] text-[#047857]">分</span>
          </div>
          <span className="text-[#34d399]">•</span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-base sm:text-lg font-black text-[#059669]">{elapsed.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[11px] text-[#047857]">秒</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-6 border-t-2 border-[#86efac] relative z-10">
        <div className="bg-[#e8fdf0] border border-[#4ade80] hover:border-[#16a34a] rounded-2xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#047857]">累計節約タバコ代</span>
            <div className="p-1.5 bg-[#bbf7d0] rounded-xl text-[#059669]">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#022c22] tracking-tight">
            ¥{savedMoney.toLocaleString()}
          </div>
          <div className="text-[11px] font-bold text-[#15803d] mt-1">
            自由なお金が増加中💰
          </div>
        </div>

        <div className="bg-[#e8fdf0] border border-[#4ade80] hover:border-[#16a34a] rounded-2xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#047857]">我慢できたタバコ</span>
            <div className="p-1.5 bg-[#bbf7d0] rounded-xl text-[#059669]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#022c22] tracking-tight flex items-baseline gap-1">
            <span>{savedCigarettes}</span>
            <span className="text-xs font-black text-[#047857]">本撃退</span>
          </div>
          <div className="text-[11px] font-bold text-[#15803d] mt-1">
            煙を吸わなかった偉業✨
          </div>
        </div>

        <div className="bg-[#e8fdf0] border border-[#4ade80] hover:border-[#16a34a] rounded-2xl p-4 flex flex-col justify-between transition-all shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#047857]">肺と細胞の回復</span>
            <div className="p-1.5 bg-[#bbf7d0] rounded-xl text-[#059669]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold text-[#065f46]">クリーン化進捗</span>
              <span className="text-lg font-black text-[#15803d]">{healthPercent}%</span>
            </div>
            <div className="w-full bg-[#bbf7d0] h-3 rounded-full overflow-hidden border border-[#4ade80]">
              <div
                className="h-full bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#86efac] rounded-full transition-all duration-700"
                style={{ width: `${Math.max(6, healthPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
