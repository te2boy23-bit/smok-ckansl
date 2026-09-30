'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { MILESTONES } from '@/lib/constants';
import { Heart, Calendar, Award, Sparkles, X } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#113824] via-[#0d2a1b] to-[#081e13] border-2 border-[#1d5937] p-6 sm:p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1b4b31]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-[#ecfdf5] shadow-lg shadow-[#059669]/30 border border-[#34d399]/40 shrink-0">
            <Heart className="w-6 h-6 fill-[#a3e635] text-[#a3e635] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#18462d] text-[#a3e635] border border-[#2b7149]">
                恋人の記念日
              </span>
              <span className="text-xs text-[#a7f3d0] font-semibold">
                from {profile.partnerName}♡
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#ecfdf5] mt-1 tracking-tight">
              禁煙して {currentDays}日記念日♡
            </h3>
          </div>
        </div>

        <div className="bg-[#0b2417]/90 border border-[#215a39] rounded-2xl px-5 py-3 text-center sm:text-right shadow-inner">
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

      <div className="mt-5 bg-[#0e2c1c]/90 border border-[#1f5636] rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs font-bold text-[#a7f3d0] mb-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#34d399]" />
            次の目標: {nextMilestone.title} ({nextMilestone.days}日)
          </span>
          <span className="text-[#a3e635] font-black">{Math.round(progressRatio)}%</span>
        </div>
        <div className="w-full bg-[#071c12] h-3 rounded-full overflow-hidden border border-[#1b4b31]">
          <div
            className="h-full bg-gradient-to-r from-[#059669] via-[#10b981] to-[#a3e635] rounded-full transition-all duration-700"
            style={{ width: `${Math.max(6, progressRatio)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 bg-[#143a26]/90 border-2 border-[#24633e] rounded-2xl p-5 relative shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#1e5236] border-2 border-[#34d399] flex items-center justify-center text-lg shrink-0">
            💚
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#a3e635]">
                {profile.partnerName}からの愛のメッセージ♡
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0a2317] text-[#6ee7b7] border border-[#1d4d30]">
                {latestAchieved ? latestAchieved.title : 'スタート応援'}
              </span>
            </div>
            <p className="text-sm font-bold text-[#ecfdf5] mt-2 leading-relaxed italic">
              「{latestAchieved ? latestAchieved.loveMessage : '今日から禁煙スタートだね！あなたの健康な笑顔が私の宝物だよ♡ 無理せず一緒に頑張ろうね！'}」
            </p>
            {latestAchieved && (
              <div className="text-xs text-[#a7f3d0] font-medium mt-3 pt-2.5 border-t border-[#1e5236] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                <span>身体の回復: {latestAchieved.bodyBenefit}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-[#ecfdf5] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#a3e635]" />
            二人の記念日アルバム
          </span>
          <span className="text-xs font-bold text-[#6ee7b7]">
            達成: {achievedMilestones.length} / {MILESTONES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {MILESTONES.map((m, idx) => {
            const isAchieved = currentDays >= m.days;
            return (
              <button
                key={m.days}
                onClick={() => setSelectedMilestoneIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                  isAchieved
                    ? 'bg-[#18462f] border-[#2f7d52] shadow-md shadow-[#059669]/20 hover:border-[#10b981]'
                    : 'bg-[#0c2417] border-[#18462e] opacity-60 hover:opacity-90'
                }`}
              >
                <div className="text-2xl mb-1">{m.badge}</div>
                <div className="text-xs font-black text-[#ecfdf5] truncate">
                  {m.title}
                </div>
                <div className="text-[11px] font-bold text-[#a7f3d0] mt-0.5">
                  {isAchieved ? '達成記念♡' : `あと${m.days - currentDays}日`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeModalMilestone && (
        <div className="fixed inset-0 bg-[#04130b]/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#0e2c1c] border-2 border-[#2b724b] rounded-[32px] p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedMilestoneIndex(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#143a25] text-[#a7f3d0] hover:text-[#ecfdf5] border border-[#24603c]"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-5xl block mb-2">{activeModalMilestone.badge}</span>
            <h3 className="text-xl font-black text-[#ecfdf5]">
              {activeModalMilestone.title}
            </h3>
            <p className="text-xs font-bold text-[#a3e635] mt-1">
              禁煙 {activeModalMilestone.days}日達成のマイルストーン
            </p>

            <div className="mt-4 bg-[#143d28] border border-[#266841] rounded-2xl p-4 text-left shadow-inner">
              <div className="text-xs font-black text-[#a3e635] mb-1">
                {profile.partnerName}からの愛のメッセージ♡
              </div>
              <p className="text-sm font-bold text-[#ecfdf5] leading-relaxed italic">
                「{activeModalMilestone.loveMessage}」
              </p>
            </div>

            <div className="mt-3 bg-[#0a2317] border border-[#1b4b31] rounded-2xl p-3 text-xs text-[#a7f3d0] text-left">
              <span className="font-black text-[#34d399]">🌱 身体へのご褒美:</span> {activeModalMilestone.bodyBenefit}
            </div>

            <button
              onClick={() => setSelectedMilestoneIndex(null)}
              className="mt-5 w-full py-3.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 text-[#071c12] font-black rounded-2xl shadow-lg transition"
            >
              閉じる♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
