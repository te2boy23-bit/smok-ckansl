'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { Smartphone, Settings, Heart, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  onOpenWidgetModal: () => void;
  onOpenProfileModal: () => void;
}

export function Navbar({ profile, onOpenWidgetModal, onOpenProfileModal }: NavbarProps) {
  const toneLabel = {
    deredere: 'デレデレ全肯定♡',
    forest: '癒やし系森林浴🌲',
    passionate: '体育会系熱血🔥',
  }[profile.partnerTone || 'deredere'];

  return (
    <header className="sticky top-0 z-40 bg-[#072417]/95 backdrop-blur-md border-b border-[#14472c] shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#059669] via-[#10b981] to-[#84cc16] flex items-center justify-center text-[#04140d] text-lg font-black shadow-md shadow-[#059669]/40 border border-[#34d399]/40">
              🌱
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#84cc16] border-2 border-[#072417] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-[#ecfdf5]">
                すいすい
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0d3f28] text-[#a3e635] border border-[#1b633b]">
                {toneLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#a7f3d0] font-semibold mt-0.5">
              <span>{profile.name}</span>
              <Heart className="w-3 h-3 fill-[#10b981] text-[#10b981]" />
              <span>相棒: {profile.partnerName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWidgetModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#ecfdf5] bg-[#0c3621] hover:bg-[#12492d] active:scale-95 transition-all rounded-xl border border-[#1c5d3a] shadow-sm hover:border-[#10b981] cursor-pointer"
            title="ウィジェット・ロック画面設定"
          >
            <Smartphone className="w-4 h-4 text-[#34d399]" />
            <span className="hidden sm:inline">ウィジェット</span>
          </button>

          <button
            onClick={onOpenProfileModal}
            className="p-2 text-[#a7f3d0] bg-[#0c3621] hover:bg-[#12492d] hover:text-[#ecfdf5] active:scale-95 transition-all rounded-xl border border-[#1c5d3a] cursor-pointer"
            title="設定・マイカルテ"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
