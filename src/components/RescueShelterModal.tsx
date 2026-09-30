'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, RescueMission } from '@/types';
import { RESCUE_MISSIONS, PARTNER_TONE_MESSAGES } from '@/lib/constants';
import { X, ShieldCheck, Heart, Sparkles, CheckCircle2, RotateCcw, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RescueShelterModalProps {
  profile: UserProfile;
  todaySmoked: number;
  onRecordRelapse: (count: number) => void;
  onClose: () => void;
}

export const RescueShelterModal: React.FC<RescueShelterModalProps> = ({
  profile,
  todaySmoked,
  onRecordRelapse,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<'stamp' | 'detox' | 'revenge'>('stamp');
  const [countInput, setCountInput] = useState<number>(1);
  const [hasIssuedStamp, setHasIssuedStamp] = useState(false);
  const [activeMission, setActiveMission] = useState<RescueMission | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  const tone = profile.partnerTone || 'deredere';
  const comfortMessages = PARTNER_TONE_MESSAGES[tone]?.shelterComfort || PARTNER_TONE_MESSAGES.deredere.shelterComfort;
  const comfortQuote = comfortMessages[Math.floor(Math.random() * comfortMessages.length)];

  const singlePrice = Math.round(profile.pricePerPack / profile.cigarettesPerPack);
  const targetRewardCost = profile.targetRewardCost || 3000;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (activeMission && !completedMissions.includes(activeMission.id)) {
              setCompletedMissions((c) => [...c, activeMission.id]);
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 },
                  colors: ['#059669', '#84cc16', '#34d399'],
                });
              } catch {
                // ignore
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeMission, completedMissions]);

  const handleIssueStamp = () => {
    onRecordRelapse(todaySmoked + countInput);
    setHasIssuedStamp(true);
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
  };

  const startMission = (mission: RescueMission) => {
    setActiveMission(mission);
    setTimerSeconds(mission.durationSeconds);
    setIsTimerRunning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04140d]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#092c1d] via-[#061f14] to-[#04140d] border-2 border-[#165a38] w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* モーダルヘッダー */}
        <div className="px-6 py-4 border-b border-[#14472c] bg-[#072417] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0c3924] rounded-2xl text-[#a3e635] border border-[#1a5f3b]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#ecfdf5] flex items-center gap-2">
                <span>救済レスキューシェルター</span>
                <span className="text-[10px] bg-[#0d4027] text-[#34d399] px-2 py-0.5 rounded-full border border-[#1c643e]">
                  ゼロ嫌悪宣言
                </span>
              </h3>
              <p className="text-[11px] text-[#86efac]">
                吸ってしまっても自分を責めない！努力は1ミリも消えていません
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
        <div className="flex border-b border-[#123e27] bg-[#051c11] px-6 pt-3 gap-2 text-xs">
          <button
            onClick={() => setActiveStep('stamp')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeStep === 'stamp'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            📜 免罪符スタンプ発行
          </button>
          <button
            onClick={() => setActiveStep('detox')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeStep === 'detox'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            💧 3分デトックスミッション
          </button>
          <button
            onClick={() => setActiveStep('revenge')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeStep === 'revenge'
                ? 'border-[#10b981] text-[#a3e635]'
                : 'border-transparent text-[#6ee7b7] hover:text-[#a7f3d0]'
            }`}
          >
            🎯 ポジティブリベンジ換算
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. 免罪符スタンプ発行 */}
          {activeStep === 'stamp' && (
            <div className="space-y-4">
              <div className="bg-[#0b3320] border-2 border-[#1c643e] rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src="/logo.png"
                    alt="すいすい"
                    className="w-11 h-11 rounded-2xl object-cover shadow-md border-2 border-[#34d399]/60 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#86efac] block">
                      息抜き相棒「{profile.partnerName}」より
                    </span>
                    <p className="text-xs font-semibold text-[#ecfdf5] leading-relaxed mt-0.5">
                      「{comfortQuote}」
                    </p>
                  </div>
                </div>

                {/* 免罪符スタンプ表示 */}
                <div className="bg-[#051c11] border-2 border-dashed border-[#1f6b43] rounded-2xl p-4 text-center mt-3">
                  <span className="text-3xl block mb-2">🌿✨</span>
                  <h4 className="text-sm font-black text-[#a3e635] mb-1">
                    【公認免罪符】努力持続ステータス
                  </h4>
                  <p className="text-[11px] text-[#86efac] max-w-sm mx-auto">
                    今まで吸わずに耐えた時間と、肺が綺麗になった実績は一切消去されません。堂々とここから継続してください！
                  </p>
                </div>
              </div>

              {/* 吸った本数の安心記録 */}
              <div className="bg-[#072417] p-4 rounded-2xl border border-[#14472c]">
                <label className="text-xs font-bold text-[#86efac] mb-2 block">
                  もし吸ってしまったら正直に本数を記録（自分を責めないで！）
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCountInput(Math.max(1, countInput - 1))}
                    className="w-9 h-9 rounded-xl bg-[#0b3621] text-[#ecfdf5] font-black hover:bg-[#10b981] hover:text-[#04140d] transition"
                  >
                    -
                  </button>
                  <span className="font-black text-lg text-[#ecfdf5] px-4 py-1.5 bg-[#051c11] rounded-xl border border-[#164d2f]">
                    {countInput} 本
                  </span>
                  <button
                    type="button"
                    onClick={() => setCountInput(countInput + 1)}
                    className="w-9 h-9 rounded-xl bg-[#0b3621] text-[#ecfdf5] font-black hover:bg-[#10b981] hover:text-[#04140d] transition"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={handleIssueStamp}
                    disabled={hasIssuedStamp}
                    className={`ml-auto px-4 py-2.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
                      hasIssuedStamp
                        ? 'bg-[#0f4428] text-[#86efac] border border-[#1d6b41]'
                        : 'bg-[#10b981] text-[#04140d] hover:bg-[#059669] shadow-md'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{hasIssuedStamp ? '免罪符発行完了！' : '免罪符を発行して記録'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. 3分デトックスミッション */}
          {activeStep === 'detox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#ecfdf5]">
                    3分間のリカバリーミッション
                  </h4>
                  <p className="text-[11px] text-[#86efac]">
                    タバコの急激な欲求波は約3分で去ります。ミッションをこなして乗り切ろう！
                  </p>
                </div>
                <span className="text-[10px] text-[#34d399] font-bold bg-[#072818] px-2.5 py-1 rounded-full border border-[#164d2f]">
                  完了: {completedMissions.length} / {RESCUE_MISSIONS.length}
                </span>
              </div>

              {/* ミッション一覧 */}
              <div className="space-y-2.5">
                {RESCUE_MISSIONS.map((mission) => {
                  const isCompleted = completedMissions.includes(mission.id);
                  const isCurrent = activeMission?.id === mission.id && isTimerRunning;
                  return (
                    <div
                      key={mission.id}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-[#0b3320] border-[#22c55e]'
                          : isCurrent
                          ? 'bg-[#0e3b25] border-[#a3e635] shadow-lg'
                          : 'bg-[#072417] border-[#14472c]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl p-2 bg-[#051c11] rounded-xl border border-[#15462c]">
                          {mission.emoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-xs text-[#ecfdf5]">{mission.title}</h5>
                            <span className="text-[10px] text-[#86efac]">約{mission.durationSeconds}秒</span>
                          </div>
                          <p className="text-[11px] text-[#6ee7b7] mt-0.5">{mission.description}</p>
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <span className="px-3 py-1.5 rounded-xl bg-[#092c1c] text-[#34d399] font-black text-[11px] border border-[#195a38] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 完了
                          </span>
                        ) : isCurrent ? (
                          <div className="px-4 py-1.5 rounded-xl bg-[#10b981] text-[#04140d] font-black text-sm animate-pulse">
                            {timerSeconds}秒
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startMission(mission)}
                            className="px-3 py-1.5 rounded-xl bg-[#0b3823] hover:bg-[#10b981] hover:text-[#04140d] text-[#86efac] font-bold text-xs transition border border-[#1a5e3a] flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" /> 開始
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. ポジティブリベンジ換算 */}
          {activeStep === 'revenge' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#0d3b25] to-[#072417] p-5 rounded-3xl border border-[#1a603b]">
                <span className="text-[10px] font-bold text-[#86efac] tracking-wider uppercase block mb-1">
                  Positive Revenge
                </span>
                <h4 className="text-sm font-black text-[#ecfdf5] mb-2">
                  目標ご褒美「{profile.targetReward || '極上サウナ'}」へのリベンジ進捗
                </h4>
                <p className="text-[11px] text-[#a7f3d0] leading-relaxed mb-4">
                  吸ってしまった1本は約{singlePrice}円ですが、次に我慢する1本ごとに確実に目標ご褒美へ近づきます！
                </p>

                {/* プログレスバー */}
                <div className="space-y-1.5 bg-[#051c11] p-3.5 rounded-2xl border border-[#14472c]">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#86efac]">ご褒美目標額: {targetRewardCost.toLocaleString()}円</span>
                    <span className="text-[#a3e635]">あと少しで到達！</span>
                  </div>
                  <div className="w-full h-3 bg-[#082819] rounded-full overflow-hidden p-0.5 border border-[#13462b]">
                    <div
                      className="h-full bg-gradient-to-r from-[#059669] via-[#34d399] to-[#84cc16] rounded-full"
                      style={{ width: '65%' }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6ee7b7] block text-right">
                    この調子で今日乗り切れば一気に前進！
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-[#133f27] bg-[#061d13] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-[#04140d] font-black text-xs transition cursor-pointer shadow-lg"
          >
            シェルターを出てすいすい進む！
          </button>
        </div>
      </div>
    </div>
  );
};
