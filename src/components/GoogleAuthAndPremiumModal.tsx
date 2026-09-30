'use client';

import React, { useState } from 'react';
import { UserProfile, AppLanguage, GoogleAccount } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { X, Sparkles, Check, ShieldCheck, Zap, Heart, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleAuthAndPremiumModalProps {
  profile: UserProfile;
  language: AppLanguage;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export function GoogleAuthAndPremiumModal({
  profile,
  language,
  onUpdateProfile,
  onClose,
}: GoogleAuthAndPremiumModalProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ja;
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isProcessing, setIsProcessing] = useState(false);

  const isGoogleLinked = !!profile.googleAccount;
  const isPremium = !!profile.isPremium;

  // Googleログインのシミュレーション連携
  const handleGoogleLogin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockGoogleUser: GoogleAccount = {
        name: profile.name || 'Google User',
        email: `${(profile.name || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        avatarUrl: '',
        connectedAt: new Date().toISOString(),
      };
      const updated: UserProfile = {
        ...profile,
        authProvider: 'google',
        googleAccount: mockGoogleUser,
      };
      onUpdateProfile(updated);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#84cc16', '#34d399', '#a3e635'],
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  // Googleログアウト
  const handleGoogleLogout = () => {
    const updated: UserProfile = {
      ...profile,
      googleAccount: undefined,
    };
    onUpdateProfile(updated);
  };

  // プレミアム決済の体験
  const handleUpgradePremium = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated: UserProfile = {
        ...profile,
        isPremium: true,
      };
      onUpdateProfile(updated);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#059669', '#84cc16', '#34d399', '#a3e635', '#6ee7b7'],
        });
      } catch {
        // ignore
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#092c1d] via-[#061f14] to-[#04140d] border-2 border-[#165a38] w-full max-w-xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#14472c] bg-[#072417] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#84cc16] flex items-center justify-center text-[#04140d] font-black text-xl shadow-md border border-[#34d399]/40">
              💎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-[#ecfdf5]">
                  {t.premiumTitle}
                </h3>
                {isPremium && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#10b981] text-[#04140d]">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#86efac]">
                {t.premiumSub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#86efac] hover:bg-[#0c3621] hover:text-[#ecfdf5] transition cursor-pointer focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* スクロールコンテンツ */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* ① Googleアカウント連携セクション */}
          <div className="bg-[#072417] border border-[#164d2f] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#ecfdf5]">
                    Googleアカウント連携
                  </h4>
                  <span className="text-[10px] text-[#6ee7b7] block">
                    {isGoogleLinked ? 'クラウド自動バックアップ有効' : '将来の決済・デバイス同期用'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isGoogleLinked
                  ? 'bg-[#0f4428] text-[#34d399] border-[#1f6b43]'
                  : 'bg-[#051c11] text-[#86efac] border-[#14472c]'
              }`}>
                {isGoogleLinked ? '連携中 ✓' : '未連携'}
              </span>
            </div>

            {isGoogleLinked ? (
              <div className="bg-[#051c11] p-3 rounded-xl border border-[#14472c] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#ecfdf5] block text-xs">
                    {profile.googleAccount?.name}
                  </span>
                  <span className="text-[10px] text-[#86efac]">
                    {profile.googleAccount?.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="px-3 py-1.5 rounded-lg bg-[#0c3621] text-[#86efac] hover:text-[#ecfdf5] text-[11px] font-bold border border-[#195636] transition cursor-pointer"
                >
                  解除
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-[#0b3320] hover:bg-[#0f442b] border border-[#1e613c] text-[#ecfdf5] font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-[#04140d] flex items-center justify-center font-black text-[11px]">
                  G
                </span>
                <span>{isProcessing ? 'Google連携処理中…' : t.googleLogin}</span>
              </button>
            )}
          </div>

          {/* ② プレミアム特典一覧 */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#86efac] block">
              プレミアム会員の限定特典
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-[#072417] p-3 rounded-xl border border-[#15462c] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#ecfdf5]">{t.featureCloudSync}</h5>
                  <p className="text-[10px] text-[#6ee7b7]">端末を変更しても記念日や記録が自動復活</p>
                </div>
              </div>

              <div className="bg-[#072417] p-3 rounded-xl border border-[#15462c] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#ecfdf5]">{t.featureUnlimitedAi}</h5>
                  <p className="text-[10px] text-[#6ee7b7]">相棒があなた専用の言葉でいつでも励ます</p>
                </div>
              </div>

              <div className="bg-[#072417] p-3 rounded-xl border border-[#15462c] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#ecfdf5]">{t.featureDetailedCt}</h5>
                  <p className="text-[10px] text-[#6ee7b7]">血圧・心拍・血管弾力の詳細回復グラフ</p>
                </div>
              </div>

              <div className="bg-[#072417] p-3 rounded-xl border border-[#15462c] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#ecfdf5]">{t.featureNoAds}</h5>
                  <p className="text-[10px] text-[#6ee7b7]">静けさと癒やしのボタニカルグリーンを極める</p>
                </div>
              </div>
            </div>
          </div>

          {/* ③ 料金プラン選択 */}
          <div>
            <span className="text-[11px] font-bold text-[#86efac] block mb-2">
              料金プランの選択
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 月額プラン */}
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  selectedPlan === 'monthly'
                    ? 'bg-[#0e3b25] border-[#a3e635] shadow-lg'
                    : 'bg-[#072417] border-[#14472c] hover:border-[#1d633d]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#ecfdf5]">{t.monthlyPlan}</span>
                  {selectedPlan === 'monthly' && <span className="text-[#a3e635] font-black">✓</span>}
                </div>
                <div className="text-lg font-black text-[#a3e635]">{t.monthlyPrice}</div>
                <p className="text-[10px] text-[#86efac] mt-1">タバコ1箱未満の金額で一生の健康へ</p>
              </button>

              {/* 買い切り永久プラン */}
              <button
                type="button"
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                  selectedPlan === 'lifetime'
                    ? 'bg-[#0e3b25] border-[#22c55e] shadow-lg'
                    : 'bg-[#072417] border-[#14472c] hover:border-[#1d633d]'
                }`}
              >
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#84cc16] text-[#04140d] text-[9px] font-black rounded-full">
                  {t.popularBadge}
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#ecfdf5]">{t.lifetimePlan}</span>
                </div>
                <div className="text-lg font-black text-[#34d399]">{t.lifetimePrice}</div>
                <p className="text-[10px] text-[#86efac] mt-1">追加費用なしで永久にすべての機能が解放</p>
              </button>
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#133f27] bg-[#061d13] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#86efac] text-center sm:text-left">
            <span>{t.currentStatus} </span>
            <strong className={isPremium ? 'text-[#a3e635]' : 'text-[#ecfdf5]'}>
              {isPremium ? t.statusPremium : t.statusFree}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0a2c1d] text-[#86efac] hover:text-[#ecfdf5] font-bold text-xs transition cursor-pointer"
            >
              {t.close}
            </button>

            {!isPremium ? (
              <button
                onClick={handleUpgradePremium}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#84cc16] hover:from-[#10b981] hover:to-[#a3e635] text-[#04140d] font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#04140d]" />
                <span>{isProcessing ? '処理中…' : t.upgradeWithGoogle}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const updated = { ...profile, isPremium: false };
                  onUpdateProfile(updated);
                }}
                className="px-3 py-2 rounded-xl bg-[#092c1c] text-[#86efac] text-[10px] hover:text-[#ecfdf5]"
              >
                （テスト用: 無料に戻す）
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
