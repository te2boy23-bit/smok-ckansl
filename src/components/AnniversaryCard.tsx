'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { MILESTONES } from '@/lib/constants';
import { Heart, Sparkles, X } from 'lucide-react';

interface AnniversaryCardProps {
  profile: UserProfile;
}

export function AnniversaryCard({ profile }: AnniversaryCardProps) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number | null>(null);

  const start = new Date(profile.startDate).getTime();
  const now = Date.now();
  const currentDays = Math.floor(Math.max(0, now - start) / (1000 * 60 * 60 * 24));

  const nextMilestone = MILESTONES.find((m) => m.days > currentDays) || MILESTONES[MILESTONES.length - 1];
  const daysUntilNext = Math.max(0, nextMilestone.days - currentDays);

  const achievedMilestones = MILESTONES.filter((m) => m.days <= currentDays);
  const latestAchieved = achievedMilestones[achievedMilestones.length - 1];

  const prevDays = latestAchieved ? latestAchieved.days : 0;
  const progressRatio = nextMilestone.days === prevDays 
    ? 100 
    : Math.min(100, Math.max(0, ((currentDays - prevDays) / (nextMilestone.days - prevDays)) * 100));

  const activeModalMilestone = selectedMilestoneIndex !== null ? MILESTONES[selectedMilestoneIndex] : null;

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-2 border-[#4ade80] p-6 sm:p-7 shadow-xl shadow-[#22c55e]/15">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#86efac]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22c55e] to-[#4ade80] flex items-center justify-center text-[#dcfce7] shadow-md shadow-[#22c55e]/30 border-2 border-[#86efac] shrink-0">
            <Heart className="w-6 h-6 fill-[#dcfce7] text-[#dcfce7] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#a7f3d0] text-[#065f46] border border-[#34d399]">
                二人の記念日
              </span>
              <span className="text-xs text-[#064e3b] font-bold">
                from {profile.partnerName}♡
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#022c22] mt-1 tracking-tight">
              禁煙 {currentDays}日目記念日♡
            </h3>
          </div>
        </div>

        <div className="bg-[#e8fdf0] border border-[#4ade80] rounded-2xl px-5 py-3 text-center sm:text-right shadow-sm">
          <span className="text-[11px] font-bold text-[#047857] block">次の大事な記念日まで</span>
          <div className="text-xl sm:text-2xl font-black text-[#022c22] flex items-baseline justify-center sm:justify-end gap-1.5 mt-0.5">
            <span className="text-xs text-[#064e3b]">あと</span>
            <span className="text-3xl sm:text-4xl font-black text-[#15803d] tracking-tight">
              {daysUntilNext}
            </span>
            <span className="text-xs text-[#064e3b]">日！</span>
          </div>
        </div>
      </div>

      {/* 恋人からのメッセージ */}
      <div className="mt-5 p-4 rounded-2xl bg-[#e8fdf0] border border-[#34d399] relative shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-black text-[#065f46] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
            {profile.partnerName}からの愛のメッセージ
          </span>
          <span className="text-[10px] text-[#047857] font-bold">（{nextMilestone.title}）</span>
        </div>
        <p className="text-xs sm:text-sm font-black text-[#022c22] leading-relaxed italic">
          「{nextMilestone.loveMessage}」
        </p>
      </div>

      {/* プログレスバー */}
      <div className="mt-5">
        <div className="flex justify-between items-center text-xs font-bold mb-1.5">
          <span className="text-[#064e3b]">{latestAchieved ? latestAchieved.title : 'スタート'}</span>
          <span className="text-[#15803d] font-black">{nextMilestone.title}</span>
        </div>
        <div className="w-full h-3.5 bg-[#bbf7d0] rounded-full overflow-hidden p-0.5 border border-[#4ade80]">
          <div
            className="h-full bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#86efac] rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, progressRatio)}%` }}
          />
        </div>
      </div>

      {/* マイルストーンリスト */}
      <div className="mt-6 pt-5 border-t-2 border-[#86efac]">
        <span className="text-xs font-black text-[#065f46] block mb-3">
          恋人の記念日バッジ一覧（タップで詳細）
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MILESTONES.map((m, idx) => {
            const isAchieved = m.days <= currentDays;
            return (
              <button
                key={m.days}
                type="button"
                onClick={() => setSelectedMilestoneIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isAchieved
                    ? 'bg-[#e8fdf0] border-[#22c55e] text-[#022c22] shadow-sm'
                    : 'bg-[#cbf7d8] border-[#86efac] text-[#047857] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{m.badge}</span>
                  {isAchieved ? (
                    <span className="text-[10px] font-black text-[#065f46] bg-[#a7f3d0] px-2 py-0.5 rounded-full border border-[#34d399]">
                      達成♡
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#047857] font-bold">あと{m.days - currentDays}日</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-black block truncate text-[#022c22]">{m.title}</span>
                  <span className="text-[10px] text-[#047857] font-bold">{m.days}日記念</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 詳細モーダル */}
      {activeModalMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022c22]/70 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-3 border-[#22c55e] w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setSelectedMilestoneIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#047857] hover:bg-[#a7f3d0]"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-4xl block mb-2">{activeModalMilestone.badge}</span>
            <h4 className="font-black text-base text-[#022c22] mb-1">{activeModalMilestone.title}</h4>
            <span className="text-xs font-black text-[#15803d] mb-4 block">
              {activeModalMilestone.days <= currentDays ? '達成済み♡' : `あと${activeModalMilestone.days - currentDays}日で解禁！`}
            </span>
            <div className="bg-[#e8fdf0] p-4 rounded-2xl border border-[#34d399] text-left text-xs mb-4 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-[#047857] block">恋人からの言葉</span>
                <p className="font-black text-[#022c22] mt-0.5">「{activeModalMilestone.loveMessage}」</p>
              </div>
              <div className="pt-2 border-t border-[#86efac]">
                <span className="text-[10px] font-bold text-[#065f46] block">体と肺へのご褒美変化</span>
                <p className="text-[#047857] font-semibold mt-0.5">{activeModalMilestone.bodyBenefit}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMilestoneIndex(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-[#dcfce7] font-black text-xs"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
