'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { Sparkles, TrendingUp, Coins, Activity, Flame } from 'lucide-react';

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

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#133d26] via-[#0d2c1c] to-[#081e13] border-2 border-[#1f5e39] p-6 sm:p-8 shadow-2xl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c4d32] border border-[#34d399]/40 text-xs font-black text-[#a3e635] shadow-md shadow-[#059669]/20">
          <Flame className="w-4 h-4 text-[#a3e635] fill-[#a3e635]" />
          <span>禁煙ストリーク継続中！</span>
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

        <div className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#0a2317]/80 border border-[#1e5434] text-xs sm:text-sm font-bold text-[#ecfdf5] shadow-inner mt-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-6 border-t border-[#1b4b31] relative z-10">
        <div className="bg-[#103320]/80 border border-[#1f5636] hover:border-[#10b981]/50 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6ee7b7]">浮いたお小遣い</span>
            <div className="p-1.5 bg-[#17462b] rounded-xl text-[#a3e635]">
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

        <div className="bg-[#103320]/80 border border-[#1f5636] hover:border-[#10b981]/50 rounded-2xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6ee7b7]">我慢できたタバコ</span>
            <div className="p-1.5 bg-[#17462b] rounded-xl text-[#34d399]">
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

        <div className="bg-[#103320]/80 border border-[#1f5636] hover:border-[#10b981]/50 rounded-2xl p-4 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6ee7b7]">肺と細胞の回復</span>
            <div className="p-1.5 bg-[#17462b] rounded-xl text-[#10b981]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold text-[#a7f3d0]">クリーン化進捗</span>
              <span className="text-lg font-black text-[#a3e635]">{healthPercent}%</span>
            </div>
            <div className="w-full bg-[#0a2317] h-2.5 rounded-full overflow-hidden border border-[#1b4b31]">
              <div
                className="h-full bg-gradient-to-r from-[#059669] via-[#10b981] to-[#a3e635] rounded-full transition-all duration-700"
                style={{ width: `${Math.max(6, healthPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
