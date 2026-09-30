'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { MILESTONES, PARTNER_TONE_MESSAGES } from '@/lib/constants';
import { X, Smartphone, Heart, Sparkles, Bell, Copy, Maximize2, Minimize2, Check, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LockScreenWidgetModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const LockScreenWidgetModal: React.FC<LockScreenWidgetModalProps> = ({
  profile,
  onClose,
}) => {
  const [currentTime, setCurrentTime] = useState({ time: '12:00', seconds: '00', date: '9月30日 水曜日' });
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const [isCopied, setIsCopied] = useState(false);
  const [isStandbyActive, setIsStandbyActive] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'notification' | 'widgy'>('preview');

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

  // ① ロック画面Web通知をテスト送信
  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      alert('お使いのブラウザはWeb通知に対応していません。Safariでホーム画面に追加してからお試しください。');
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
          icon: '/logo.png?v=2',
          badge: '/logo.png?v=2',
          tag: 'suisui-lock-alert',
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#4ade80', '#10b981'],
        });
      } catch (e) {
        console.error('Notification error:', e);
      }
    } else {
      alert('通知がブロックされています。ブラウザの設定から通知を許可してください。');
    }
  };

  // ② スタンバイ全画面モード
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

  // ③ Widgy用URLコピー
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
        colors: ['#22c55e', '#4ade80', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  // スタンバイ全画面表示中
  if (isStandbyActive) {
    return (
      <div className="fixed inset-0 z-50 bg-[#062013] text-[#f0fdf4] flex flex-col justify-between p-6 sm:p-12 animate-fade-in select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22c55e] animate-ping" />
            <span className="text-xs font-black text-[#86efac] tracking-widest uppercase">
              すいすい スタンバイ常時点灯モード
            </span>
          </div>
          <button
            onClick={toggleStandby}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f442b] hover:bg-[#155838] text-[#bbf7d0] border border-[#227047] text-xs font-bold transition cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            <span>終了する</span>
          </button>
        </div>

        <div className="my-auto text-center space-y-4">
          <div className="text-sm sm:text-lg font-semibold text-[#86efac] tracking-wide">
            {currentTime.date}
          </div>

          <div className="flex items-baseline justify-center gap-2 font-mono">
            <span className="text-7xl sm:text-9xl font-black tracking-tight text-[#f0fdf4]">
              {currentTime.time}
            </span>
            <span className="text-2xl sm:text-4xl font-bold text-[#4ade80]">
              :{currentTime.seconds}
            </span>
          </div>

          <div className="max-w-xl mx-auto bg-[#0d3b25]/90 border-2 border-[#227047] rounded-3xl p-5 shadow-2xl space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-black text-[#4ade80]">
              <img src="/logo.png?v=2" alt="logo" className="w-5 h-5 rounded-full" />
              <span>{profile.partnerName} からの応援</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-[#f0fdf4] leading-relaxed">
              「{profile.name}くん、禁煙{totalDays}日目達成♡ {greeting}」
            </p>
            <div className="flex justify-center gap-4 text-xs font-semibold text-[#bbf7d0] pt-2 border-t border-[#185536]">
              <span>記念日まであと<strong className="text-[#4ade80] text-sm ml-1">{daysUntilNext}日</strong></span>
              <span>節約額<strong className="text-[#34d399] text-sm ml-1">+{savedMoney.toLocaleString()}円</strong></span>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-[#86efac]">
          ※スリープ防止が有効です。スマホを充電スタンドに置いて横向きにすると最高のととのい時計になります。
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#0a2f1d] via-[#082819] to-[#051c11] border-2 border-[#206e46] w-full max-w-2xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#185536] bg-[#0c3924] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png?v=2"
              alt="すいすいロゴ"
              className="w-10 h-10 rounded-2xl object-cover shadow-md border-2 border-[#34d399]/60 shrink-0"
            />
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#f0fdf4]">
                ロック画面＆常時表示ウィジェット
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#bbf7d0]">
                スマホを開くたびに相棒の応援と記念日が自動表示！
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

        {/* タブ切り替え */}
        <div className="flex border-b border-[#185536] bg-[#092618] px-4 sm:px-6 pt-3 gap-1 sm:gap-2 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'preview'
                ? 'border-[#22c55e] text-[#4ade80]'
                : 'border-transparent text-[#86efac] hover:text-[#bbf7d0]'
            }`}
          >
            📱 ① ロック画面プレビュー
          </button>
          <button
            onClick={() => setActiveTab('notification')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'notification'
                ? 'border-[#22c55e] text-[#4ade80]'
                : 'border-transparent text-[#86efac] hover:text-[#bbf7d0]'
            }`}
          >
            🔔 ② 本物の通知をテスト
          </button>
          <button
            onClick={() => setActiveTab('widgy')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'widgy'
                ? 'border-[#22c55e] text-[#4ade80]'
                : 'border-transparent text-[#86efac] hover:text-[#bbf7d0]'
            }`}
          >
            🧩 ③ Widgyウィジェット設置
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* ① ロック画面モックアッププレビュー（新ロゴ・新色） */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="text-center text-xs text-[#86efac]">
                あなたのスマホのロック画面に常駐するライブ通知のイメージ
              </div>

              {/* スマホ画面フレーム */}
              <div className="mx-auto max-w-xs sm:max-w-sm bg-gradient-to-b from-[#0f442b] via-[#092d1c] to-[#062013] border-4 border-[#227047] rounded-[42px] p-5 sm:p-6 shadow-2xl relative overflow-hidden text-[#f0fdf4]">
                {/* ノッチ / ダイナミックアイランド */}
                <div className="w-28 h-4 bg-[#03140c] rounded-full mx-auto mb-4 border border-[#1b5e3c] flex items-center justify-center gap-1.5">
                  <img src="/logo.png?v=2" alt="logo" className="w-2.5 h-2.5 rounded-full" />
                  <span className="text-[9px] text-[#4ade80] font-bold">すいすい</span>
                </div>

                {/* 時計 */}
                <div className="text-center mb-5">
                  <div className="text-xs font-semibold text-[#86efac] mb-0.5">
                    {currentTime.date}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#f0fdf4]">
                    {currentTime.time}
                  </div>
                </div>

                {/* 恋人からのライブ通知カード（新ロゴ入り！） */}
                <div className="bg-[#11492e]/95 backdrop-blur-md border border-[#277e50] rounded-3xl p-3.5 shadow-xl space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="/logo.png?v=2"
                        alt="すいすいロゴ"
                        className="w-6 h-6 rounded-xl object-cover shadow border border-[#34d399]/60 shrink-0"
                      />
                      <span className="text-xs font-black text-[#f0fdf4]">
                        {profile.partnerName} からのメッセージ
                      </span>
                    </div>
                    <span className="text-[10px] text-[#86efac]">たった今</span>
                  </div>

                  <p className="text-xs text-[#f0fdf4] font-semibold bg-[#0a311f] p-2.5 rounded-2xl border border-[#1a5b3a] leading-relaxed">
                    「{profile.name}くん、禁煙{totalDays}日目達成♡ {greeting}」
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="bg-[#0e3f28] py-1.5 px-2 rounded-xl border border-[#1f6b43]">
                      <span className="text-[#86efac] block">次の記念日</span>
                      <strong className="text-[#4ade80] font-black">あと{daysUntilNext}日</strong>
                    </div>
                    <div className="bg-[#0e3f28] py-1.5 px-2 rounded-xl border border-[#1f6b43]">
                      <span className="text-[#86efac] block">節約タバコ代</span>
                      <strong className="text-[#34d399] font-black">+{savedMoney.toLocaleString()}円</strong>
                    </div>
                  </div>
                </div>

                {/* スタンバイ起動ショートカット */}
                <button
                  type="button"
                  onClick={toggleStandby}
                  className="w-full py-2 bg-[#0e3f28] hover:bg-[#145638] border border-[#227047] rounded-xl text-center font-bold text-[11px] text-[#86efac] hover:text-[#f0fdf4] flex items-center justify-center gap-1.5 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#4ade80]" />
                  <span>この画面を全画面で常時点灯する</span>
                </button>

                {/* ホームバー */}
                <div className="w-28 h-1 bg-[#1e6640] rounded-full mx-auto mt-4" />
              </div>

              {/* クイックアクション */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#4ade80] text-[#052e16] font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-4 h-4 text-[#052e16]" />
                  <span>自分のスマホのロック画面に通知を送信</span>
                </button>
              </div>
            </div>
          )}

          {/* ② 本物の通知をテスト */}
          {activeTab === 'notification' && (
            <div className="space-y-4">
              <div className="bg-[#0e3b26] border-2 border-[#227047] rounded-3xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#4ade80]" />
                    <h4 className="font-black text-sm text-[#f0fdf4]">
                      本物のロック画面通知を送る
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    notificationStatus === 'granted'
                      ? 'bg-[#124d32] text-[#34d399] border border-[#277e50]'
                      : 'bg-[#092618] text-[#86efac]'
                  }`}>
                    {notificationStatus === 'granted' ? '通知許可済み ✓' : '未許可'}
                  </span>
                </div>

                <p className="text-xs text-[#bbf7d0] leading-relaxed">
                  下のボタンを押すと、あなたのスマホやPCにテスト通知が飛びます。
                  スマホをスリープさせて画面をつけた時、<strong>ロック画面に相棒からの応援メッセージ</strong>が表示されます！
                </p>

                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#4ade80] hover:brightness-110 active:scale-95 text-[#052e16] font-black text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4 stroke-[3]" />
                  <span>今すぐロック画面に通知をテスト送信する！</span>
                </button>
              </div>

              <div className="bg-[#092618] p-4 rounded-2xl border border-[#185536] space-y-2 text-[#86efac]">
                <h5 className="font-bold text-[#f0fdf4]">📱 iPhoneでロック画面通知を確実に受けるコツ</h5>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Safari下部の共有ボタンから「<strong>ホーム画面に追加</strong>」してアプリ化します</li>
                  <li>ホーム画面に追加されたアプリアイコンから開いて、通知を「許可」します</li>
                  <li>これでiOS16.4以降なら、ロック画面にメッセージが届くようになります！</li>
                </ol>
              </div>
            </div>
          )}

          {/* ③ Widgyウィジェット設置 */}
          {activeTab === 'widgy' && (
            <div className="space-y-4">
              <div className="bg-[#0e3b26] border-2 border-[#227047] rounded-3xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧩</span>
                  <h4 className="font-black text-sm text-[#f0fdf4]">
                    無料アプリ「Widgy」で本物の四角いウィジェットを置く
                  </h4>
                </div>

                <p className="text-xs text-[#bbf7d0] leading-relaxed">
                  App Storeで無料配信されている「Widgy」を使うと、
                  <strong>ストア審査を待たずに、あなたのiPhoneのホーム画面やロック画面に本物のウィジェット</strong>を常駐させられます！
                </p>

                <div>
                  <span className="text-[11px] font-bold text-[#86efac] block mb-1">
                    あなた専用のウィジェットデータ連携URL
                  </span>
                  <div className="bg-[#062013] border border-[#1b5e3c] rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[#4ade80] truncate flex-1">
                      {widgetApiUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyApiUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-[#052e16] font-black text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'コピー完了！' : 'URLコピー'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#092618] p-4 rounded-2xl border border-[#185536] space-y-2 text-[#86efac]">
                <h5 className="font-bold text-[#f0fdf4]">3ステップでiPhoneにウィジェットを置く方法</h5>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                  <li>App Storeで「<strong>Widgy Widgets</strong>」（無料）をインストール</li>
                  <li>Widgyを開き、新規作成 ➔「データソース」に上のコピーしたURLを貼り付け</li>
                  <li>iPhoneのホーム画面またはロック画面を長押しして「＋」からWidgyを追加！</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#185536] bg-[#0c3924] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-[#052e16] font-black text-xs transition cursor-pointer shadow-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
