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
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#4ade80', '#86efac', '#15803d', '#a3e635'],
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#022c22]/70 backdrop-blur-xl flex flex-col items-center justify-start p-3 sm:p-6">
      <div className="bg-gradient-to-b from-[#dcfce7] via-[#cbf7d8] to-[#bbf7d0] border-2 border-[#86efac] w-full max-w-2xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden my-4 sm:my-8">
        {/* トップバー：相棒すいすいバナー（ロゴ入り） */}
        <div className="px-5 sm:px-6 py-4 bg-[#bbf7d0] border-b-2 border-[#86efac] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png?v=2"
              alt="すいすいロゴ"
              className="w-11 h-11 rounded-2xl object-cover shadow-sm border-2 border-[#4ade80] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#022c22]">
                  すいすい（息抜き相棒）
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#022c22] border border-[#86efac]">
                  {step === 1 ? 'STEP 1 / 2' : 'STEP 2 / 2'}
                </span>
              </div>
              <p className="text-[11px] text-[#065f46]">
                {step === 1 ? '禁煙カルテ・習慣アンケート' : 'カルテ完成＆アカウント連携'}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[#047857] font-bold">
            {step === 1 ? '質問に答えるだけ♪' : 'あと1分で完了！'}
          </div>
        </div>

        {/* STEP 1: 禁煙カルテ・習慣アンケート */}
        {step === 1 && (
          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            {/* 相棒からのメッセージ（ロゴ入り） */}
            <div className="bg-[#e8fdf0] border-2 border-[#86efac] rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
              <img
                src="/logo.png?v=2"
                alt="すいすい"
                className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-[#4ade80] shrink-0"
              />
              <div className="text-xs text-[#022c22] leading-relaxed">
                <strong className="text-[#15803d] block mb-0.5 font-black text-sm">
                  「こんにちは！あなたの息抜き相棒『すいすい』だよ！」
                </strong>
                あなたの普段の喫煙ペースや好きなご褒美を教えてね。あなたを責めたり怒ったりは絶対しないから、安心して選んでね！
              </div>
            </div>

            {/* 1. 銘柄選択 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-[#022c22] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#22c55e] text-[#022c22] text-[10px] font-black flex items-center justify-center border border-[#86efac]">1</span>
                  普段吸っている銘柄（複数選択可）
                </label>
                <div className="flex items-center gap-1 text-[11px] bg-[#bbf7d0] p-1 rounded-xl border border-[#86efac]">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                      categoryFilter === 'all' ? 'bg-[#22c55e] text-[#022c22] shadow-sm' : 'text-[#065f46]'
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('paper')}
                    className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                      categoryFilter === 'paper' ? 'bg-[#22c55e] text-[#022c22] shadow-sm' : 'text-[#065f46]'
                    }`}
                  >
                    紙巻き
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('heated')}
                    className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                      categoryFilter === 'heated' ? 'bg-[#22c55e] text-[#022c22] shadow-sm' : 'text-[#065f46]'
                    }`}
                  >
                    加熱式
                  </button>
                </div>
              </div>

              {/* 2026年10月新価格トグル */}
              <div className="bg-[#e8fdf0] p-3 rounded-xl border border-[#86efac] mb-3 flex items-center justify-between text-xs shadow-sm">
                <div className="text-[11px] text-[#065f46]">
                  <span className="font-black text-[#022c22]">2026年10月1日 改定後価格で試算</span>
                  <span className="block text-[10px] text-[#047857]">加熱式銘柄の値上げ予定価格を反映</span>
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
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer border border-[#86efac] ${
                    useFuturePrice ? 'bg-[#22c55e] justify-end' : 'bg-[#bbf7d0] justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#022c22]" />
                </button>
              </div>

              {/* 銘柄一覧グリッド */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#e8fdf0] rounded-2xl border-2 border-[#86efac] shadow-inner">
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
                          ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm'
                          : 'bg-[#dcfce7] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-black truncate text-[11px] text-[#022c22]">{brand.name}</div>
                        <div className="text-[10px] text-[#047857]">{brand.maker} • {price}円</div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-[#022c22] shrink-0 border border-[#15803d]">
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
              <label className="text-xs font-black text-[#022c22] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-[#022c22] text-[10px] font-black flex items-center justify-center border border-[#86efac]">2</span>
                1日の平均喫煙本数
              </label>
              <div className="bg-[#e8fdf0] p-4 rounded-2xl border border-[#86efac] flex items-center gap-4 shadow-sm">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={dailyCount}
                  onChange={(e) => setDailyCount(Number(e.target.value))}
                  className="flex-1 accent-[#15803d] h-2 bg-[#bbf7d0] rounded-lg"
                />
                <span className="font-black text-base text-[#022c22] bg-[#bbf7d0] px-4 py-2 rounded-xl border border-[#86efac] min-w-[90px] text-center shadow-sm">
                  {dailyCount} 本 / 日
                </span>
              </div>
            </div>

            {/* 3. 吸いたくなるタイミング */}
            <div>
              <label className="text-xs font-black text-[#022c22] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-[#022c22] text-[10px] font-black flex items-center justify-center border border-[#86efac]">3</span>
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
                          ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm'
                          : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-[11px] mb-0.5 text-[#022c22]">
                        <span>{timing.icon}</span>
                        <span>{timing.label}</span>
                      </div>
                      <p className="text-[10px] text-[#047857] line-clamp-1">{timing.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. やめたい動機 */}
            <div>
              <label className="text-xs font-black text-[#022c22] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-[#022c22] text-[10px] font-black flex items-center justify-center border border-[#86efac]">4</span>
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
                          ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm'
                          : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                      }`}
                    >
                      <span className="text-lg">{motive.icon}</span>
                      <div className="min-w-0">
                        <div className="font-black text-[11px] text-[#022c22]">{motive.label}</div>
                        <div className="text-[10px] text-[#047857]">{motive.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. 最初の目標ご褒美 */}
            <div>
              <label className="text-xs font-black text-[#022c22] mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-[#022c22] text-[10px] font-black flex items-center justify-center border border-[#86efac]">5</span>
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
                          ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm'
                          : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{reward.emoji}</span>
                        <div>
                          <div className="font-black text-[11px] text-[#022c22]">{reward.name}</div>
                          <div className="text-[10px] text-[#047857]">目標額: {reward.cost.toLocaleString()}円</div>
                        </div>
                      </div>
                      {isSelected && <span className="text-[#15803d] text-xs font-black">◎</span>}
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#4ade80] hover:brightness-105 active:scale-95 text-[#022c22] font-black text-sm transition cursor-pointer shadow-lg flex items-center justify-center gap-2 border border-[#86efac]"
              >
                <span>禁煙カルテを作成して次へ</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: カルテ連携・新規登録 */}
        {step === 2 && (
          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            {/* 完成したカルテのプレビューカード */}
            <div className="bg-gradient-to-br from-[#e8fdf0] to-[#dcfce7] border-2 border-[#86efac] rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#bbf7d0] rounded-xl text-lg border border-[#86efac]">📋</span>
                  <div>
                    <span className="text-[10px] font-bold text-[#047857] tracking-wider uppercase">Medical Chart</span>
                    <h3 className="font-black text-base text-[#022c22]">あなたの禁煙カルテ</h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#22c55e] text-[#022c22] rounded-full text-[10px] font-black border border-[#86efac]">
                  試算完了 ✓
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-[#bbf7d0] p-3 rounded-2xl border border-[#86efac]">
                  <span className="text-[10px] text-[#065f46] block font-bold">年間タバコ代</span>
                  <span className="text-base font-black text-[#15803d]">約{yearlySpend.toLocaleString()}円</span>
                  <span className="text-[9px] text-[#047857] block font-bold">これが丸ごと浮く！</span>
                </div>
                <div className="bg-[#bbf7d0] p-3 rounded-2xl border border-[#86efac]">
                  <span className="text-[10px] text-[#065f46] block font-bold">ご褒美「{selectedReward.name.slice(0, 5)}…」</span>
                  <span className="text-base font-black text-[#022c22]">約{daysToReward}日</span>
                  <span className="text-[9px] text-[#047857] block font-bold">で到達可能！</span>
                </div>
                <div className="bg-[#bbf7d0] p-3 rounded-2xl border border-[#86efac] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#065f46] block font-bold">基準1箱価格</span>
                  <span className="text-base font-black text-[#022c22]">{pricePerPack}円</span>
                  <span className="text-[9px] text-[#047857] block font-bold">2026年最新レート</span>
                </div>
              </div>

              <p className="text-xs text-[#065f46] leading-relaxed bg-[#bbf7d0]/80 p-3 rounded-xl border border-[#86efac] font-bold">
                相棒「すいすい」が、あなたが煙を吸いたくなるタイミングに合わせて代案を出し、我慢した分を全力で褒めちぎります！
              </p>
            </div>

            {/* ニックネーム＆相棒の褒めトーン */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-[#022c22] mb-1.5 block">
                  あなたのニックネーム
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="例: たろう"
                  className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-xs text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#022c22] mb-1.5 block">
                  相棒の褒めトーン
                </label>
                <select
                  value={partnerTone}
                  onChange={(e) => setPartnerTone(e.target.value as PartnerTone)}
                  className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-xs text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
                >
                  <option value="deredere" className="bg-[#dcfce7] text-[#022c22]">
                    デレデレ全肯定（甘口・愛嬌♡）
                  </option>
                  <option value="forest" className="bg-[#dcfce7] text-[#022c22]">
                    癒やし系森林浴（穏やか・清流）
                  </option>
                  <option value="passionate" className="bg-[#dcfce7] text-[#022c22]">
                    体育会系熱血（アツい激賞！）
                  </option>
                </select>
              </div>
            </div>

            {/* アカウント連携・クラウド同期選択（白・黒・オレンジ完全排除の緑系ボタン） */}
            <div>
              <label className="text-xs font-black text-[#022c22] mb-2.5 block">
                カルテ保存とクラウド同期（ワンタップ登録）
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setAuthProvider('line')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'line'
                      ? 'bg-[#22c55e] border-[#15803d] text-[#022c22] shadow-md font-black'
                      : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                  }`}
                >
                  <span className="text-xl block mb-1">💬</span>
                  <span className="text-[11px] font-black block">LINEで連携</span>
                  <span className="text-[9px] text-[#047857]">通知も届く</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthProvider('apple')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'apple'
                      ? 'bg-[#22c55e] border-[#15803d] text-[#022c22] shadow-md font-black'
                      : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                  }`}
                >
                  <span className="text-xl block mb-1">🍏</span>
                  <span className="text-[11px] font-black block">Apple ID</span>
                  <span className="text-[9px] text-[#047857]">iOS同期</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthProvider('google')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'google'
                      ? 'bg-[#22c55e] border-[#15803d] text-[#022c22] shadow-md font-black'
                      : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                  }`}
                >
                  <span className="text-xl block mb-1">🌐</span>
                  <span className="text-[11px] font-black block">Google</span>
                  <span className="text-[9px] text-[#047857]">簡単ログイン</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthProvider('email')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    authProvider === 'email'
                      ? 'bg-[#22c55e] border-[#15803d] text-[#022c22] shadow-md font-black'
                      : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46] hover:border-[#22c55e]'
                  }`}
                >
                  <span className="text-xl block mb-1">✉️</span>
                  <span className="text-[11px] font-black block">メール</span>
                  <span className="text-[9px] text-[#047857]">アドレス登録</span>
                </button>
              </div>
            </div>

            {/* ボトムアクション */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-2xl bg-[#bbf7d0] hover:bg-[#86efac] text-[#022c22] font-black text-xs transition cursor-pointer flex items-center gap-1.5 border border-[#86efac]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>戻る</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#4ade80] hover:brightness-105 active:scale-95 text-[#022c22] font-black text-sm transition cursor-pointer shadow-lg flex items-center justify-center gap-2 border border-[#86efac]"
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
