import { NextResponse } from 'next/server';
import { MILESTONES, PARTNER_TONE_MESSAGES, REPLACEMENT_IDEAS } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'チャレンジャー';
  const partner = searchParams.get('partner') || 'すいすい';
  const days = parseInt(searchParams.get('days') || '3', 10);
  const saved = parseInt(searchParams.get('saved') || '1800', 10);
  const tone = (searchParams.get('tone') as 'deredere' | 'forest' | 'passionate') || 'deredere';

  const greetings = PARTNER_TONE_MESSAGES[tone]?.homeGreeting || PARTNER_TONE_MESSAGES.deredere.homeGreeting;
  const greeting = greetings[days % greetings.length];

  const nextMilestone = MILESTONES.find((m) => m.days > days) || MILESTONES[MILESTONES.length - 1];
  const daysUntilNext = Math.max(0, nextMilestone.days - days);

  const randomIdea = REPLACEMENT_IDEAS[Math.floor(Math.random() * REPLACEMENT_IDEAS.length)];

  // Widgy / Scriptable 両対応の JSON 構造
  const data = {
    appName: 'すいすい',
    userName: name,
    partnerName: partner,
    days: days,
    daysLabel: `${days}日目`,
    hoursLabel: `${days * 24}時間`,
    savedMoney: saved,
    savedMoneyFormatted: `+¥${saved.toLocaleString()}`,
    nextMilestoneTitle: nextMilestone.title,
    daysUntilNext: daysUntilNext,
    countdownText: `記念日まであと${daysUntilNext}日`,
    partnerMessage: `「${name}くん、禁煙${days}日目達成♡ ${greeting}」`,
    quickIdeaTitle: randomIdea.title,
    quickIdeaDesc: randomIdea.description,
    statusEmoji: '🌱',
    themeColor: '#10b981',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
