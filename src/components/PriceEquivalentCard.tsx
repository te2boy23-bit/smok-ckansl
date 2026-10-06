'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { EQUIVALENT_ITEMS } from '@/lib/constants';
import { ShoppingBag, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, Coins } from 'lucide-react';

interface PriceEquivalentCardProps {
  profile: UserProfile;
  totalSmokedCount: number;
  totalSavedCount: number;
}

export const PriceEquivalentCard: React.FC<PriceEquivalentCardProps> = ({
  profile,
  totalSmokedCount,
  totalSavedCount,
}) => {
  const [activeTab, setActiveTab] = useState<'loss' | 'reward'>('loss');

  const singlePrice = Math.round((profile.pricePerPack || 600) / (profile.cigarettesPerPack || 20));
  const totalLossMoney = totalSmokedCount * singlePrice;
  const totalSavedMoney = totalSavedCount * singlePrice;

  // 損失分で買えたもの（吸ってしまった本数に最も近い、またはそれ以下のアイテム一覧）
  const lossItems = EQUIVALENT_ITEMS.filter((item) => item.minCigarettes <= Math.max(1, totalSmokedCount))
    .slice(-4)
    .reverse();

  // 浮いた分で買えるご褒美（浮いた本数で到達しているアイテム一覧）
  const rewardItems = EQUIVALENT_ITEMS.filter((item) => item.minCigarettes <= Math.max(1, totalSavedCount))
    .slice(-4)
    .reverse();

  // 次に目指せるご褒美アイテム
  const nextTargetItem = EQUIVALENT_ITEMS.find((item) => item.minCigarettes > totalSavedCount);
  const remainingForNext = nextTargetItem ? nextTargetItem.minCigarettes - totalSavedCount : 0;
  const daysForNext = profile.dailyCigarettesBefore > 0 ? Math.ceil(remainingForNext / profile.dailyCigarettesBefore) : 0;

  return (
    <section className="bg-gradient-to-b from-[#0a271a] to-[#061c12] rounded-3xl p-6 border-2 border-[#154a30] shadow-xl relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#0f3d26] rounded-2xl border border-[#226341] text-[#a3e635]">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#86efac] tracking-widest uppercase">
              Money Conversion
            </span>
            <h2 className="text-xl font-black text-[#ecfdf5] flex items-center gap-2">
              タバコ代「これ買えたのに」換算
            </h2>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="flex items-center p-1 bg-[#05170f] rounded-2xl border border-[#143d26] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('loss')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'loss'
                ? 'bg-gradient-to-r from-[#14532d] to-[#15803d] text-[#ecfdf5] shadow-lg border border-[#22c55e]'
                : 'text-[#86efac] hover:text-[#d1fae5]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>吸った損失換算</span>
          </button>
          <button
            onClick={() => setActiveTab('reward')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'reward'
                ? 'bg-gradient-to-r from-[#047857] to-[#059669] text-[#ecfdf5] shadow-lg border border-[#34d399]'
                : 'text-[#86efac] hover:text-[#d1fae5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6ee7b7]" />
            <span>禁煙で浮いたご褒美</span>
          </button>
        </div>
      </div>

      {/* 銘柄と価格レートの提示 */}
      <div className="bg-[#082317] border border-[#18492f] rounded-2xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-[#a7f3d0]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#0e3b25] text-[#86efac] rounded-lg text-[10px] font-bold border border-[#1e5839]">
            基準銘柄
          </span>
          <span className="font-semibold text-[#ecfdf5] truncate max-w-[240px]">
            {profile.brands && profile.brands.length > 0 ? profile.brands.join(', ') : '設定銘柄'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>1箱: <strong className="text-[#a3e635] font-black">{profile.pricePerPack}円</strong></span>
          <span>1本あたり約: <strong className="text-[#6ee7b7] font-black">{singlePrice}円</strong></span>
        </div>
      </div>

      {activeTab === 'loss' ? (
        /* 吸ってしまった分の換算表示 */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#173824] to-[#0f2d1d] p-5 rounded-2xl border border-[#235839] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#86efac] block mb-1">
                開始以降に吸ってしまった合計本数
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#ecfdf5]">{totalSmokedCount}</span>
                <span className="text-sm font-bold text-[#a7f3d0]">本</span>
                <span className="text-xs text-[#6ee7b7] ml-2">
                  （煙に消えた金額: <strong className="text-[#a3e635] text-base">{totalLossMoney.toLocaleString()}円</strong>）
                </span>
              </div>
            </div>
            <div className="text-xs text-[#86efac] bg-[#092215] px-3.5 py-2 rounded-xl border border-[#1b4b30]">
              {totalSmokedCount === 0 ? (
                <span className="text-[#34d399] font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 損失ゼロ！最高のコンディションを維持中！
                </span>
              ) : (
                <span>もし吸わなければ、この下のお宝が手に入っていました！</span>
              )}
            </div>
          </div>

          {totalSmokedCount === 0 ? (
            <div className="text-center py-8 bg-[#082317] rounded-2xl border border-[#16422a] p-6">
              <span className="text-4xl block mb-3">🛡️✨</span>
              <p className="font-black text-[#ecfdf5] text-base mb-1">
                現在、吸ってしまった本数は0本です！
              </p>
              <p className="text-xs text-[#86efac]">
                お金も肺の健康も1ミリも無駄にしていません。この素晴らしい調子で進みましょう！
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xs font-bold text-[#86efac] mb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#a3e635]" />
                吸った本数（{totalSmokedCount}本 / {totalLossMoney.toLocaleString()}円）で買えたはずのもの
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lossItems.map((item, idx) => {
                  const buyableCount = Math.floor(totalSmokedCount / item.minCigarettes);
                  return (
                    <div
                      key={idx}
                      className="bg-[#092417] p-4 rounded-2xl border border-[#1a4f32] flex items-start gap-3 hover:border-[#22c55e]/50 transition"
                    >
                      <span className="text-3xl p-2 bg-[#05170f] rounded-xl border border-[#123d26]">
                        {item.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-[#86efac] bg-[#0c2f1e] px-2 py-0.5 rounded-full border border-[#1b5033]">
                            {item.category}
                          </span>
                          {buyableCount > 1 && (
                            <span className="text-xs font-black text-[#a3e635]">
                              {buyableCount}回分買えた！
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#ecfdf5] truncate">
                          {item.itemName}
                        </h4>
                        <p className="text-[11px] text-[#6ee7b7] mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 禁煙で浮いたご褒美の換算表示 */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#0d3f28] to-[#092c1c] p-5 rounded-2xl border border-[#1b5e3b] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#86efac] block mb-1">
                禁煙で浮いた累積節約額（吸わずに耐えた本数）
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#a3e635]">{totalSavedMoney.toLocaleString()}</span>
                <span className="text-sm font-bold text-[#a7f3d0]">円</span>
                <span className="text-xs text-[#6ee7b7] ml-2">
                  （我慢した本数: <strong className="text-[#ecfdf5] text-base">{totalSavedCount}本</strong>）
                </span>
              </div>
            </div>
            {nextTargetItem && (
              <div className="text-xs text-[#86efac] bg-[#061f14] px-4 py-2.5 rounded-xl border border-[#14482b]">
                <div className="flex items-center gap-1.5 text-[#6ee7b7] font-bold mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span>次のご褒美目標</span>
                </div>
                <span>
                  あと<strong className="text-[#a3e635] mx-1">{remainingForNext}本</strong>
                  （約{daysForNext}日）で「{nextTargetItem.itemName}」達成！
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#86efac] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#34d399]" />
              あなたの我慢で今すでに買えるご褒美アイテム
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rewardItems.length > 0 ? (
                rewardItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#092618] p-4 rounded-2xl border border-[#1b5335] flex items-start gap-3 hover:border-[#10b981] transition shadow-md"
                  >
                    <span className="text-3xl p-2 bg-[#05170f] rounded-xl border border-[#144329]">
                      {item.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-[#34d399] bg-[#0c3120] px-2 py-0.5 rounded-full border border-[#1e5c3b]">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-[#86efac]">
                          解放済み ✓
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#ecfdf5] truncate">
                        {item.itemName}
                      </h4>
                      <p className="text-[11px] text-[#6ee7b7] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 bg-[#082317] rounded-2xl border border-[#154229] p-4">
                  <p className="text-xs text-[#86efac]">
                    禁煙を続けると、ここに浮いたお金で買えるご褒美アイテムが次々と解放されます！
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
