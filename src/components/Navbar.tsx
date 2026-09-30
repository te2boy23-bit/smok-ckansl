'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { ShieldCheck, Smartphone, Settings, Heart } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  onOpenWidgetModal: () => void;
  onOpenProfileModal: () => void;
}

export function Navbar({ profile, onOpenWidgetModal, onOpenProfileModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a2317]/90 backdrop-blur-md border-b border-[#1b4b31] shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-[#ecfdf5] shadow-md shadow-[#059669]/40 border border-[#34d399]/40">
              <ShieldCheck className="w-6 h-6 text-[#ecfdf5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#84cc16] border-2 border-[#0a2317] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-[#ecfdf5]">
                Smok-Ckansl
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#143825] text-[#84cc16] border border-[#2d734c]">
                二人の約束♡
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#a7f3d0] font-semibold mt-0.5">
              <span>{profile.name}</span>
              <Heart className="w-3 h-3 fill-[#10b981] text-[#10b981]" />
              <span>{profile.partnerName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWidgetModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#ecfdf5] bg-[#143825] hover:bg-[#1a462f] active:scale-95 transition-all rounded-xl border border-[#265f3f] shadow-sm hover:border-[#10b981]"
            title="ガジェット・ロック画面表示モード"
          >
            <Smartphone className="w-4 h-4 text-[#34d399]" />
            <span className="hidden sm:inline">ロック画面風</span>
          </button>

          <button
            onClick={onOpenProfileModal}
            className="p-2 text-[#a7f3d0] bg-[#143825] hover:bg-[#1a462f] hover:text-[#ecfdf5] active:scale-95 transition-all rounded-xl border border-[#265f3f]"
            title="ユーザー設定"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
