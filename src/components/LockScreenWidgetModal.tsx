'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, ReplacementIdea } from '@/types';
import { MILESTONES, REPLACEMENT_IDEAS, PARTNER_TONE_MESSAGES } from '@/lib/constants';
import { X, Smartphone, Heart, Sparkles, RefreshCw, Award, Compass, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LockScreenWidgetModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const LockScreenWidgetModal: React.FC<LockScreenWidgetModalProps> = ({
  profile,
  onClose,
}) => {
  const [widgetType, setWidgetType] = useState<'lover' | 'countdown' | 'roulette'>('lover');
  const [currentTime, setCurrentTime] = useState({ time: '12:00', date: '9月30日 水曜日' });
  const [rouletteIdea, setRouletteIdea] = useState<ReplacementIdea>(REPLACEMENT_IDEAS[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}曜日`;
      setCurrentTime({ time: `${hours}:${minutes}`, date: dateStr });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const start = new Date(profile.startDate).getTime();
  const diffMs = Math.max(0, Date.now() - start);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

  const nextMilestone = MILESTONES.find((m) => m.days > totalDays) || MILESTONES[MILESTONES.length - 1];
  const daysUntilNext = Math.max(0, nextMilestone.days - totalDays);

  const singlePrice = Math.round(profile.pricePerPack / profile.cigarettesPerPack);
  const savedCigarettes = Math.floor((diffMs / (1000 * 60 * 60 * 24)) * profile.dailyCigarettesBefore);
  const savedMoney = savedCigarettes * singlePrice;

  const tone = profile.partnerTone || 'deredere';
  const toneGreetings = PARTNER_TONE_MESSAGES[tone]?.homeGreeting || PARTNER_TONE_MESSAGES.deredere.homeGreeting;
  const greeting = toneGreetings[0];

  const spinRoulette = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * REPLACEMENT_IDEAS.length);
      setRouletteIdea(REPLACEMENT_IDEAS[randomIdx]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsSpinning(false);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#059669', '#84cc16', '#34d399'],
          });
        } catch {
          // ignore
        }
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#092c1d] to-[#04150e] border-2 border-[#165a38] w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* モーダルヘッダー */}
        <div className="px-6 py-4 border-b border-[#14472c] bg-[#072417] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0c3924] rounded-2xl text-[#a3e635] border border-[#1a5f3b]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#ecfdf5]">
                ウィジェット ＆ ロック画面設定
              </h3>
              <p className="text-[11px] text-[#86efac]">
                アプリを開かなくても相棒が励ましてくれる3タイプのウィジェット
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

        {/* 3タイプのタブ切り替え */}
        <div className="flex border-b border-[#123e27] bg-[#051c11] px-6 pt-3 gap-2 text-xs">
          <button
            onClick={() => setWidgetType('lover')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              widgetType === 'lover'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            💚 ① 恋人風あまあま応援
          </button>
          <button
            onClick={() => setWidgetType('countdown')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              widgetType === 'countdown'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            🎁 ② ご褒美カウントダウン
          </button>
          <button
            onClick={() => setWidgetType('roulette')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              widgetType === 'roulette'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            🎯 ③ 即効代案ルーレット
          </button>
        </div>

        {/* プレビューコンテンツ */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* スマホ画面プレビューフレーム */}
          <div className="mx-auto max-w-sm bg-gradient-to-b from-[#0a2f1e] via-[#061b11] to-[#04140d] border-4 border-[#1c5f3e] rounded-[40px] p-6 shadow-2xl relative overflow-hidden text-[#ecfdf5]">
            {/* ノッチ */}
            <div className="w-28 h-4 bg-[#031109] rounded-full mx-auto mb-5 border border-[#14482c] flex items-center justify-center">
              <span className="text-[9px] text-[#34d399] font-bold">すいすいウィジェット</span>
            </div>

            {/* ロック画面の時計 */}
            <div className="text-center mb-5">
              <div className="text-xs font-semibold text-[#86efac] mb-1">{currentTime.date}</div>
              <div className="text-4xl font-black tracking-tight text-[#ecfdf5]">{currentTime.time}</div>
            </div>

            {/* ① 恋人風あまあま応援ウィジェット */}
            {widgetType === 'lover' && (
              <div className="bg-[#0b3320]/95 backdrop-blur-md border border-[#21734a] rounded-3xl p-4 shadow-xl space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center text-[#04140d] text-xs font-black">
                      ♥
                    </span>
                    <span className="text-xs font-black text-[#a7f3d0]">
                      {profile.partnerName} からのメッセージ
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6ee7b7]">今すぐ届いた</span>
                </div>
                <p className="text-xs text-[#ecfdf5] font-semibold bg-[#072115] p-3 rounded-2xl border border-[#16482d] leading-relaxed">
                  「{profile.name}くん、禁煙{totalDays}日目おめでとう♡ {greeting}」
                </p>
                <div className="flex justify-between items-center text-[10px] text-[#86efac] pt-1">
                  <span>記念日まであと<strong>{daysUntilNext}日</strong></span>
                  <span className="text-[#a3e635] font-black">節約+{savedMoney.toLocaleString()}円</span>
                </div>
              </div>
            )}

            {/* ② ご褒美カウントダウンウィジェット */}
            {widgetType === 'countdown' && (
              <div className="bg-[#0b3320]/95 backdrop-blur-md border border-[#21734a] rounded-3xl p-4 shadow-xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#a3e635] flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> ご褒美カウントダウン
                  </span>
                  <span className="text-[10px] bg-[#0e3b25] text-[#34d399] px-2 py-0.5 rounded-full border border-[#1b5b3a]">
                    目標達成中
                  </span>
                </div>
                <div className="bg-[#072115] p-3 rounded-2xl border border-[#16482d]">
                  <span className="text-[10px] text-[#86efac] block">目標ご褒美</span>
                  <h4 className="text-sm font-black text-[#ecfdf5]">{profile.targetReward || '極上サウナ'}</h4>
                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#133e27]">
                    <span className="text-[10px] text-[#6ee7b7]">禁煙で浮いた金額</span>
                    <span className="text-base font-black text-[#34d399]">+{savedMoney.toLocaleString()}円</span>
                  </div>
                </div>
              </div>
            )}

            {/* ③ 即効代案ルーレットウィジェット */}
            {widgetType === 'roulette' && (
              <div className="bg-[#0b3320]/95 backdrop-blur-md border border-[#21734a] rounded-3xl p-4 shadow-xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#a3e635] flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> 吸いたい時の即効代案
                  </span>
                  <span className="text-[10px] text-[#6ee7b7]">ワンタップ起動</span>
                </div>
                <div className="bg-[#072115] p-3.5 rounded-2xl border border-[#16482d] text-center">
                  <span className="text-2xl block mb-1">🌿</span>
                  <h4 className="text-xs font-black text-[#ecfdf5]">{rouletteIdea.title}</h4>
                  <p className="text-[10px] text-[#86efac] mt-1 line-clamp-2">{rouletteIdea.description}</p>
                </div>
                <button
                  type="button"
                  onClick={spinRoulette}
                  disabled={isSpinning}
                  className="w-full py-2 bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'ルーレット回転中…' : '代案ルーレットを回す！'}</span>
                </button>
              </div>
            )}

            {/* ホームバー */}
            <div className="w-32 h-1 bg-[#185334] rounded-full mx-auto mt-6" />
          </div>

          {/* スマホへの設置方法ガイド */}
          <div className="bg-[#072517] p-4 rounded-2xl border border-[#14472c] space-y-2 text-[#86efac]">
            <h4 className="font-bold text-[#ecfdf5] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              スマホのホーム画面・ロック画面に設置する手順
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
              <li>ブラウザの「共有」または「メニュー」から「<strong>ホーム画面に追加</strong>」をタップ</li>
              <li>追加したアプリアイコンから、いつでもワンタップで代案と記念日を確認できます</li>
              <li>iOS16以降 / Android12以降では、常時点灯ディスプレイ対応のロック画面固定も可能です</li>
            </ol>
          </div>
        </div>

        {/* モーダルフッター */}
        <div className="px-6 py-4 border-t border-[#133f27] bg-[#061d13] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black text-xs transition cursor-pointer shadow-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
