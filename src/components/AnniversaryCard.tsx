'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { MILESTONES } from '@/lib/constants';
import { Heart, Award, Sparkles, X } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0c3823] via-[#082919] to-[#051c11] border-2 border-[#195c3a] p-6 sm:p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#14472c]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-[#ecfdf5] shadow-lg shadow-[#059669]/30 border border-[#34d399]/40 shrink-0">
            <Heart className="w-6 h-6 fill-[#a3e635] text-[#a3e635] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#0f4428] text-[#a3e635] border border-[#206f45]">
                二人の記念日
              </span>
              <span className="text-xs text-[#a7f3d0] font-semibold">
                from {profile.partnerName}♡
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#ecfdf5] mt-1 tracking-tight">
              禁煙 {currentDays}日目記念日♡
            </h3>
          </div>
        </div>

        <div className="bg-[#062013]/90 border border-[#174e30] rounded-2xl px-5 py-3 text-center sm:text-right shadow-inner">
          <span className="text-[11px] font-bold text-[#6ee7b7] block">次の大事な記念日まで</span>
          <div className="text-xl sm:text-2xl font-black text-[#ecfdf5] flex items-baseline justify-center sm:justify-end gap-1.5 mt-0.5">
            <span className="text-xs text-[#a7f3d0]">あと</span>
            <span className="text-3xl sm:text-4xl font-black text-[#a3e635] tracking-tight">
              {daysUntilNext}
            </span>
            <span className="text-xs text-[#a7f3d0]">日！</span>
          </div>
        </div>
      </div>

      {/* 恋人からのメッセージ */}
      <div className="mt-5 p-4 rounded-2xl bg-[#082b1b] border border-[#175432] relative">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-black text-[#34d399] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {profile.partnerName}からの愛のメッセージ
          </span>
          <span className="text-[10px] text-[#6ee7b7]">（{nextMilestone.title}）</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-[#ecfdf5] leading-relaxed italic">
          「{nextMilestone.loveMessage}」
        </p>
      </div>

      {/* プログレスバー */}
      <div className="mt-5">
        <div className="flex justify-between items-center text-xs font-bold mb-1.5">
          <span className="text-[#a7f3d0]">{latestAchieved ? latestAchieved.title : 'スタート'}</span>
          <span className="text-[#a3e635]">{nextMilestone.title}</span>
        </div>
        <div className="w-full h-3 bg-[#061f13] rounded-full overflow-hidden p-0.5 border border-[#14472c]">
          <div
            className="h-full bg-gradient-to-r from-[#059669] via-[#10b981] to-[#84cc16] rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, progressRatio)}%` }}
          />
        </div>
      </div>

      {/* マイルストーンリスト */}
      <div className="mt-6 pt-5 border-t border-[#14472c]">
        <span className="text-xs font-bold text-[#86efac] block mb-3">
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
                    ? 'bg-[#0e3b25] border-[#22c55e] text-[#ecfdf5] shadow-sm'
                    : 'bg-[#072417] border-[#14472c] text-[#6ee7b7] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{m.badge}</span>
                  {isAchieved ? (
                    <span className="text-[10px] font-black text-[#a3e635] bg-[#072517] px-2 py-0.5 rounded-full border border-[#185333]">
                      達成♡
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#6ee7b7]">あと{m.days - currentDays}日</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-black block truncate">{m.title}</span>
                  <span className="text-[10px] text-[#86efac]">{m.days}日記念</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 詳細モーダル */}
      {activeModalMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04140d]/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#0c3823] to-[#051c11] border-2 border-[#195c3a] w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setSelectedMilestoneIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#86efac] hover:bg-[#0c3621]"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-4xl block mb-2">{activeModalMilestone.badge}</span>
            <h4 className="font-black text-base text-[#ecfdf5] mb-1">{activeModalMilestone.title}</h4>
            <span className="text-xs font-bold text-[#a3e635] mb-4 block">
              {activeModalMilestone.days <= currentDays ? '達成済み♡' : `あと${activeModalMilestone.days - currentDays}日で解禁！`}
            </span>
            <div className="bg-[#062013] p-4 rounded-2xl border border-[#174e30] text-left text-xs mb-4 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-[#86efac] block">恋人からの言葉</span>
                <p className="font-semibold text-[#ecfdf5] mt-0.5">「{activeModalMilestone.loveMessage}」</p>
              </div>
              <div className="pt-2 border-t border-[#133e27]">
                <span className="text-[10px] font-bold text-[#34d399] block">体と肺へのご褒美変化</span>
                <p className="text-[#a7f3d0] mt-0.5">{activeModalMilestone.bodyBenefit}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMilestoneIndex(null)}
              className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black text-xs"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
