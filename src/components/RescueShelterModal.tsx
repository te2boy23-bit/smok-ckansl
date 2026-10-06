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

  const singlePrice = Math.round((profile.pricePerPack || 600) / (profile.cigarettesPerPack || 20));
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
                  colors: ['#22c55e', '#4ade80', '#86efac'],
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

  const handleIssueStamp = () => {
    onRecordRelapse(todaySmoked + countInput);
    setHasIssuedStamp(true);
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
  };

  const startMission = (mission: RescueMission) => {
    setActiveMission(mission);
    setTimerSeconds(mission.durationSeconds);
    setIsTimerRunning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#064e3b]/30 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-[#f0fdf4] via-[#e8fdf0] to-[#dcfce7] border-2 border-[#86efac] w-full max-w-xl rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-[#86efac] bg-[#bbf7d0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#dcfce7] rounded-2xl text-[#15803d] border border-[#86efac] shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#022c22] flex items-center gap-2">
                <span>救済レスキューシェルター</span>
                <span className="text-[10px] bg-[#dcfce7] text-[#022c22] px-2 py-0.5 rounded-full border border-[#86efac] font-black">
                  ゼロ嫌悪宣言
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#065f46]">
                吸ってしまっても自分を責めない！努力は1ミリも消えていません
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

        {/* タブナビゲーション */}
        <div className="flex border-b border-[#86efac] bg-[#cbf7d8] px-4 sm:px-6 pt-3 gap-2 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveStep('stamp')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeStep === 'stamp'
                ? 'border-[#15803d] text-[#022c22]'
                : 'border-transparent text-[#065f46] hover:text-[#022c22]'
            }`}
          >
            📜 免罪符スタンプ発行
          </button>
          <button
            onClick={() => setActiveStep('detox')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeStep === 'detox'
                ? 'border-[#15803d] text-[#022c22]'
                : 'border-transparent text-[#065f46] hover:text-[#022c22]'
            }`}
          >
            💧 3分デトックスミッション
          </button>
          <button
            onClick={() => setActiveStep('revenge')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer shrink-0 ${
              activeStep === 'revenge'
                ? 'border-[#15803d] text-[#022c22]'
                : 'border-transparent text-[#065f46] hover:text-[#022c22]'
            }`}
          >
            🎯 ポジティブリベンジ換算
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-5 sm:p-6 space-y-5 flex-1 text-xs">
          {/* 1. 免罪符スタンプ発行 */}
          {activeStep === 'stamp' && (
            <div className="space-y-4">
              <div className="bg-[#e8fdf0] border-2 border-[#86efac] rounded-3xl p-5 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src="/logo.png?v=2"
                    alt="すいすい"
                    className="w-10 h-10 rounded-2xl object-cover shrink-0 shadow-sm border border-[#86efac]"
                  />
                  <div>
                    <span className="text-[10px] font-black text-[#047857] block">
                      息抜き相棒「{profile.partnerName}」より
                    </span>
                    <p className="text-xs font-bold text-[#022c22] leading-relaxed mt-0.5">
                      「{comfortQuote}」
                    </p>
                  </div>
                </div>

                {/* 免罪符スタンプ表示 */}
                <div className="bg-[#dcfce7] border-2 border-dashed border-[#4ade80] rounded-2xl p-4 text-center mt-3 shadow-inner">
                  <span className="text-3xl block mb-2">🌿✨</span>
                  <h4 className="text-sm font-black text-[#022c22] mb-1">
                    【公認免罪符】努力持続ステータス
                  </h4>
                  <p className="text-[11px] text-[#065f46] max-w-sm mx-auto font-medium">
                    今まで吸わずに耐えた時間と、肺が綺麗になった実績は一切消去されません。堂々とここから継続してください！
                  </p>
                </div>
              </div>

              {/* 吸った本数の安心記録 */}
              <div className="bg-[#e8fdf0] p-4 rounded-2xl border border-[#86efac] shadow-sm">
                <label className="text-xs font-black text-[#022c22] mb-2 block">
                  もし吸ってしまったら正直に本数を記録（自分を責めないで！）
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCountInput(Math.max(1, countInput - 1))}
                    className="w-9 h-9 rounded-xl bg-[#bbf7d0] text-[#022c22] font-black hover:bg-[#86efac] transition border border-[#86efac] shadow-sm"
                  >
                    -
                  </button>
                  <span className="font-black text-lg text-[#022c22] px-4 py-1.5 bg-[#dcfce7] rounded-xl border border-[#86efac]">
                    {countInput} 本
                  </span>
                  <button
                    type="button"
                    onClick={() => setCountInput(countInput + 1)}
                    className="w-9 h-9 rounded-xl bg-[#bbf7d0] text-[#022c22] font-black hover:bg-[#86efac] transition border border-[#86efac] shadow-sm"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={handleIssueStamp}
                    disabled={hasIssuedStamp}
                    className={`ml-auto px-4 py-2.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 border border-[#86efac] ${
                      hasIssuedStamp
                        ? 'bg-[#bbf7d0] text-[#047857]'
                        : 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#022c22] shadow-sm hover:brightness-105'
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
                  <h4 className="text-xs font-black text-[#022c22]">
                    3分間のリカバリーミッション
                  </h4>
                  <p className="text-[11px] text-[#065f46]">
                    タバコの急激な欲求波は約3分で去ります。ミッションをこなして乗り切ろう！
                  </p>
                </div>
                <span className="text-[10px] text-[#022c22] font-black bg-[#bbf7d0] px-2.5 py-1 rounded-full border border-[#86efac]">
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
                          ? 'bg-[#bbf7d0] border-[#15803d]'
                          : isCurrent
                          ? 'bg-[#dcfce7] border-[#22c55e] shadow-md'
                          : 'bg-[#e8fdf0] border-[#86efac]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl p-2 bg-[#bbf7d0] rounded-xl border border-[#86efac]">
                          {mission.emoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-black text-xs text-[#022c22]">{mission.title}</h5>
                            <span className="text-[10px] text-[#047857] font-bold">約{mission.durationSeconds}秒</span>
                          </div>
                          <p className="text-[11px] text-[#065f46] mt-0.5">{mission.description}</p>
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <span className="px-3 py-1.5 rounded-xl bg-[#22c55e] text-[#022c22] font-black text-[11px] border border-[#15803d] flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 完了
                          </span>
                        ) : isCurrent ? (
                          <div className="px-4 py-1.5 rounded-xl bg-[#22c55e] text-[#022c22] font-black text-sm animate-pulse border border-[#15803d]">
                            {timerSeconds}秒
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startMission(mission)}
                            className="px-3 py-1.5 rounded-xl bg-[#bbf7d0] hover:bg-[#86efac] text-[#022c22] font-black text-xs transition border border-[#86efac] flex items-center gap-1 cursor-pointer shadow-sm"
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
              <div className="bg-[#e8fdf0] p-5 rounded-3xl border-2 border-[#86efac] shadow-sm">
                <span className="text-[10px] font-bold text-[#047857] tracking-wider uppercase block mb-1">
                  Positive Revenge
                </span>
                <h4 className="text-sm font-black text-[#022c22] mb-2">
                  目標ご褒美「{profile.targetReward || '極上サウナ'}」へのリベンジ進捗
                </h4>
                <p className="text-[11px] text-[#065f46] leading-relaxed mb-4">
                  吸ってしまった1本は約{singlePrice}円ですが、次に我慢する1本ごとに確実に目標ご褒美へ近づきます！
                </p>

                {/* プログレスバー */}
                <div className="space-y-1.5 bg-[#dcfce7] p-3.5 rounded-2xl border border-[#86efac]">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-[#065f46]">ご褒美目標額: {targetRewardCost.toLocaleString()}円</span>
                    <span className="text-[#15803d]">あと少しで到達！</span>
                  </div>
                  <div className="w-full h-3 bg-[#bbf7d0] rounded-full overflow-hidden p-0.5 border border-[#86efac]">
                    <div
                      className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] rounded-full"
                      style={{ width: '65%' }}
                    />
                  </div>
                  <span className="text-[10px] text-[#047857] block text-right font-bold">
                    この調子で今日乗り切れば一気に前進！
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-5 sm:px-6 py-4 border-t-2 border-[#86efac] bg-[#bbf7d0] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-[#022c22] font-black text-xs transition cursor-pointer shadow-md border border-[#86efac]"
          >
            シェルターを出てすいすい進む！
          </button>
        </div>
      </div>
    </div>
  );
};
