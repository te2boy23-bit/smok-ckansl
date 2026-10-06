'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, ReplacementIdea } from '@/types';
import { MILESTONES, REPLACEMENT_IDEAS, PARTNER_TONE_MESSAGES } from '@/lib/constants';
import { X, Smartphone, Heart, Sparkles, RefreshCw, Award, Compass, CheckCircle2, Bell, Copy, Maximize2, Minimize2, Check, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LockScreenWidgetModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const LockScreenWidgetModal: React.FC<LockScreenWidgetModalProps> = ({
  profile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'notification' | 'standby' | 'widgy'>('notification');
  const [currentTime, setCurrentTime] = useState({ time: '12:00', seconds: '00', date: '9月30日 水曜日' });
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const [isCopied, setIsCopied] = useState(false);
  const [isStandbyActive, setIsStandbyActive] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}曜日`;
      setCurrentTime({ time: `${hours}:${minutes}`, seconds, date: dateStr });
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

  // ① 方法1: Web通知をテスト送信する
  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      alert('お使いのブラウザはWeb通知に対応していません');
      return;
    }

    let perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await Notification.requestPermission();
      setNotificationStatus(perm);
    }

    if (perm === 'granted') {
      try {
        const notif = new Notification(`🌱 すいすい（${profile.partnerName}♡）`, {
          body: `「${profile.name}くん、禁煙${totalDays}日目達成♡ ${greeting}」`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'suisui-test',
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#059669', '#84cc16', '#34d399'],
        });
      } catch (e) {
        console.error('Notification error:', e);
      }
    } else {
      alert('通知がブロックされています。ブラウザの設定から通知を許可してください');
    }
  };

  // ② 方法2: スタンバイ常時点灯モード起動
  const toggleStandby = async () => {
    if (!isStandbyActive) {
      setIsStandbyActive(true);
      if ('wakeLock' in navigator) {
        try {
          const lock = await (navigator as any).wakeLock.request('screen');
          setWakeLock(lock);
        } catch {
          // ignore
        }
      }
    } else {
      setIsStandbyActive(false);
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
      }
    }
  };

  // ③ 方法3: Widgy用API URLをコピー
  const widgetApiUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/widget?name=${encodeURIComponent(profile.name)}&partner=${encodeURIComponent(profile.partnerName)}&days=${totalDays}&saved=${savedMoney}&tone=${profile.partnerTone || 'deredere'}`
    : '';

  const handleCopyApiUrl = () => {
    navigator.clipboard.writeText(widgetApiUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#34d399', '#84cc16'],
      });
    } catch {
      // ignore
    }
  };

  // スタンバイ全画面表示中
  if (isStandbyActive) {
    return (
      <div className="fixed inset-0 z-50 bg-[#020a06] text-[#ecfdf5] flex flex-col justify-between p-6 sm:p-12 animate-fade-in select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-xs font-black text-[#86efac] tracking-widest uppercase">
              すいすい スタンバイ常時点灯
            </span>
          </div>
          <button
            onClick={toggleStandby}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#092b1b] hover:bg-[#0e3b26] text-[#86efac] border border-[#185334] text-xs font-bold transition cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            <span>終了する</span>
          </button>
        </div>

        {/* 巨大時計 ＆ 恋人メッセージ */}
        <div className="my-auto text-center space-y-4">
          <div className="text-xs sm:text-base font-semibold text-[#86efac] tracking-wide">
            {currentTime.date}
          </div>

          <div className="flex items-baseline justify-center gap-2 font-mono">
            <span className="text-7xl sm:text-9xl font-black tracking-tight text-[#ecfdf5]">
              {currentTime.time}
            </span>
            <span className="text-2xl sm:text-4xl font-bold text-[#10b981]">
              :{currentTime.seconds}
            </span>
          </div>

          <div className="max-w-xl mx-auto bg-[#072417]/90 border-2 border-[#1c643e] rounded-3xl p-5 shadow-2xl space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-black text-[#a3e635]">
              <Heart className="w-4 h-4 fill-[#a3e635]" />
              <span>{profile.partnerName} からの応援</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-[#ecfdf5] leading-relaxed">
              「{profile.name}くん、禁煙{totalDays}日目達成♡ {greeting}」
            </p>
            <div className="flex justify-center gap-4 text-xs font-semibold text-[#6ee7b7] pt-2 border-t border-[#124228]">
              <span>記念日まであと<strong className="text-[#a3e635] text-sm ml-1">{daysUntilNext}日</strong></span>
              <span>節約額<strong className="text-[#34d399] text-sm ml-1">+{savedMoney.toLocaleString()}円</strong></span>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-[#4d976f]">
          ※スリープ防止が有効です。スマホを充電スタンドに置いて横向きにすると最高のととのい時計になります。
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#092c1d] to-[#04150e] border-2 border-[#165a38] w-full max-w-2xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#14472c] bg-[#072417] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0c3924] rounded-2xl text-[#a3e635] border border-[#1a5f3b]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#ecfdf5]">
                テスト期間中のロック画面表示（3つの方法）
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#86efac]">
                アプリストア公開前でも、今すぐあなたのスマホでロック画面表示を体験できます！
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

        {/* 3つのタブ切り替え */}
        <div className="flex border-b border-[#123e27] bg-[#051c11] px-4 sm:px-6 pt-3 gap-1 sm:gap-2 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('notification')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'notification'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            🔔 ① ロック画面Web通知
          </button>
          <button
            onClick={() => setActiveTab('standby')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'standby'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            📱 ② 全画面スタンバイ常時点灯
          </button>
          <button
            onClick={() => setActiveTab('widgy')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'widgy'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            🧩 ③ Widgy無料ウィジェット連携
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* ① 方法1: Web通知 */}
          {activeTab === 'notification' && (
            <div className="space-y-4">
              <div className="bg-[#0b3320] border-2 border-[#1c643e] rounded-3xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#a3e635]" />
                    <h4 className="font-black text-sm text-[#ecfdf5]">
                      ロック画面に相棒からの通知を届ける
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    notificationStatus === 'granted'
                      ? 'bg-[#0f4428] text-[#34d399] border border-[#226e43]'
                      : 'bg-[#072417] text-[#86efac]'
                  }`}>
                    {notificationStatus === 'granted' ? '通知許可済み ✓' : '未設定'}
                  </span>
                </div>

                <p className="text-xs text-[#a7f3d0] leading-relaxed">
                  下のボタンを押すと、あなたのスマホやPCにテスト通知が飛びます。
                  スマホをスリープさせて画面をつけた時、<strong>ロック画面に相棒からの甘い応援メッセージ</strong>が表示されます！
                </p>

                {/* 通知プレビューカード */}
                <div className="bg-[#051c11] border border-[#195a38] rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#6ee7b7]">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                      🌱 すいすい（{profile.partnerName}♡）
                    </span>
                    <span>たった今</span>
                  </div>
                  <p className="text-xs font-semibold text-[#ecfdf5]">
                    「{profile.name}くん、禁煙{totalDays}日目達成♡ {greeting}」
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#059669] to-[#84cc16] hover:brightness-110 active:scale-95 text-[#04140d] font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4 stroke-[3]" />
                  <span>今すぐロック画面に通知をテスト送信する！</span>
                </button>
              </div>

              <div className="bg-[#072417] p-4 rounded-2xl border border-[#14472c] space-y-2 text-[#86efac]">
                <h5 className="font-bold text-[#ecfdf5]">📱 iPhoneでロック画面通知を確実に受けるコツ</h5>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Safari下部の共有ボタンから「<strong>ホーム画面に追加</strong>」してアプリ化します</li>
                  <li>ホーム画面に追加されたアプリアイコンから開いて、通知を「許可」します</li>
                  <li>これでiOS16.4以降なら、ロック画面にメッセージが届くようになります！</li>
                </ol>
              </div>
            </div>
          )}

          {/* ② 方法2: スタンバイ常時点灯 */}
          {activeTab === 'standby' && (
            <div className="space-y-4">
              <div className="bg-[#0b3320] border-2 border-[#1c643e] rounded-3xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-[#a3e635]" />
                  <h4 className="font-black text-sm text-[#ecfdf5]">
                    デスク置き専用！常時点灯スタンバイクロック
                  </h4>
                </div>

                <p className="text-xs text-[#a7f3d0] leading-relaxed">
                  スマホの画面が自動で暗くならないスリープ防止モードです。
                  机の上や充電スタンドに置いて、<strong>「禁煙時計 ＆ 恋人の応援」を常時光らせておく</strong>ことができます。
                </p>

                <button
                  type="button"
                  onClick={toggleStandby}
                  className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] active:scale-95 text-[#04140d] font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>常時点灯スタンバイモードを起動する（全画面）</span>
                </button>
              </div>

              <div className="bg-[#072417] p-4 rounded-2xl border border-[#14472c] text-[#86efac] space-y-1.5">
                <span className="font-bold text-[#ecfdf5] block">おすすめの使い方:</span>
                <p className="text-[11px] leading-relaxed">
                  仕事中や勉強中、タバコを吸いたくなりそうな時にスマホを横向きに置いておくだけで、リアルタイムに進む秒数と恋人の言葉があなたの盾になります！
                </p>
              </div>
            </div>
          )}

          {/* ③ 方法3: Widgy連携 */}
          {activeTab === 'widgy' && (
            <div className="space-y-4">
              <div className="bg-[#0b3320] border-2 border-[#1c643e] rounded-3xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧩</span>
                  <h4 className="font-black text-sm text-[#ecfdf5]">
                    無料アプリ「Widgy」で本物の四角いウィジェットを置く
                  </h4>
                </div>

                <p className="text-xs text-[#a7f3d0] leading-relaxed">
                  App Storeで無料配信されている大人気ウィジェットアプリ「Widgy」を使うと、
                  <strong>ストア審査を待たずに、あなたのiPhoneのホーム画面やロック画面に本物のウィジェット</strong>を常駐させられます！
                </p>

                {/* 専用API URL */}
                <div>
                  <span className="text-[11px] font-bold text-[#86efac] block mb-1">
                    あなた専用のウィジェットデータ連携URL
                  </span>
                  <div className="bg-[#051c11] border border-[#174f32] rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[#34d399] truncate flex-1">
                      {widgetApiUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyApiUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'コピー完了！' : 'URLコピー'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3ステップ手順 */}
              <div className="bg-[#072417] p-4 rounded-2xl border border-[#14472c] space-y-2 text-[#86efac]">
                <h5 className="font-bold text-[#ecfdf5]">3ステップでiPhoneにウィジェットを置く方法</h5>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                  <li>App Storeで「<strong>Widgy Widgets</strong>」（無料）をインストール</li>
                  <li>Widgyを開き、新規作成 ➔「データソース」に上のコピーしたURLを貼り付け</li>
                  <li>iPhoneのホーム画面またはロック画面を長押しして「＋」からWidgyを追加！</li>
                </ol>
                <p className="text-[10px] text-[#6ee7b7] pt-1 border-t border-[#123e27]">
                  ※これでテスト期間中でも、リアルタイムに禁煙日数や恋人メッセージが反映されます！
                </p>
              </div>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#133f27] bg-[#061d13] flex justify-end">
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
