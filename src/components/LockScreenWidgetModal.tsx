'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { MILESTONES } from '@/lib/constants';
import { X, Smartphone, Heart, Clock, Coins, Sparkles, Bell, ExternalLink, ShieldCheck, Maximize2 } from 'lucide-react';

interface LockScreenWidgetModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const LockScreenWidgetModal: React.FC<LockScreenWidgetModalProps> = ({
  profile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'lockscreen' | 'widget' | 'guide'>('lockscreen');
  const [currentTime, setCurrentTime] = useState({ time: '12:00', date: '9月30日 水曜日' });
  const [isFullScreenDemo, setIsFullScreenDemo] = useState(false);

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
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  const nextMilestone = MILESTONES.find((m) => m.days > totalDays) || MILESTONES[MILESTONES.length - 1];
  const daysUntilNext = Math.max(0, nextMilestone.days - totalDays);

  const singlePrice = Math.round((profile.pricePerPack || 600) / (profile.cigarettesPerPack || 20));
  const savedCigarettes = Math.floor((diffMs / (1000 * 60 * 60 * 24)) * profile.dailyCigarettesBefore);
  const savedMoney = savedCigarettes * singlePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d08]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#09291b] to-[#051a10] border-2 border-[#165033] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* モーダルヘッダー */}
        <div className="px-6 py-4 border-b border-[#144229] flex items-center justify-between bg-[#061d13]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0c3823] rounded-xl text-[#a3e635] border border-[#1b5837]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#ecfdf5]">
                ロック画面＆常時表示ウィジェット
              </h3>
              <p className="text-[11px] text-[#86efac]">
                スマホを開くたびに恋人の応援と禁煙記念日を自動表示！
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

        {/* タブナビゲーション */}
        <div className="flex border-b border-[#123d26] bg-[#071f14] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('lockscreen')}
            className={`pb-3 px-3 text-xs font-black border-b-2 transition cursor-pointer ${
              activeTab === 'lockscreen'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            🔒 ロック画面ライブ通知
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`pb-3 px-3 text-xs font-black border-b-2 transition cursor-pointer ${
              activeTab === 'widget'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            📱 ホーム画面ウィジェット
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-black border-b-2 transition cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            ⚙️ 設定ガイド（iPhone / Android）
          </button>
        </div>

        {/* モーダルコンテンツ */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'lockscreen' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#86efac]">
                <span>スマホのロック画面に常駐するライブアクティビティ風プレビュー</span>
                <span className="font-bold text-[#a3e635]">リアルタイム連動中</span>
              </div>

              {/* スマホ画面モックアップ */}
              <div className="mx-auto max-w-sm bg-gradient-to-b from-[#0a2f1e] via-[#061b11] to-[#04140d] border-4 border-[#1c5f3e] rounded-[40px] p-6 shadow-2xl relative overflow-hidden text-[#ecfdf5]">
                {/* ノッチ / ダイナミックアイランド */}
                <div className="w-28 h-4 bg-[#031109] rounded-full mx-auto mb-6 border border-[#14482c] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]/50 mr-2" />
                  <span className="text-[9px] text-[#34d399] font-bold">Smok-Ckansl</span>
                </div>

                {/* 時計 */}
                <div className="text-center mb-6">
                  <div className="text-xs font-semibold text-[#86efac] mb-1">
                    {currentTime.date}
                  </div>
                  <div className="text-5xl font-black tracking-tight text-[#ecfdf5]">
                    {currentTime.time}
                  </div>
                </div>

                {/* 恋人からのライブ通知カード */}
                <div className="bg-[#0b3320]/90 backdrop-blur-md border border-[#21734a] rounded-3xl p-4 shadow-lg mb-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center text-[#071c12] text-xs font-bold">
                        ♥
                      </div>
                      <span className="text-xs font-black text-[#a7f3d0]">
                        {profile.partnerName} からのメッセージ
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6ee7b7] font-mono">今</span>
                  </div>

                  <p className="text-xs text-[#ecfdf5] leading-relaxed font-semibold bg-[#072115] p-3 rounded-2xl border border-[#16482d]">
                    「{profile.name}くん、禁煙{totalDays}日目おめでとう♡ あと{daysUntilNext}日で{nextMilestone.title}だよ！ずっとそばで見てるからね♡」
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] pt-1">
                    <div className="bg-[#0e3b25] py-2 px-1 rounded-xl border border-[#1d633d]">
                      <span className="text-[9px] text-[#86efac] block">継続時間</span>
                      <strong className="text-[#a3e635] font-black">{totalDays}日 {hours}時間</strong>
                    </div>
                    <div className="bg-[#0e3b25] py-2 px-1 rounded-xl border border-[#1d633d]">
                      <span className="text-[9px] text-[#86efac] block">浮いたお小遣い</span>
                      <strong className="text-[#34d399] font-black">{savedMoney.toLocaleString()}円</strong>
                    </div>
                  </div>
                </div>

                {/* ロック画面下部アイコン */}
                <div className="flex justify-between items-center px-4 pt-2 text-[#6ee7b7]">
                  <div className="w-10 h-10 rounded-full bg-[#0a2919] border border-[#16482e] flex items-center justify-center text-xs">
                    🔦
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0a2919] border border-[#16482e] flex items-center justify-center text-xs">
                    📷
                  </div>
                </div>

                {/* ホームバー */}
                <div className="w-32 h-1 bg-[#185334] rounded-full mx-auto mt-4" />
              </div>

              <div className="text-center">
                <p className="text-xs text-[#86efac] mb-2">
                  この画面をそのまま常時点灯の置時計としてもご活用いただけます
                </p>
              </div>
            </div>
          )}

          {activeTab === 'widget' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-[#86efac] mb-3">
                  中型ウィジェット（ホーム画面 4×2 サイズ）
                </h4>
                <div className="bg-gradient-to-r from-[#0d3823] to-[#072417] p-5 rounded-3xl border-2 border-[#1e6b43] shadow-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#a3e635] font-black">
                      <Heart className="w-4 h-4 fill-[#a3e635]" />
                      <span>{profile.partnerName}との記念日まで</span>
                    </div>
                    <div className="text-2xl font-black text-[#ecfdf5]">
                      あと <span className="text-[#a3e635] text-3xl">{daysUntilNext}</span> 日！
                    </div>
                    <p className="text-[11px] text-[#86efac]">
                      次回: {nextMilestone.title}
                    </p>
                  </div>
                  <div className="text-right space-y-1 bg-[#051a10] px-4 py-3 rounded-2xl border border-[#13492c]">
                    <span className="text-[10px] text-[#86efac] block">節約タバコ代</span>
                    <span className="text-xl font-black text-[#34d399]">
                      +{savedMoney.toLocaleString()}円
                    </span>
                    <span className="text-[10px] text-[#6ee7b7] block">
                      禁煙 {totalDays}日{hours}時間
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#86efac] mb-3">
                  小型ウィジェット（ホーム画面 2×2 サイズ）
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#09291b] p-4 rounded-3xl border border-[#195b39] flex flex-col justify-between aspect-square">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">🌿</span>
                      <span className="text-[10px] font-bold text-[#86efac] bg-[#0c3823] px-2 py-0.5 rounded-full">
                        日数
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#ecfdf5]">{totalDays}</div>
                      <div className="text-xs font-bold text-[#a3e635]">日連続禁煙中！</div>
                    </div>
                    <div className="text-[10px] text-[#6ee7b7]">
                      {profile.partnerName}♡見守り中
                    </div>
                  </div>

                  <div className="bg-[#09291b] p-4 rounded-3xl border border-[#195b39] flex flex-col justify-between aspect-square">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">💰</span>
                      <span className="text-[10px] font-bold text-[#86efac] bg-[#0c3823] px-2 py-0.5 rounded-full">
                        節約
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#34d399]">
                        +{savedMoney.toLocaleString()}
                      </div>
                      <div className="text-xs font-bold text-[#a7f3d0]">円のお小遣い</div>
                    </div>
                    <div className="text-[10px] text-[#6ee7b7]">
                      {savedCigarettes}本我慢できた！
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-[#a7f3d0]">
              <div className="bg-[#082618] p-4 rounded-2xl border border-[#164d2f] space-y-2">
                <h4 className="font-bold text-[#ecfdf5] flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#0f4428] rounded text-[#a3e635] text-[10px]">iOS</span>
                  iPhoneのホーム画面・ロック画面に追加する方法
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[#86efac] leading-relaxed">
                  <li>Safariブラウザ下部の共有ボタン（四角から矢印が出ているアイコン）をタップ</li>
                  <li>メニューから「<strong>ホーム画面に追加</strong>」を選択</li>
                  <li>右上の「追加」を押すと、アプリアイコンとしていつでも即座に開けるようになります</li>
                  <li>
                    iOS16以降のロック画面ウィジェットには、ショートカットアプリや常時表示モードと連動可能です
                  </li>
                </ol>
              </div>

              <div className="bg-[#082618] p-4 rounded-2xl border border-[#164d2f] space-y-2">
                <h4 className="font-bold text-[#ecfdf5] flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#0f4428] rounded text-[#a3e635] text-[10px]">Android</span>
                  Androidのホーム画面・全画面固定にする方法
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[#86efac] leading-relaxed">
                  <li>Chromeブラウザ右上のメニューボタン（縦の3点リーダー）をタップ</li>
                  <li>「<strong>アプリをインストール</strong>」または「<strong>ホーム画面に追加</strong>」を選択</li>
                  <li>
                    ホーム画面に専用ウィジェットアイコンが配置され、通知バッジ連携が有効になります
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="px-6 py-4 border-t border-[#133f27] bg-[#061d13] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#071c12] font-black text-xs transition cursor-pointer shadow-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
