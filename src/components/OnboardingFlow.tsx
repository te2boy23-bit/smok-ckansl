'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { BRAND_DATABASE } from '@/lib/constants';
import { ShieldCheck, Check, ArrowRight, ArrowLeft, Heart, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ initialProfile, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'paper' | 'heated'>('all');
  const [useFuturePrice, setUseFuturePrice] = useState<boolean>(true);

  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [customBrand, setCustomBrand] = useState('');
  const [customBrandsList, setCustomBrandsList] = useState<string[]>([]);
  const [dailyCount, setDailyCount] = useState<number>(initialProfile.dailyCigarettesBefore || 15);
  const [pricePerPack, setPricePerPack] = useState<number>(initialProfile.pricePerPack || 600);
  const [startDateChoice, setStartDateChoice] = useState<'today' | '3days' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [userName, setUserName] = useState(initialProfile.name || '');
  const [partnerName, setPartnerName] = useState(initialProfile.partnerName || 'みどり');

  const toggleBrand = (brandId: string) => {
    let nextIds: string[];
    if (selectedBrandIds.includes(brandId)) {
      nextIds = selectedBrandIds.filter((id) => id !== brandId);
    } else {
      nextIds = [...selectedBrandIds, brandId];
    }
    setSelectedBrandIds(nextIds);

    if (nextIds.length > 0) {
      const selectedDetails = BRAND_DATABASE.filter((b) => nextIds.includes(b.id));
      const totalPrice = selectedDetails.reduce((sum, b) => {
        const p = useFuturePrice && b.futurePrice ? b.futurePrice : b.currentPrice;
        return sum + p;
      }, 0);
      const avgPrice = Math.round(totalPrice / selectedDetails.length);
      setPricePerPack(avgPrice);
    }
  };

  const handleAddCustomBrand = () => {
    if (customBrand.trim() && !customBrandsList.includes(customBrand.trim())) {
      setCustomBrandsList((prev) => [...prev, customBrand.trim()]);
      setCustomBrand('');
    }
  };

  const filteredBrands = BRAND_DATABASE.filter((b) => {
    if (categoryFilter === 'paper') return b.category === 'paper';
    if (categoryFilter === 'heated') return b.category === 'heated';
    return true;
  });

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    let computedStartDate = new Date().toISOString();
    if (startDateChoice === '3days') {
      computedStartDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    } else if (startDateChoice === 'custom') {
      computedStartDate = new Date(customStartDate).toISOString();
    }

    const brandNames = [
      ...BRAND_DATABASE.filter((b) => selectedBrandIds.includes(b.id)).map((b) => b.name),
      ...customBrandsList,
    ];

    const finalProfile: UserProfile = {
      ...initialProfile,
      name: userName.trim() || 'チャレンジャー',
      partnerName: partnerName.trim() || 'みどり',
      brands: brandNames.length > 0 ? brandNames : ['メビウス (紙巻き／レギュラー等)'],
      dailyCigarettesBefore: Number(dailyCount),
      pricePerPack: Number(pricePerPack),
      startDate: computedStartDate,
      useFuturePrice,
      isOnboarded: true,
    };

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#10b981', '#34d399', '#84cc16', '#a3e635', '#6ee7b7'],
    });

    onComplete(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#04140b]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#123924] via-[#0d2a1b] to-[#081e13] border-2 border-[#1f5e39] rounded-[36px] p-5 sm:p-7 shadow-2xl relative my-auto">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#10b981]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#84cc16]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4b31] border border-[#2d734c] text-xs font-black text-[#a3e635] shadow-sm mb-2.5">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Smok-Ckansl 初期セットアップ</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#ecfdf5] tracking-tight">
            {step === 1 && '吸っていた銘柄を選択してください'}
            {step === 2 && 'これまでの喫煙ペースは？'}
            {step === 3 && '最後にログイン情報を入力'}
          </h2>

          <p className="text-xs text-[#a7f3d0] font-medium mt-1">
            {step === 1 && '複数選択OK！選択すると最新のタバコ価格が自動計算されます'}
            {step === 2 && '浮いたお金や撃退本数の正確な計算に使います'}
            {step === 3 && 'あなたと応援パートナーの名前を決めてスタート！'}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-10 bg-gradient-to-r from-[#10b981] to-[#a3e635]'
                    : s < step
                    ? 'w-6 bg-[#255f3c]'
                    : 'w-6 bg-[#133722]'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between gap-2 p-1 bg-[#0a2317] rounded-2xl border border-[#1b4b31]">
              <div className="flex gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    categoryFilter === 'all'
                      ? 'bg-[#18462f] text-[#a3e635] border border-[#2b724b]'
                      : 'text-[#6ee7b7]'
                  }`}
                >
                  すべて
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('paper')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    categoryFilter === 'paper'
                      ? 'bg-[#18462f] text-[#a3e635] border border-[#2b724b]'
                      : 'text-[#6ee7b7]'
                  }`}
                >
                  紙巻き
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('heated')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    categoryFilter === 'heated'
                      ? 'bg-[#18462f] text-[#a3e635] border border-[#2b724b]'
                      : 'text-[#6ee7b7]'
                  }`}
                >
                  加熱式
                </button>
              </div>

              <button
                type="button"
                onClick={() => setUseFuturePrice(!useFuturePrice)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition flex items-center gap-1 ${
                  useFuturePrice
                    ? 'bg-[#1b4b31] border-[#34d399] text-[#a3e635]'
                    : 'bg-[#0f2e1e] border-[#1b4b31] text-[#6ee7b7]'
                }`}
              >
                <Flame className="w-3 h-3 text-[#a3e635]" />
                <span>10月新価格適用中</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredBrands.map((brand) => {
                const isSelected = selectedBrandIds.includes(brand.id);
                const displayPrice = useFuturePrice && brand.futurePrice ? brand.futurePrice : brand.currentPrice;

                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => toggleBrand(brand.id)}
                    className={`p-3 rounded-2xl border text-left transition-all text-xs font-bold flex items-center justify-between gap-2 active:scale-95 ${
                      isSelected
                        ? 'bg-[#1a4a2f] border-[#34d399] text-[#ecfdf5] shadow-md shadow-[#059669]/30'
                        : 'bg-[#0a2317]/85 border-[#1c4d30] text-[#a7f3d0] hover:border-[#2b724b]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xs font-black">{brand.name}</div>
                      <div className="text-[10px] text-[#6ee7b7] flex items-center gap-1.5 mt-0.5">
                        <span className="font-extrabold text-[#a3e635]">¥{displayPrice}</span>
                        <span>• {brand.maker}</span>
                        {brand.futurePrice && useFuturePrice && (
                          <span className="text-[9px] px-1 rounded bg-[#092215] text-[#34d399]">
                            改定後
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#10b981] border-[#10b981] text-[#071c12]'
                          : 'border-[#2d734c]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#1b4b31]">
              <input
                type="text"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="その他銘柄を入力して追加..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a2317] border border-[#215a39] text-[#ecfdf5] text-xs font-bold focus:outline-none focus:border-[#10b981]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomBrand();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomBrand}
                className="px-4 py-2.5 bg-[#17462b] hover:bg-[#205837] text-[#a3e635] text-xs font-bold rounded-xl border border-[#2b7149] transition"
              >
                追加
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={selectedBrandIds.length === 0 && customBrandsList.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-[#10b981] to-[#a3e635] hover:brightness-110 active:scale-95 disabled:opacity-50 text-[#071c12] font-black text-sm rounded-2xl shadow-lg shadow-[#10b981]/25 transition flex items-center justify-center gap-2"
              >
                <span>
                  次へ進む ({selectedBrandIds.length + customBrandsList.length}銘柄・1箱約¥{pricePerPack})
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative z-10 space-y-4">
            <div className="bg-[#0a2317]/90 border border-[#1f5636] rounded-2xl p-4">
              <label className="block text-xs font-bold text-[#a7f3d0] mb-2 flex items-center justify-between">
                <span>以前は1日に何本吸っていましたか？</span>
                <span className="text-base font-black text-[#a3e635]">{dailyCount}本</span>
              </label>

              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[
                  { label: '少し(5本)', val: 5 },
                  { label: '普通(10本)', val: 10 },
                  { label: '1箱(20本)', val: 20 },
                  { label: '多め(30本)', val: 30 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDailyCount(item.val)}
                    className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                      dailyCount === item.val
                        ? 'bg-[#1b4b31] border-[#34d399] text-[#a3e635]'
                        : 'bg-[#0f2e1e] border-[#1b4b31] text-[#a7f3d0]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="1"
                max="60"
                value={dailyCount}
                onChange={(e) => setDailyCount(Number(e.target.value))}
                className="w-full accent-[#10b981]"
              />
            </div>

            <div className="bg-[#0a2317]/90 border border-[#1f5636] rounded-2xl p-4">
              <label className="block text-xs font-bold text-[#a7f3d0] mb-2 flex items-center justify-between">
                <span>タバコ1箱の計算価格（銘柄から自動連動）</span>
                <span className="text-base font-black text-[#a3e635]">¥{pricePerPack}</span>
              </label>

              <div className="grid grid-cols-4 gap-1.5">
                {[470, 580, 600, 620].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setPricePerPack(price)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      pricePerPack === price
                        ? 'bg-[#1b4b31] border-[#34d399] text-[#a3e635]'
                        : 'bg-[#0f2e1e] border-[#1b4b31] text-[#a7f3d0]'
                    }`}
                  >
                    ¥{price}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0a2317]/90 border border-[#1f5636] rounded-2xl p-4">
              <label className="block text-xs font-bold text-[#a7f3d0] mb-2">
                いつから禁煙をスタートしますか？
              </label>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setStartDateChoice('today')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    startDateChoice === 'today'
                      ? 'bg-[#1b4b31] border-[#34d399] text-[#a3e635]'
                      : 'bg-[#0f2e1e] border-[#1b4b31] text-[#a7f3d0]'
                  }`}
                >
                  今日から！
                </button>
                <button
                  type="button"
                  onClick={() => setStartDateChoice('3days')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    startDateChoice === '3days'
                      ? 'bg-[#1b4b31] border-[#34d399] text-[#a3e635]'
                      : 'bg-[#0f2e1e] border-[#1b4b31] text-[#a7f3d0]'
                  }`}
                >
                  3日前から
                </button>
                <button
                  type="button"
                  onClick={() => setStartDateChoice('custom')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    startDateChoice === 'custom'
                      ? 'bg-[#1b4b31] border-[#34d399] text-[#a3e635]'
                      : 'bg-[#0f2e1e] border-[#1b4b31] text-[#a7f3d0]'
                  }`}
                >
                  日付を選ぶ
                </button>
              </div>

              {startDateChoice === 'custom' && (
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-[#081e13] border border-[#215a39] text-[#ecfdf5] text-xs font-bold"
                />
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-[#143a25] hover:bg-[#1a4a30] text-[#a7f3d0] font-black text-xs rounded-2xl border border-[#26633e] transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>戻る</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#10b981] to-[#a3e635] hover:brightness-110 active:scale-95 text-[#071c12] font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>ログイン設定へ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinish} className="relative z-10 space-y-4">
            <div className="bg-[#0a2317]/90 border border-[#1f5636] rounded-2xl p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#a7f3d0] mb-1">
                  あなたのニックネーム
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder="例: たくや"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#081e13] border border-[#215a39] text-[#ecfdf5] font-bold text-sm focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#a7f3d0] mb-1 flex items-center justify-between">
                  <span>恋人・応援パートナーの名前</span>
                  <span className="text-[10px] text-[#6ee7b7]">記念日をお祝いしてくれる相手</span>
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  required
                  placeholder="例: みどり"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#081e13] border border-[#215a39] text-[#ecfdf5] font-bold text-sm focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#143a25]/80 border border-[#235e3b] text-xs space-y-1.5 text-[#a7f3d0]">
              <div className="font-bold text-[#ecfdf5] mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span>確定する禁煙設定</span>
                </span>
                <span className="text-[10px] text-[#a3e635] bg-[#092215] px-2 py-0.5 rounded-full border border-[#1f5636]">
                  {useFuturePrice ? '10月値上げ新価格' : '現行価格'}
                </span>
              </div>
              <div className="truncate">
                • 銘柄: {BRAND_DATABASE.filter((b) => selectedBrandIds.includes(b.id)).map((b) => b.name).join(', ') || customBrandsList.join(', ')}
              </div>
              <div>
                • ペース: 1日 {dailyCount}本 / 1箱 ¥{pricePerPack}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 bg-[#143a25] hover:bg-[#1a4a30] text-[#a7f3d0] font-black text-xs rounded-2xl border border-[#26633e] transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>戻る</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-[#10b981] to-[#a3e635] hover:brightness-110 active:scale-95 text-[#071c12] font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-[#071c12] text-[#071c12]" />
                <span>禁煙をスタートする！</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
