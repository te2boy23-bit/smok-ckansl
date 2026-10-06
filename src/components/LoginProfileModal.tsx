'use client';

import React, { useState } from 'react';
import { UserProfile, PartnerTone } from '@/types';
import { BRAND_DATABASE } from '@/lib/constants';
import { X, User, Heart, Calendar, Cigarette, Sparkles, Award } from 'lucide-react';

interface LoginProfileModalProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
}

export const LoginProfileModal: React.FC<LoginProfileModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name || 'チャレンジャー');
  const [partnerName, setPartnerName] = useState(profile.partnerName || 'すいすい');
  const [partnerTone, setPartnerTone] = useState<PartnerTone>(profile.partnerTone || 'deredere');
  const [startDate, setStartDate] = useState(profile.startDate || new Date().toISOString());
  const [dailyCigarettes, setDailyCigarettes] = useState(profile.dailyCigarettesBefore || 15);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(profile.brands || ['パーラメント (KSボックス等)']);
  const [useFuturePrice, setUseFuturePrice] = useState<boolean>(profile.useFuturePrice ?? true);
  const [targetReward, setTargetReward] = useState<string>(profile.targetReward || '極上サウナ＆岩盤浴スパ 1日満喫');
  const [targetRewardCost, setTargetRewardCost] = useState<number>(profile.targetRewardCost || 3000);

  const calculateAveragePrice = (brands: string[], future: boolean) => {
    if (brands.length === 0) return 600;
    let sum = 0;
    let count = 0;
    brands.forEach((brandName) => {
      const match = BRAND_DATABASE.find((b) => b.name === brandName);
      if (match) {
        sum += future && match.futurePrice ? match.futurePrice : match.currentPrice;
        count++;
      }
    });
    return count > 0 ? Math.round(sum / count) : 600;
  };

  const handleBrandToggle = (brandName: string) => {
    if (selectedBrands.includes(brandName)) {
      if (selectedBrands.length > 1) {
        setSelectedBrands(selectedBrands.filter((b) => b !== brandName));
      }
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedPrice = calculateAveragePrice(selectedBrands, useFuturePrice);
    const updated: UserProfile = {
      ...profile,
      name,
      partnerName,
      partnerTone,
      startDate,
      dailyCigarettesBefore: Number(dailyCigarettes),
      brands: selectedBrands,
      pricePerPack: calculatedPrice,
      targetReward,
      targetRewardCost: Number(targetRewardCost),
      useFuturePrice,
      isOnboarded: true,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#064e3b]/30 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#f0fdf4] via-[#e8fdf0] to-[#dcfce7] border-2 border-[#86efac] w-full max-w-xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-[#86efac] flex items-center justify-between bg-[#bbf7d0]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#dcfce7] rounded-2xl text-[#15803d] border border-[#86efac] shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#022c22]">
                マイ設定 ＆ カルテ変更
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#065f46]">
                相棒の褒めトーンや目標ご褒美、銘柄をいつでも変更できます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#065f46] hover:bg-[#86efac] hover:text-[#022c22] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 text-xs">
          {/* 名前と相棒 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#15803d]" />
                あなたのニックネーム
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
              />
            </div>

            <div>
              <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#15803d]" />
                息抜き相棒の名前
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
                className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
              />
            </div>
          </div>

          {/* 相棒の褒めトーン設定 */}
          <div>
            <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
              相棒の褒めトーン（3つの個性）
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPartnerTone('deredere')}
                className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                  partnerTone === 'deredere'
                    ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm font-black'
                    : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46]'
                }`}
              >
                <span className="text-lg block mb-0.5">🥰</span>
                <span className="font-black text-[11px] block">デレデレ全肯定</span>
                <span className="text-[9px] text-[#047857]">甘口・愛嬌♡</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerTone('forest')}
                className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                  partnerTone === 'forest'
                    ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm font-black'
                    : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46]'
                }`}
              >
                <span className="text-lg block mb-0.5">🌲</span>
                <span className="font-black text-[11px] block">癒やし系森林浴</span>
                <span className="text-[9px] text-[#047857]">穏やか・清流</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerTone('passionate')}
                className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                  partnerTone === 'passionate'
                    ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] shadow-sm font-black'
                    : 'bg-[#e8fdf0] border-[#86efac] text-[#065f46]'
                }`}
              >
                <span className="text-lg block mb-0.5">🔥</span>
                <span className="font-black text-[11px] block">体育会系熱血</span>
                <span className="text-[9px] text-[#047857]">熱血激賞！</span>
              </button>
            </div>
          </div>

          {/* 目標ご褒美 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#15803d]" />
                最初の目標ご褒美
              </label>
              <input
                type="text"
                value={targetReward}
                onChange={(e) => setTargetReward(e.target.value)}
                required
                className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
              />
            </div>
            <div>
              <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
                目標金額（円）
              </label>
              <input
                type="number"
                value={targetRewardCost}
                onChange={(e) => setTargetRewardCost(Number(e.target.value))}
                required
                className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
              />
            </div>
          </div>

          {/* 禁煙開始日時 */}
          <div>
            <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#15803d]" />
              禁煙記念日（スタート日時）
            </label>
            <input
              type="datetime-local"
              value={startDate.slice(0, 16)}
              onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
              className="w-full bg-[#e8fdf0] border-2 border-[#86efac] rounded-xl px-3.5 py-2.5 text-[#022c22] focus:outline-none focus:border-[#22c55e] font-bold"
            />
          </div>

          {/* 1日の喫煙本数 */}
          <div>
            <label className="font-black text-[#022c22] mb-1.5 flex items-center gap-1.5">
              <Cigarette className="w-3.5 h-3.5 text-[#15803d]" />
              以前の1日喫煙本数: {dailyCigarettes} 本
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={dailyCigarettes}
              onChange={(e) => setDailyCigarettes(Number(e.target.value))}
              className="w-full accent-[#15803d] h-2 bg-[#bbf7d0] rounded-lg"
            />
          </div>

          {/* 2026年10月新価格トグル */}
          <div className="bg-[#e8fdf0] p-3.5 rounded-2xl border border-[#86efac] flex items-center justify-between shadow-sm">
            <div>
              <span className="font-black text-[#022c22] block">
                2026年10月1日 改定後価格で計算
              </span>
              <span className="text-[11px] text-[#065f46]">
                加熱式タバコ（テリア640円、メビウス590円等）の値上げ予定価格を適用
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUseFuturePrice(!useFuturePrice)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer border border-[#86efac] ${
                useFuturePrice ? 'bg-[#22c55e] justify-end' : 'bg-[#bbf7d0] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-[#022c22]" />
            </button>
          </div>

          {/* 銘柄一覧 */}
          <div>
            <label className="font-black text-[#022c22] mb-1.5 block">
              選択中の銘柄（複数可）
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-[#e8fdf0] rounded-2xl border-2 border-[#86efac] shadow-inner">
              {BRAND_DATABASE.map((brand) => {
                const isSelected = selectedBrands.includes(brand.name);
                const displayPrice = useFuturePrice && brand.futurePrice ? brand.futurePrice : brand.currentPrice;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleBrandToggle(brand.name)}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#bbf7d0] border-[#15803d] text-[#022c22] font-black shadow-sm'
                        : 'bg-[#dcfce7] border-[#86efac] text-[#065f46]'
                    }`}
                  >
                    <span className="text-[11px] truncate text-[#022c22]">{brand.name}</span>
                    <span className="text-[10px] text-[#047857]">{displayPrice}円</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ボタン */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#bbf7d0] text-[#022c22] hover:bg-[#86efac] transition font-black border border-[#86efac]"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#4ade80] hover:brightness-105 text-[#022c22] font-black transition shadow-md border border-[#86efac]"
            >
              設定を保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
