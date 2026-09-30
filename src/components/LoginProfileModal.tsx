'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { BRAND_DATABASE } from '@/lib/constants';
import { X, User, Heart, Calendar, Cigarette, Check, Sparkles, AlertCircle } from 'lucide-react';

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
  const [name, setName] = useState(profile.name || '禁煙チャレンジャー');
  const [partnerName, setPartnerName] = useState(profile.partnerName || '大切なパートナー');
  const [startDate, setStartDate] = useState(profile.startDate || new Date().toISOString());
  const [dailyCigarettes, setDailyCigarettes] = useState(profile.dailyCigarettesBefore || 15);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(profile.brands || ['パーラメント (KSボックス等)']);
  const [useFuturePrice, setUseFuturePrice] = useState<boolean>(profile.useFuturePrice ?? true);

  // 選択された銘柄群から平均価格を算出
  const calculateAveragePrice = (brands: string[], future: boolean) => {
    if (brands.length === 0) return 600;
    let sum = 0;
    let count = 0;
    brands.forEach((brandName) => {
      const match = BRAND_DATABASE.find((b) => b.name === brandName);
      if (match) {
        sum += (future && match.futurePrice ? match.futurePrice : match.currentPrice);
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
      startDate,
      dailyCigarettesBefore: Number(dailyCigarettes),
      brands: selectedBrands,
      pricePerPack: calculatedPrice,
      useFuturePrice,
      isOnboarded: true,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d08]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#09291b] to-[#051a10] border-2 border-[#165033] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-[#144229] flex items-center justify-between bg-[#061d13]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0c3823] rounded-xl text-[#a3e635] border border-[#1b5837]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#ecfdf5]">
                ログイン＆プロファイル設定
              </h3>
              <p className="text-[11px] text-[#86efac]">
                銘柄の複数選択や恋人の名前、禁煙開始日時をいつでも変更できます
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* 名前＆恋人の名前 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full bg-[#082417] border border-[#174d30] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e] transition"
              />
            </div>

            <div>
              <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#34d399]" />
                応援してくれる恋人の名前
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
                className="w-full bg-[#082417] border border-[#174d30] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e] transition"
              />
            </div>
          </div>

          {/* 禁煙開始日時 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#a3e635]" />
              禁煙スタート日時
            </label>
            <input
              type="datetime-local"
              value={startDate.slice(0, 16)}
              onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
              className="w-full bg-[#082417] border border-[#174d30] rounded-xl px-3.5 py-2.5 text-[#ecfdf5] focus:outline-none focus:border-[#22c55e] transition"
            />
            <p className="text-[10px] text-[#6ee7b7] mt-1">
              ※ 過去に禁煙を開始していた場合、過去の日時を指定すると日数が自動で遡って計算されます
            </p>
          </div>

          {/* 1日の喫煙本数 */}
          <div>
            <label className="font-bold text-[#86efac] mb-1.5 flex items-center gap-1.5">
              <Cigarette className="w-3.5 h-3.5 text-[#a3e635]" />
              以前吸っていた1日の平均本数
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="60"
                value={dailyCigarettes}
                onChange={(e) => setDailyCigarettes(Number(e.target.value))}
                className="flex-1 accent-[#10b981] h-2 bg-[#09291b] rounded-lg"
              />
              <span className="font-black text-sm text-[#ecfdf5] bg-[#0c3621] px-3 py-1.5 rounded-xl border border-[#195636]">
                {dailyCigarettes} 本 / 日
              </span>
            </div>
          </div>

          {/* 2026年10月新価格トグル */}
          <div className="bg-[#082417] p-3.5 rounded-2xl border border-[#174d30] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#ecfdf5] block">
                2026年10月1日 改定後価格で計算する
              </span>
              <span className="text-[11px] text-[#86efac]">
                加熱式タバコ（テリア640円、メビウス590円など）の値上げ予定価格を即時適用
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

          {/* 吸っていた銘柄（複数選択可） */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-[#86efac] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
                吸っていた銘柄（複数選択可能）
              </label>
              <span className="text-[10px] text-[#6ee7b7]">
                現在選択中: {selectedBrands.length} 銘柄
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#061d13] rounded-2xl border border-[#144229]">
              {BRAND_DATABASE.map((brand) => {
                const isSelected = selectedBrands.includes(brand.name);
                const displayPrice = useFuturePrice && brand.futurePrice ? brand.futurePrice : brand.currentPrice;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleBrandToggle(brand.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#0e3b25] border-[#22c55e] text-[#ecfdf5]'
                        : 'bg-[#092618] border-[#15462b] text-[#86efac] hover:border-[#1e613c]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold truncate text-[11px]">{brand.name}</div>
                      <div className="text-[10px] text-[#6ee7b7]">{brand.maker} • {displayPrice}円</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-[#071c12] shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 text-right text-[11px] text-[#86efac]">
              自動算出された1箱平均価格: <strong className="text-[#a3e635] text-sm">{calculateAveragePrice(selectedBrands, useFuturePrice)}円</strong>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#0b2f1e] text-[#86efac] hover:text-[#ecfdf5] transition cursor-pointer font-bold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#071c12] font-black transition cursor-pointer shadow-lg"
            >
              設定を保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
