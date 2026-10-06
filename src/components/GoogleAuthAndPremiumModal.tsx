'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { X, Sparkles, CheckCircle2, ShieldCheck, Heart, Crown, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleAuthAndPremiumModalProps {
  profile: UserProfile;
  language?: 'ja' | 'en';
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export function GoogleAuthAndPremiumModal({
  profile,
  language = 'ja',
  onUpdateProfile,
  onClose,
}: GoogleAuthAndPremiumModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('monthly');

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  const isGoogleLinked = !!profile.googleAccount?.email;
  const isPremium = profile.isPremium ?? false;

  const handleGoogleLogin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockGoogle = {
        name: profile.name || 'チャレンジャー',
        email: `${(profile.name || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        avatarUrl: '/logo.png?v=2',
        connectedAt: new Date().toISOString(),
      };
      const updated: UserProfile = {
        ...profile,
        googleAccount: mockGoogle,
        authProvider: 'google',
      };
      onUpdateProfile(updated);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#4ade80', '#86efac', '#15803d'],
        });
      } catch {
        // ignore
      }
    }, 800);
  };

  const handleGoogleLogout = () => {
    const updated: UserProfile = {
      ...profile,
      googleAccount: undefined,
    };
    onUpdateProfile(updated);
  };

  const handleUpgradePremium = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated: UserProfile = {
        ...profile,
        isPremium: true,
        premiumPlan: selectedPlan,
        premiumSince: new Date().toISOString(),
      };
      onUpdateProfile(updated);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#4ade80', '#86efac', '#15803d', '#a3e635'],
        });
      } catch {
        // ignore
      }
    }, 1000);
  };

  const t = {
    title: language === 'en' ? 'Google Account & Premium Upgrade' : 'Googleアカウント連携 ＆ プレミアムプラン',
    subtitle: language === 'en' ? 'Auto cloud sync and unlimited AI buddy cheerings' : 'カルテの自動クラウド同期と、相棒すいすいの無制限エール',
    googleSection: language === 'en' ? 'Google Account Link' : 'Googleアカウント連携',
    googleLogin: language === 'en' ? 'Sign in with Google' : 'Googleでログイン・連携する',
    googleLinked: language === 'en' ? 'Linked Account' : '連携中のGoogleアカウント',
    unlink: language === 'en' ? 'Unlink' : '連携解除',
    premiumSection: language === 'en' ? 'Sui-Sui Premium Benefits' : 'すいすい プレミアム限定特典',
    featureCloudSync: language === 'en' ? 'Permanent Cloud Backup' : '永続クラウドバックアップ・マルチデバイス同期',
    featureUnlimitedAi: language === 'en' ? 'Unlimited Companion Dialogues' : '相棒すいすいの無限全肯定・カスタムメッセージ',
    featureDetailedCt: language === 'en' ? 'Advanced Health Recovery Graph' : '詳細な肺・血管・血圧回復シミュレーション',
    featureNoAds: language === 'en' ? 'Pure Botanical Ad-Free Space' : '完全広告ゼロ・爽やかライトグリーンUI独占',
    monthlyPlan: language === 'en' ? 'Monthly Pass' : '月額プラン',
    monthlyPrice: language === 'en' ? '¥480 / month' : '月額 480円',
    lifetimePlan: language === 'en' ? 'Lifetime Pass' : '買い切り永久パス',
    lifetimePrice: language === 'en' ? '¥1,980 (One-time)' : '買い切り 1,980円',
    popularBadge: language === 'en' ? 'MOST POPULAR' : '一番人気！',
    upgradeWithGoogle: language === 'en' ? 'Upgrade to Premium' : 'プレミアムにアップグレード',
    currentStatus: language === 'en' ? 'Current Plan:' : '現在の会員ステータス:',
    statusFree: language === 'en' ? 'Free Plan' : '無料プラン',
    statusPremium: language === 'en' ? 'Premium Member ★' : 'プレミアム会員 ★',
    close: language === 'en' ? 'Close' : '閉じる',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#064e3b]/30 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#f0fdf4] via-[#e8fdf0] to-[#dcfce7] border-2 border-[#86efac] w-full max-w-xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-[#86efac] bg-[#bbf7d0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dcfce7] border border-[#86efac] flex items-center justify-center text-[#15803d] shrink-0 shadow-sm">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#022c22]">
                {t.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#065f46]">
                {t.subtitle}
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

        {/* コンテンツ */}
        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* ① Googleアカウント連携カード */}
          <div className="bg-[#e8fdf0] border-2 border-[#86efac] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-[#022c22] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#15803d]" />
                {t.googleSection}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                isGoogleLinked
                  ? 'bg-[#bbf7d0] text-[#022c22] border border-[#86efac]'
                  : 'bg-[#dcfce7] text-[#065f46]'
              }`}>
                {isGoogleLinked ? '連携中 ✓' : '未連携'}
              </span>
            </div>

            {isGoogleLinked ? (
              <div className="bg-[#dcfce7] p-3 rounded-xl border border-[#86efac] flex items-center justify-between">
                <div>
                  <span className="font-black text-[#022c22] block text-xs">
                    {profile.googleAccount?.name}
                  </span>
                  <span className="text-[10px] text-[#047857] font-bold">
                    {profile.googleAccount?.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="px-3 py-1.5 rounded-lg bg-[#bbf7d0] text-[#022c22] hover:bg-[#86efac] text-[11px] font-black border border-[#86efac] transition cursor-pointer"
                >
                  {t.unlink}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#4ade80] border border-[#86efac] text-[#022c22] font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:brightness-105"
              >
                <span className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#022c22] flex items-center justify-center font-black text-[11px] border border-[#86efac]">
                  G
                </span>
                <span>{isProcessing ? 'Google連携処理中…' : t.googleLogin}</span>
              </button>
            )}
          </div>

          {/* ② プレミアム特典一覧 */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-[#022c22] block">
              {t.premiumSection}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-[#e8fdf0] p-3 rounded-xl border border-[#86efac] flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-xs text-[#022c22]">{t.featureCloudSync}</h5>
                  <p className="text-[10px] text-[#065f46]">端末を変更しても記念日や記録が自動復活</p>
                </div>
              </div>

              <div className="bg-[#e8fdf0] p-3 rounded-xl border border-[#86efac] flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-xs text-[#022c22]">{t.featureUnlimitedAi}</h5>
                  <p className="text-[10px] text-[#065f46]">相棒があなた専用の言葉でいつでも励ます</p>
                </div>
              </div>

              <div className="bg-[#e8fdf0] p-3 rounded-xl border border-[#86efac] flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-xs text-[#022c22]">{t.featureDetailedCt}</h5>
                  <p className="text-[10px] text-[#065f46]">血圧・心拍・血管弾力の詳細回復グラフ</p>
                </div>
              </div>

              <div className="bg-[#e8fdf0] p-3 rounded-xl border border-[#86efac] flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-xs text-[#022c22]">{t.featureNoAds}</h5>
                  <p className="text-[10px] text-[#065f46]">静けさと癒やしのライトグリーンを極める</p>
                </div>
              </div>
            </div>
          </div>

          {/* ③ 料金プラン */}
          <div>
            <span className="text-[11px] font-black text-[#022c22] block mb-2">
              料金プランの選択
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                  selectedPlan === 'monthly'
                    ? 'bg-[#bbf7d0] border-[#15803d] shadow-md'
                    : 'bg-[#e8fdf0] border-[#86efac] hover:border-[#22c55e]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-[#022c22]">{t.monthlyPlan}</span>
                  {selectedPlan === 'monthly' && <span className="text-[#15803d] font-black">✓</span>}
                </div>
                <div className="text-lg font-black text-[#15803d]">{t.monthlyPrice}</div>
                <p className="text-[10px] text-[#065f46] mt-1">タバコ1箱未満の金額で一生の健康へ</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden ${
                  selectedPlan === 'lifetime'
                    ? 'bg-[#bbf7d0] border-[#15803d] shadow-md'
                    : 'bg-[#e8fdf0] border-[#86efac] hover:border-[#22c55e]'
                }`}
              >
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#22c55e] text-[#022c22] text-[9px] font-black rounded-full border border-[#86efac]">
                  {t.popularBadge}
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-[#022c22]">{t.lifetimePlan}</span>
                </div>
                <div className="text-lg font-black text-[#15803d]">{t.lifetimePrice}</div>
                <p className="text-[10px] text-[#065f46] mt-1">追加費用なしで永久にすべての機能が解放</p>
              </button>
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 sm:px-6 py-4 border-t-2 border-[#86efac] bg-[#bbf7d0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#065f46] text-center sm:text-left font-bold">
            <span>{t.currentStatus} </span>
            <strong className={isPremium ? 'text-[#15803d] font-black' : 'text-[#022c22] font-black'}>
              {isPremium ? t.statusPremium : t.statusFree}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#dcfce7] text-[#022c22] hover:bg-[#86efac] font-black text-xs transition cursor-pointer border border-[#86efac]"
            >
              {t.close}
            </button>

            {!isPremium ? (
              <button
                onClick={handleUpgradePremium}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#4ade80] hover:brightness-105 text-[#022c22] font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 border border-[#86efac]"
              >
                <Sparkles className="w-4 h-4 text-[#022c22]" />
                <span>{isProcessing ? '処理中…' : t.upgradeWithGoogle}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const updated = { ...profile, isPremium: false };
                  onUpdateProfile(updated);
                }}
                className="px-3 py-2 rounded-xl bg-[#dcfce7] text-[#065f46] text-[10px] hover:text-[#022c22] font-bold border border-[#86efac]"
              >
                （無料プランに戻す）
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
