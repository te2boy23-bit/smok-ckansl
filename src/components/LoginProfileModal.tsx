'use client';

import React, { useState } from 'react';
import { UserProfile, PartnerTone, AppLanguage } from '@/types';
import { BRAND_DATABASE, TARGET_REWARDS } from '@/lib/constants';
import { X, User, Heart, Calendar, Cigarette, Check, Sparkles, Award, Globe } from 'lucide-react';

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
  const [language, setLanguage] = useState<AppLanguage>(profile.language || 'ja');
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
      language,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#092c1d] to-[#04150e] border-2 border-[#165a38] w-full max-w-xl rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#14472c] flex items-center justify-between bg-[#072417]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0c3924] rounded-2xl text-[#a3e635] border border-[#1a5f3b]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#ecfdf5]">
                マイ設定 ＆ カルテ変更
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#86efac]">
                言語や相棒の褒めトーン、目標ご褒美をいつでも変更できます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#86efac] hover:bg-[#0c3621] hover:text-[#ecfdf5] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 text-xs">
          {/* 言語設定 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#a3e635]" />
              表示言語 / Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('ja')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                  language === 'ja'
                    ? 'bg-[#0f4428] border-[#a3e635] text-[#ecfdf5] font-black'
                    : 'bg-[#072517] border-[#15462c] text-[#86efac]'
                }`}
              >
                <span>🇯🇵</span>
                <span>日本語 (Japanese)</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                  language === 'en'
                    ? 'bg-[#0f4428] border-[#a3e635] text-[#ecfdf5] font-black'
                    : 'bg-[#072517] border-[#15462c] text-[#86efac]'
                }`}
              >
                <span>🇺🇸</span>
                <span>English (英語)</span>
              </button>
            </div>
          </div>

          {/* 名前と相棒 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#a3e635]" />
                あなたのニックネーム
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#072517] border border-[#164d2f] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div>
              <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#34d399]" />
                息抜き相棒の名前
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
                className="w-full bg-[#072517] border border-[#164d2f] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          {/* 相棒の褒めトーン設定 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
              相棒の褒めトーン（3つの個性）
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPartnerTone('deredere')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer ${
                  partnerTone === 'deredere'
                    ? 'bg-[#0f4428] border-[#a3e635] text-[#ecfdf5] shadow-md'
                    : 'bg-[#072517] border-[#15462c] text-[#86efac]'
                }`}
              >
                <span className="text-base sm:text-lg block mb-0.5">🥰</span>
                <span className="font-bold text-[10px] sm:text-[11px] block">デレデレ</span>
                <span className="text-[9px] text-[#6ee7b7]">甘口・愛嬌♡</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerTone('forest')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer ${
                  partnerTone === 'forest'
                    ? 'bg-[#0f4428] border-[#a3e635] text-[#ecfdf5] shadow-md'
                    : 'bg-[#072517] border-[#15462c] text-[#86efac]'
                }`}
              >
                <span className="text-base sm:text-lg block mb-0.5">🌲</span>
                <span className="font-bold text-[10px] sm:text-[11px] block">森林浴</span>
                <span className="text-[9px] text-[#6ee7b7]">穏やか・清流</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerTone('passionate')}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer ${
                  partnerTone === 'passionate'
                    ? 'bg-[#0f4428] border-[#a3e635] text-[#ecfdf5] shadow-md'
                    : 'bg-[#072517] border-[#15462c] text-[#86efac]'
                }`}
              >
                <span className="text-base sm:text-lg block mb-0.5">🔥</span>
                <span className="font-bold text-[10px] sm:text-[11px] block">熱血</span>
                <span className="text-[9px] text-[#6ee7b7]">熱血激賞！</span>
              </button>
            </div>
          </div>

          {/* 目標ご褒美 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#a3e635]" />
                最初の目標ご褒美
              </label>
              <input
                type="text"
                value={targetReward}
                onChange={(e) => setTargetReward(e.target.value)}
                required
                className="w-full bg-[#072517] border border-[#164d2f] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
            <div>
              <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
                目標金額（円）
              </label>
              <input
                type="number"
                value={targetRewardCost}
                onChange={(e) => setTargetRewardCost(Number(e.target.value))}
                required
                className="w-full bg-[#072517] border border-[#164d2f] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          {/* 禁煙開始日時 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#a3e635]" />
              禁煙記念日（スタート日時）
            </label>
            <input
              type="datetime-local"
              value={startDate.slice(0, 16)}
              onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
              className="w-full bg-[#072517] border border-[#164d2f] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          {/* 1日の喫煙本数 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
              <Cigarette className="w-3.5 h-3.5 text-[#a3e635]" />
              以前の1日喫煙本数: {dailyCigarettes} 本
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={dailyCigarettes}
              onChange={(e) => setDailyCigarettes(Number(e.target.value))}
              className="w-full accent-[#10b981] h-2 bg-[#09291b] rounded-lg"
            />
          </div>

          {/* 2026年10月新価格トグル */}
          <div className="bg-[#072517] p-3.5 rounded-2xl border border-[#164d2f] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#ecfdf5] block">
                2026年10月1日 改定後価格で計算
              </span>
              <span className="text-[11px] text-[#86efac]">
                加熱式タバコ（テリア640円、メビウス590円等）の値上げ予定価格を適用
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUseFuturePrice(!useFuturePrice)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                useFuturePrice ? 'bg-[#10b981] justify-end' : 'bg-[#0f3823] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-[#05170f]" />
            </button>
          </div>

          {/* 銘柄一覧 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 block">
              選択中の銘柄（複数可）
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-[#051c11] rounded-2xl border border-[#14472c]">
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
                        ? 'bg-[#0e3b25] border-[#22c55e] text-[#ecfdf5]'
                        : 'bg-[#072517] border-[#14472c] text-[#86efac]'
                    }`}
                  >
                    <span className="text-[11px] truncate">{brand.name}</span>
                    <span className="text-[10px] text-[#6ee7b7]">{displayPrice}円</span>
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
              className="px-5 py-2.5 rounded-xl bg-[#0a2c1d] text-[#86efac] hover:text-[#ecfdf5] transition font-bold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black transition shadow-lg"
            >
              設定を保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
