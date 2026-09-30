'use client';

import React, { useState } from 'react';
import { UserProfile, AppLanguage, GoogleAccount } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';
import { X, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleAuthAndPremiumModalProps {
  profile: UserProfile;
  language?: AppLanguage;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export function GoogleAuthAndPremiumModal({
  profile,
  language = 'ja',
  onUpdateProfile,
  onClose,
}: GoogleAuthAndPremiumModalProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ja;
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isProcessing, setIsProcessing] = useState(false);

  const isGoogleLinked = !!profile.googleAccount;
  const isPremium = !!profile.isPremium;

  const handleGoogleLogin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockGoogleUser: GoogleAccount = {
        name: profile.name || 'Google User',
        email: `${(profile.name || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        avatarUrl: '/logo.png?v=2',
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
          colors: ['#22c55e', '#4ade80', '#10b981'],
        });
      } catch {
        // ignore
      }
    }, 600);
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
      };
      onUpdateProfile(updated);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#4ade80', '#10b981', '#86efac'],
        });
      } catch {
        // ignore
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#0a2f1d] via-[#082819] to-[#051c11] border-2 border-[#206e46] w-full max-w-xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#185536] bg-[#0c3924] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png?v=2"
              alt="すいすい"
              className="w-10 h-10 rounded-2xl object-cover shadow-md border-2 border-[#34d399]/60 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-[#f0fdf4]">
                  {t.premiumTitle}
                </h3>
                {isPremium && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#22c55e] text-[#052e16]">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#bbf7d0]">
                {t.premiumSub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#86efac] hover:bg-[#124a2e] hover:text-[#f0fdf4] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* スクロールコンテンツ */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* ① Googleアカウント連携 */}
          <div className="bg-[#0e3b26] border border-[#206e46] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#f0fdf4]">
                    Googleアカウント連携
                  </h4>
                  <span className="text-[10px] text-[#86efac] block">
                    {isGoogleLinked ? 'クラウド自動バックアップ有効' : '将来の決済・デバイス同期用'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isGoogleLinked
                  ? 'bg-[#124d32] text-[#34d399] border-[#277e50]'
                  : 'bg-[#092618] text-[#86efac] border-[#185536]'
              }`}>
                {isGoogleLinked ? '連携中 ✓' : '未連携'}
              </span>
            </div>

            {isGoogleLinked ? (
              <div className="bg-[#092618] p-3 rounded-xl border border-[#185536] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#f0fdf4] block text-xs">
                    {profile.googleAccount?.name}
                  </span>
                  <span className="text-[10px] text-[#86efac]">
                    {profile.googleAccount?.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="px-3 py-1.5 rounded-lg bg-[#0e3f28] text-[#bbf7d0] hover:text-[#f0fdf4] text-[11px] font-bold border border-[#206e46] transition cursor-pointer"
                >
                  解除
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-[#124d32] hover:bg-[#165a3b] border border-[#277e50] text-[#f0fdf4] font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-[#052e16] flex items-center justify-center font-black text-[11px]">
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
              <div className="bg-[#0e3b26] p-3 rounded-xl border border-[#206e46] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#f0fdf4]">{t.featureCloudSync}</h5>
                  <p className="text-[10px] text-[#86efac]">端末を変更しても記念日や記録が自動復活</p>
                </div>
              </div>

              <div className="bg-[#0e3b26] p-3 rounded-xl border border-[#206e46] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#f0fdf4]">{t.featureUnlimitedAi}</h5>
                  <p className="text-[10px] text-[#86efac]">相棒があなた専用の言葉でいつでも励ます</p>
                </div>
              </div>

              <div className="bg-[#0e3b26] p-3 rounded-xl border border-[#206e46] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#f0fdf4]">{t.featureDetailedCt}</h5>
                  <p className="text-[10px] text-[#86efac]">血圧・心拍・血管弾力の詳細回復グラフ</p>
                </div>
              </div>

              <div className="bg-[#0e3b26] p-3 rounded-xl border border-[#206e46] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-[#f0fdf4]">{t.featureNoAds}</h5>
                  <p className="text-[10px] text-[#86efac]">静けさと癒やしのボタニカルグリーンを極める</p>
                </div>
              </div>
            </div>
          </div>

          {/* ③ 料金プラン */}
          <div>
            <span className="text-[11px] font-bold text-[#86efac] block mb-2">
              料金プランの選択
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  selectedPlan === 'monthly'
                    ? 'bg-[#124d32] border-[#4ade80] shadow-lg'
                    : 'bg-[#0e3b26] border-[#206e46] hover:border-[#277e50]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#f0fdf4]">{t.monthlyPlan}</span>
                  {selectedPlan === 'monthly' && <span className="text-[#4ade80] font-black">✓</span>}
                </div>
                <div className="text-lg font-black text-[#4ade80]">{t.monthlyPrice}</div>
                <p className="text-[10px] text-[#86efac] mt-1">タバコ1箱未満の金額で一生の健康へ</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                  selectedPlan === 'lifetime'
                    ? 'bg-[#124d32] border-[#22c55e] shadow-lg'
                    : 'bg-[#0e3b26] border-[#206e46] hover:border-[#277e50]'
                }`}
              >
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#4ade80] text-[#052e16] text-[9px] font-black rounded-full">
                  {t.popularBadge}
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#f0fdf4]">{t.lifetimePlan}</span>
                </div>
                <div className="text-lg font-black text-[#34d399]">{t.lifetimePrice}</div>
                <p className="text-[10px] text-[#86efac] mt-1">追加費用なしで永久にすべての機能が解放</p>
              </button>
            </div>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#185536] bg-[#0c3924] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#86efac] text-center sm:text-left">
            <span>{t.currentStatus} </span>
            <strong className={isPremium ? 'text-[#4ade80]' : 'text-[#f0fdf4]'}>
              {isPremium ? t.statusPremium : t.statusFree}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0e3f28] text-[#bbf7d0] hover:text-[#f0fdf4] font-bold text-xs transition cursor-pointer"
            >
              {t.close}
            </button>

            {!isPremium ? (
              <button
                onClick={handleUpgradePremium}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#4ade80] hover:brightness-110 text-[#052e16] font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#052e16]" />
                <span>{isProcessing ? '処理中…' : t.upgradeWithGoogle}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const updated = { ...profile, isPremium: false };
                  onUpdateProfile(updated);
                }}
                className="px-3 py-2 rounded-xl bg-[#0e3f28] text-[#86efac] text-[10px] hover:text-[#f0fdf4]"
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
