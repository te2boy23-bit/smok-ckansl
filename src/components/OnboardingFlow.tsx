'use client';

import React, { useState } from 'react';
import { UserProfile, PartnerTone } from '@/types';
import { BRAND_DATABASE, SMOKING_TIMINGS, QUIT_MOTIVES, TARGET_REWARDS } from '@/lib/constants';
import { ShieldCheck, Check, ArrowRight, ArrowLeft, Heart, Sparkles, CheckCircle2, Award, Zap, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ initialProfile, onComplete }: OnboardingFlowProps) {
  // 1: 習慣アンケート (STEP 1), 2: カルテプレビュー＆アカウント登録 (STEP 2)
  const [step, setStep] = useState<1 | 2>(1);

  // STEP 1 の入力ステート
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'paper' | 'heated'>('all');
  const [useFuturePrice, setUseFuturePrice] = useState<boolean>(true);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(['parliament']);
  const [dailyCount, setDailyCount] = useState<number>(initialProfile.dailyCigarettesBefore || 15);
  const [pricePerPack, setPricePerPack] = useState<number>(initialProfile.pricePerPack || 600);
  const [selectedTimings, setSelectedTimings] = useState<string[]>(['morning', 'after-meal', 'work-break']);
  const [selectedMotives, setSelectedMotives] = useState<string[]>(['health', 'partner', 'money']);
  const [selectedRewardId, setSelectedRewardId] = useState<string>('sauna');
  const [partnerTone, setPartnerTone] = useState<PartnerTone>('deredere');

  // STEP 2 の入力ステート
  const [userName, setUserName] = useState(initialProfile.name || '相棒チャレンジャー');
  const [partnerName, setPartnerName] = useState(initialProfile.partnerName || 'すいすい');
  const [authProvider, setAuthProvider] = useState<'line' | 'apple' | 'google' | 'email'>('line');

  const toggleBrand = (brandId: string) => {
    let nextIds: string[];
    if (selectedBrandIds.includes(brandId)) {
      if (selectedBrandIds.length > 1) {
        nextIds = selectedBrandIds.filter((id) => id !== brandId);
      } else {
        nextIds = selectedBrandIds;
      }
    } else {
      nextIds = [...selectedBrandIds, brandId];
    }
    setSelectedBrandIds(nextIds);

    const selectedDetails = BRAND_DATABASE.filter((b) => nextIds.includes(b.id));
    const totalPrice = selectedDetails.reduce((sum, b) => {
      const p = useFuturePrice && b.futurePrice ? b.futurePrice : b.currentPrice;
      return sum + p;
    }, 0);
    const avgPrice = Math.round(totalPrice / selectedDetails.length);
    setPricePerPack(avgPrice);
  };

  const toggleTiming = (id: string) => {
    setSelectedTimings((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((t) => t !== id) : prev) : [...prev, id]
    );
  };

  const toggleMotive = (id: string) => {
    setSelectedMotives((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((m) => m !== id) : prev) : [...prev, id]
    );
  };

  const filteredBrands = BRAND_DATABASE.filter((b) => {
    if (categoryFilter === 'paper') return b.category === 'paper';
    if (categoryFilter === 'heated') return b.category === 'heated';
    return true;
  });

  const selectedReward = TARGET_REWARDS.find((r) => r.id === selectedRewardId) || TARGET_REWARDS[0];

  // 年間節約額などの試算
  const singlePrice = Math.round(pricePerPack / 20);
  const yearlySpend = dailyCount * singlePrice * 365;
  const daysToReward = Math.ceil(selectedReward.cost / (dailyCount * singlePrice));

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#84cc16', '#34d399', '#6ee7b7', '#a3e635'],
      });
    } catch {
      // ignore
    }

    const selectedBrandNames = BRAND_DATABASE.filter((b) => selectedBrandIds.includes(b.id)).map(
      (b) => b.name
    );

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: userName.trim() || 'チャレンジャー',
      partnerName: partnerName.trim() || 'すいすい',
      partnerTone,
      startDate: new Date().toISOString(),
      dailyCigarettesBefore: dailyCount,
      pricePerPack,
      cigarettesPerPack: 20,
      brands: selectedBrandNames,
      smokingTiming: selectedTimings,
      quitMotive: selectedMotives,
      targetReward: selectedReward.name,
      targetRewardCost: selectedReward.cost,
      language: initialProfile.language || 'ja',
      useFuturePrice,
      isOnboarded: true,
      authProvider,
    };

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#04140d]/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#092b1d] via-[#061f14] to-[#04150e] border-2 border-[#155335] w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden my-6">
        {/* トップバー：相棒すいすいバナー */}
        <div className="px-6 py-4 bg-[#072417] border-b border-[#13442a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="すいすいロゴ"
              className="w-11 h-11 rounded-2xl object-cover shadow-md border-2 border-[#34d399]/60 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#f0fdf4]">
                  すいすい（息抜き相棒）
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#11492d] text-[#86efac] border border-[#227047]">
                  {step === 1 ? 'STEP 1 / 2' : 'STEP 2 / 2'}
                </span>
              </div>
              <p className="text-[11px] text-[#bbf7d0]">
                {step === 1 ? '禁煙カルテ・習慣アンケート' : 'カルテ完成＆アカウント連携'}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[#86efac]">
            {step === 1 ? '質問に答えるだけ♪' : 'あと1分で完了！'}
          </div>
        </div>

        {/* STEP 1: 禁煙カルテ・習慣アンケート */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {/* 相棒からのメッセージ */}
            <div className="bg-[#0e3b26] border border-[#206e46] rounded-2xl p-4 flex items-start gap-3.5">
              <img
                src="/logo.png"
                alt="すいすい"
                className="w-12 h-12 rounded-2xl object-cover shadow-md border border-[#34d399]/50 shrink-0"
              />
              <div className="text-xs text-[#ecfdf5] leading-relaxed">
                <strong className="text-[#a3e635] block mb-0.5">
                  「こんにちは！あなたの息抜き相棒『すいすい』だよ！」
                </strong>
                あなたの普段の喫煙ペースや好きなご褒美を教えてね。あなたを責めたり怒ったりは絶対しないから、安心して選んでね！
              </div>
            </div>

            {/* 1. 銘柄選択 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-[#86efac] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#10b981] text-[#04140d] text-[10px] font-black flex items-center justify-center">1</span>
                  普段吸っている銘柄（複数選択可）
                </label>
                <div className="flex items-center gap-1 text-[11px] bg-[#072417] p-1 rounded-xl border border-[#15462c]">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      categoryFilter === 'all' ? 'bg-[#10b981] text-[#04140d]' : 'text-[#86efac]'
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('paper')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      categoryFilter === 'paper' ? 'bg-[#10b981] text-[#04140d]' : 'text-[#86efac]'
                    }`}
                  >
                    紙巻き
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('heated')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      categoryFilter === 'heated' ? 'bg-[#10b981] text-[#04140d]' : 'text-[#86efac]'
                    }`}
                  >
                    加熱式
                  </button>
                </div>
              </div>

              {/* 2026年10月新価格トグル */}
              <div className="bg-[#072517] p-3 rounded-xl border border-[#14472c] mb-3 flex items-center justify-between text-xs">
                <div className="text-[11px] text-[#86efac]">
                  <span className="font-bold text-[#ecfdf5]">2026年10月1日 改定後価格で試算</span>
                  <span className="block text-[10px] text-[#6ee7b7]">加熱式銘柄の値上げ予定価格を反映</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !useFuturePrice;
                    setUseFuturePrice(next);
                    if (selectedBrandIds.length > 0) {
                      const selectedDetails = BRAND_DATABASE.filter((b) => selectedBrandIds.includes(b.id));
                      const totalPrice = selectedDetails.reduce((sum, b) => {
                        const p = next && b.futurePrice ? b.futurePrice : b.currentPrice;
                        return sum + p;
                      }, 0);
                      setPricePerPack(Math.round(totalPrice / selectedDetails.length));
                    }
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    useFuturePrice ? 'bg-[#10b981] justify-end' : 'bg-[#0f3b25] justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#04140d]" />
                </button>
              </div>

              {/* 銘柄一覧グリッド */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#051c11] rounded-2xl border border-[#13442a]">
                {filteredBrands.map((brand) => {
                  const isSelected = selectedBrandIds.includes(brand.id);
                  const price = useFuturePrice && brand.futurePrice ? brand.futurePrice : brand.currentPrice;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => toggleBrand(brand.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e3b25] border-[#22c55e] text-[#ecfdf5]'
                          : 'bg-[#082618] border-[#14472b] text-[#86efac] hover:border-[#1d633d]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold truncate text-[11px]">{brand.name}</div>
                        <div className="text-[10px] text-[#6ee7b7]">{brand.maker} • {price}円</div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-[#04140d] shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. 1日の本数 */}
            <div>
              <label className="text-xs font-black text-[#86efac] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-[#04140d] text-[10px] font-black flex items-center justify-center">2</span>
                1日の平均喫煙本数
              </label>
              <div className="bg-[#072517] p-4 rounded-2xl border border-[#15462c] flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={dailyCount}
                  onChange={(e) => setDailyCount(Number(e.target.value))}
                  className="flex-1 accent-[#10b981] h-2 bg-[#0a2f1e] rounded-lg"
                />
                <span className="font-black text-base text-[#ecfdf5] bg-[#0c3823] px-4 py-2 rounded-xl border border-[#1a5b3a] min-w-[90px] text-center">
                  {dailyCount} 本 / 日
                </span>
              </div>
            </div>

            {/* 3. 吸いたくなるタイミング */}
            <div>
              <label className="text-xs font-black text-[#86efac] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-[#04140d] text-[10px] font-black flex items-center justify-center">3</span>
                どんな時に吸いたくなる？（複数選択可）
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SMOKING_TIMINGS.map((timing) => {
                  const isSelected = selectedTimings.includes(timing.id);
                  return (
                    <button
                      key={timing.id}
                      type="button"
                      onClick={() => toggleTiming(timing.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f4028] border-[#22c55e] text-[#ecfdf5]'
                          : 'bg-[#082417] border-[#15472c] text-[#86efac] hover:border-[#1d633d]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[11px] mb-0.5">
                        <span>{timing.icon}</span>
                        <span>{timing.label}</span>
                      </div>
                      <p className="text-[10px] text-[#6ee7b7] line-clamp-1">{timing.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. やめたい動機 */}
            <div>
              <label className="text-xs font-black text-[#86efac] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-[#04140d] text-[10px] font-black flex items-center justify-center">4</span>
                やめたい一番の理由は？（複数選択可）
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUIT_MOTIVES.map((motive) => {
                  const isSelected = selectedMotives.includes(motive.id);
                  return (
                    <button
                      key={motive.id}
                      type="button"
                      onClick={() => toggleMotive(motive.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f4028] border-[#22c55e] text-[#ecfdf5]'
                          : 'bg-[#082417] border-[#15472c] text-[#86efac] hover:border-[#1d633d]'
                      }`}
                    >
                      <span className="text-lg">{motive.icon}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-[11px]">{motive.label}</div>
                        <div className="text-[10px] text-[#6ee7b7]">{motive.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. 最初の目標ご褒美 */}
            <div>
              <label className="text-xs font-black text-[#86efac] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-[#04140d] text-[10px] font-black flex items-center justify-center">5</span>
                タバコ代が浮いたら最初に手に入れたいご褒美
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TARGET_REWARDS.map((reward) => {
                  const isSelected = selectedRewardId === reward.id;
                  return (
                    <button
                      key={reward.id}
                      type="button"
                      onClick={() => setSelectedRewardId(reward.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f4028] border-[#a3e635] text-[#ecfdf5]'
                          : 'bg-[#082417] border-[#15472c] text-[#86efac] hover:border-[#1d633d]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{reward.emoji}</span>
                        <div>
                          <div className="font-bold text-[11px]">{reward.name}</div>
                          <div className="text-[10px] text-[#6ee7b7]">目標額: {reward.cost.toLocaleString()}円</div>
                        </div>
                      </div>
                      {isSelected && <span className="text-[#a3e635] text-xs font-black">◎</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 次へボタン */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#059669] to-[#84cc16] hover:from-[#10b981] hover:to-[#a3e635] text-[#04140d] font-black text-sm transition cursor-pointer shadow-xl flex items-center justify-center gap-2"
              >
                <span>禁煙カルテを作成して次へ</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: カルテ連携・新規登録 */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            {/* 完成したカルテのプレビューカード */}
            <div className="bg-gradient-to-br from-[#0c3823] to-[#072417] border-2 border-[#207248] rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#10b981]/20 rounded-xl text-lg">📋</span>
                  <div>
                    <span className="text-[10px] font-bold text-[#86efac] tracking-wider uppercase">Medical Chart</span>
                    <h3 className="font-black text-base text-[#ecfdf5]">あなたの禁煙カルテ</h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#10b981] text-[#04140d] rounded-full text-[10px] font-black">
                  試算完了 ✓
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-[#051d12] p-3 rounded-2xl border border-[#14472c]">
                  <span className="text-[10px] text-[#86efac] block">年間タバコ代</span>
                  <span className="text-base font-black text-[#a3e635]">約{yearlySpend.toLocaleString()}円</span>
                  <span className="text-[9px] text-[#6ee7b7] block">これが丸ごと浮く！</span>
                </div>
                <div className="bg-[#051d12] p-3 rounded-2xl border border-[#14472c]">
                  <span className="text-[10px] text-[#86efac] block">ご褒美「{selectedReward.name.slice(0, 5)}…」</span>
                  <span className="text-base font-black text-[#34d399]">約{daysToReward}日</span>
                  <span className="text-[9px] text-[#6ee7b7] block">で到達可能！</span>
                </div>
                <div className="bg-[#051d12] p-3 rounded-2xl border border-[#14472c] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#86efac] block">基準1箱価格</span>
                  <span className="text-base font-black text-[#ecfdf5]">{pricePerPack}円</span>
                  <span className="text-[9px] text-[#6ee7b7] block">2026年最新レート</span>
                </div>
              </div>

              <p className="text-xs text-[#a7f3d0] leading-relaxed bg-[#051c11]/80 p-3 rounded-xl border border-[#15462c]">
                相棒「すいすい」が、あなたが煙を吸いたくなるタイミングに合わせて代案を出し、我慢した分を全力で褒めちぎります！
              </p>
            </div>

            {/* ニックネーム＆相棒の褒めトーン */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-[#86efac] mb-1.5 block">
                  あなたのニックネーム
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="例: たろう"
                  className="w-full bg-[#072417] border border-[#164c2f] rounded-xl px-3.5 py-2.5 text-xs text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#86efac] mb-1.5 block">
                  相棒の褒めトーン
                </label>
                <select
                  value={partnerTone}
                  onChange={(e) => setPartnerTone(e.target.value as PartnerTone)}
                  className="w-full bg-[#072417] border border-[#164c2f] rounded-xl px-3.5 py-2.5 text-xs text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
                >
                  <option value="deredere" className="bg-[#072417] text-[#ecfdf5]">
                    デレデレ全肯定（甘口・愛嬌♡）
                  </option>
                  <option value="forest" className="bg-[#072417] text-[#ecfdf5]">
                    癒やし系森林浴（穏やか・清流）
                  </option>
                  <option value="passionate" className="bg-[#072417] text-[#ecfdf5]">
                    体育会系熱血（アツい激賞！）
                  </option>
                </select>
              </div>
            </div>

            {/* アカウント連携・クラウド同期選択（白・黒・オレンジ完全排除の緑系ボタン） */}
            <div>
              <label className="text-xs font-black text-[#86efac] mb-2.5 block">
                カルテ保存とクラウド同期（ワンタップ登録）
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setAuthProvider('line')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'line'
                      ? 'bg-[#064e3b] border-[#10b981] text-[#ecfdf5] shadow-lg'
                      : 'bg-[#072417] border-[#14472c] text-[#86efac] hover:border-[#1d633d]'
                  }`}
                >
                  <span className="text-xl block mb-1">💬</span>
                  <span className="text-[11px] font-black block">LINEで連携</span>
                  <span className="text-[9px] text-[#6ee7b7]">通知も届く</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthProvider('apple')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'apple'
                      ? 'bg-[#064e3b] border-[#10b981] text-[#ecfdf5] shadow-lg'
                      : 'bg-[#072417] border-[#14472c] text-[#86efac] hover:border-[#1d633d]'
                  }`}
                >
                  <span className="text-xl block mb-1">🍏</span>
                  <span className="text-[11px] font-black block">Apple ID</span>
                  <span className="text-[9px] text-[#6ee7b7]">iOS同期</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthProvider('google')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'google'
                      ? 'bg-[#064e3b] border-[#10b981] text-[#ecfdf5] shadow-lg'
                      : 'bg-[#072417] border-[#14472c] text-[#86efac] hover:border-[#1d633d]'
                  }`}
                >
                  <span className="text-xl block mb-1">🌐</span>
                  <span className="text-[11px] font-black block">Google</span>
                  <span className="text-[9px] text-[#6ee7b7]">簡単ログイン</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthProvider('email')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'email'
                      ? 'bg-[#064e3b] border-[#10b981] text-[#ecfdf5] shadow-lg'
                      : 'bg-[#072417] border-[#14472c] text-[#86efac] hover:border-[#1d633d]'
                  }`}
                >
                  <span className="text-xl block mb-1">✉️</span>
                  <span className="text-[11px] font-black block">メール</span>
                  <span className="text-[9px] text-[#6ee7b7]">アドレス登録</span>
                </button>
              </div>
            </div>

            {/* ボトムアクション */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-2xl bg-[#09291b] hover:bg-[#0c3623] text-[#86efac] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>戻る</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#059669] to-[#84cc16] hover:from-[#10b981] hover:to-[#a3e635] text-[#04140d] font-black text-sm transition cursor-pointer shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[3]" />
                <span>すいすいと禁煙をスタート！</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
