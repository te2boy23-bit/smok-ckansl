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
    <section className="bg-gradient-to-b from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] rounded-3xl p-5 sm:p-6 border-2 border-[#86efac] shadow-xl relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4ade80]/20 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#bbf7d0] rounded-2xl border border-[#86efac] text-[#15803d] shadow-sm">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#047857] tracking-widest uppercase">
              Money Conversion
            </span>
            <h2 className="text-xl font-black text-[#022c22] flex items-center gap-2">
              タバコ代「これ買えたのに」換算
            </h2>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="flex items-center p-1 bg-[#bbf7d0] rounded-2xl border border-[#86efac] self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('loss')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'loss'
                ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#022c22] shadow-sm border border-[#86efac]'
                : 'text-[#065f46] hover:text-[#022c22]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#022c22]" />
            <span>吸った損失換算</span>
          </button>
          <button
            onClick={() => setActiveTab('reward')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'reward'
                ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#022c22] shadow-sm border border-[#86efac]'
                : 'text-[#065f46] hover:text-[#022c22]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#022c22]" />
            <span>禁煙で浮いたご褒美</span>
          </button>
        </div>
      </div>

      {/* 銘柄と価格レートの提示 */}
      <div className="bg-[#e8fdf0] border border-[#86efac] rounded-2xl p-3.5 mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#065f46] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#bbf7d0] text-[#022c22] rounded-lg text-[10px] font-black border border-[#86efac]">
            基準銘柄
          </span>
          <span className="font-bold text-[#022c22] truncate max-w-[240px]">
            {profile.brands && profile.brands.length > 0 ? profile.brands.join(', ') : '設定銘柄'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>1箱: <strong className="text-[#15803d] font-black">{profile.pricePerPack}円</strong></span>
          <span>1本あたり約: <strong className="text-[#047857] font-black">{singlePrice}円</strong></span>
        </div>
      </div>

      {activeTab === 'loss' ? (
        /* 吸ってしまった分の換算表示 */
        <div className="space-y-4">
          <div className="bg-[#e8fdf0] p-5 rounded-2xl border-2 border-[#86efac] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-[#065f46] block mb-1">
                開始以降に吸ってしまった合計本数
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#022c22]">{totalSmokedCount}</span>
                <span className="text-sm font-bold text-[#065f46]">本</span>
                <span className="text-xs text-[#047857] ml-2">
                  （煙に消えた金額: <strong className="text-[#15803d] text-base">{totalLossMoney.toLocaleString()}円</strong>）
                </span>
              </div>
            </div>
            <div className="text-xs text-[#022c22] bg-[#bbf7d0] px-3.5 py-2 rounded-xl border border-[#86efac] font-bold">
              {totalSmokedCount === 0 ? (
                <span className="text-[#15803d] font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 損失ゼロ！最高のコンディションを維持中！
                </span>
              ) : (
                <span>もし吸わなければ、この下のお宝が手に入っていました！</span>
              )}
            </div>
          </div>

          {totalSmokedCount === 0 ? (
            <div className="text-center py-8 bg-[#e8fdf0] rounded-2xl border border-[#86efac] p-6 shadow-sm">
              <span className="text-4xl block mb-3">🛡️✨</span>
              <p className="font-black text-[#022c22] text-base mb-1">
                現在、吸ってしまった本数は0本です！
              </p>
              <p className="text-xs text-[#065f46]">
                お金も肺の健康も1ミリも無駄にしていません。この素晴らしい調子で進みましょう！
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xs font-black text-[#022c22] mb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#15803d]" />
                吸った本数（{totalSmokedCount}本 / {totalLossMoney.toLocaleString()}円）で買えたはずのもの
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lossItems.map((item, idx) => {
                  const buyableCount = Math.floor(totalSmokedCount / item.minCigarettes);
                  return (
                    <div
                      key={idx}
                      className="bg-[#e8fdf0] p-4 rounded-2xl border border-[#86efac] flex items-start gap-3 hover:border-[#22c55e] transition shadow-sm"
                    >
                      <span className="text-3xl p-2 bg-[#bbf7d0] rounded-xl border border-[#86efac]">
                        {item.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black text-[#022c22] bg-[#bbf7d0] px-2 py-0.5 rounded-full border border-[#86efac]">
                            {item.category}
                          </span>
                          {buyableCount > 1 && (
                            <span className="text-xs font-black text-[#15803d]">
                              {buyableCount}回分買えた！
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#022c22] truncate">
                          {item.itemName}
                        </h4>
                        <p className="text-[11px] text-[#065f46] mt-1 leading-relaxed">
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
          <div className="bg-[#e8fdf0] p-5 rounded-2xl border-2 border-[#4ade80] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-[#065f46] block mb-1">
                禁煙で浮いた累積節約額（吸わずに耐えた本数）
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#15803d]">{totalSavedMoney.toLocaleString()}</span>
                <span className="text-sm font-bold text-[#065f46]">円</span>
                <span className="text-xs text-[#047857] ml-2">
                  （我慢した本数: <strong className="text-[#022c22] text-base">{totalSavedCount}本</strong>）
                </span>
              </div>
            </div>
            {nextTargetItem && (
              <div className="text-xs text-[#022c22] bg-[#bbf7d0] px-4 py-2.5 rounded-xl border border-[#86efac]">
                <div className="flex items-center gap-1.5 text-[#047857] font-bold mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>次のご褒美目標</span>
                </div>
                <span>
                  あと<strong className="text-[#15803d] mx-1">{remainingForNext}本</strong>
                  （約{daysForNext}日）で「{nextTargetItem.itemName}」達成！
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-black text-[#022c22] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#15803d]" />
              あなたの我慢で今すでに買えるご褒美アイテム
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rewardItems.length > 0 ? (
                rewardItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#e8fdf0] p-4 rounded-2xl border border-[#86efac] flex items-start gap-3 hover:border-[#22c55e] transition shadow-sm"
                  >
                    <span className="text-3xl p-2 bg-[#bbf7d0] rounded-xl border border-[#86efac]">
                      {item.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black text-[#022c22] bg-[#bbf7d0] px-2 py-0.5 rounded-full border border-[#86efac]">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-black text-[#15803d]">
                          解放済み ✓
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#022c22] truncate">
                        {item.itemName}
                      </h4>
                      <p className="text-[11px] text-[#065f46] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 bg-[#e8fdf0] rounded-2xl border border-[#86efac] p-4 shadow-sm">
                  <p className="text-xs text-[#065f46]">
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
