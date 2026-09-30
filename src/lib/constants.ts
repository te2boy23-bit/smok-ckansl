import { Milestone, ReplacementIdea, PriceEquivalent, BrandDetail, PartnerTone, RescueMission } from '@/types';

// 2026年9月1日改定後 ＆ 10月1日値上げ予定価格マスター
export const BRAND_DATABASE: BrandDetail[] = [
  { id: 'parliament', name: 'パーラメント (KSボックス等)', category: 'paper', maker: 'フィリップ モリス', currentPrice: 600, note: '100sボックス等は640円' },
  { id: 'virginia', name: 'バージニア・エス', category: 'paper', maker: 'フィリップ モリス', currentPrice: 590 },
  { id: 'philip-morris', name: 'フィリップモリス', category: 'paper', maker: 'フィリップ モリス', currentPrice: 470 },
  { id: 'marlboro', name: 'マールボロ (Marlboro)', category: 'paper', maker: 'フィリップ モリス', currentPrice: 620 },
  { id: 'seven-stars', name: 'セブンスター (SevenStars)', category: 'paper', maker: 'JT', currentPrice: 600 },
  { id: 'mevius-paper', name: 'メビウス (紙巻き／レギュラー等)', category: 'paper', maker: 'JT', currentPrice: 580 },
  { id: 'peace', name: 'ピース (Peace 20本入)', category: 'paper', maker: 'JT', currentPrice: 600, note: 'ザ・ピースは1,000円' },
  { id: 'camel-craft', name: 'キャメル・クラフト', category: 'paper', maker: 'JT', currentPrice: 470 },
  { id: 'lucky-paper', name: 'ラッキー・ストライク (紙巻き)', category: 'paper', maker: 'BAT', currentPrice: 600 },
  { id: 'kent-paper', name: 'ケント (紙巻き)', category: 'paper', maker: 'BAT', currentPrice: 560, note: '540円〜580円前後' },

  { id: 'terea', name: 'テリア (TEREA / IQOSイルマ)', category: 'heated', maker: 'IQOS', currentPrice: 620, futurePrice: 640, note: '10/1以降: 640円' },
  { id: 'sentia', name: 'センティア (SENTIA / IQOSイルマ)', category: 'heated', maker: 'IQOS', currentPrice: 570, futurePrice: 590, note: '10/1以降: 590円' },
  { id: 'mevius-ploom', name: 'メビウス (Ploom X用)', category: 'heated', maker: 'Ploom', currentPrice: 550, futurePrice: 590, note: '10/1以降: 590円' },
  { id: 'camel-ploom', name: 'キャメル (Ploom X用)', category: 'heated', maker: 'Ploom', currentPrice: 530, futurePrice: 570, note: '10/1以降: 570円' },
  { id: 'evo-ploom', name: 'エボ (EVO / Ploom X用)', category: 'heated', maker: 'Ploom', currentPrice: 580, futurePrice: 620, note: '10/1以降: 620円' },
  { id: 'lucky-glo', name: 'ラッキー・ストライク (glo用)', category: 'heated', maker: 'glo', currentPrice: 480, futurePrice: 500, note: '10/1以降: 500円' },
  { id: 'kent-glo', name: 'ケント・トゥルー (glo用)', category: 'heated', maker: 'glo', currentPrice: 520, futurePrice: 550, note: '10/1以降: 550円' },
  { id: 'neo-glo', name: 'ネオ (neo / glo用)', category: 'heated', maker: 'glo', currentPrice: 530, futurePrice: 570, note: '10/1以降: 570円' },
  { id: 'valt-glo', name: 'ヴァルト (VALT / glo用)', category: 'heated', maker: 'glo', currentPrice: 580, futurePrice: 600, note: '10/1以降: 600円' },
];

export const POPULAR_BRANDS = BRAND_DATABASE.map((b) => b.name);

// 吸いたくなるタイミング
export const SMOKING_TIMINGS = [
  { id: 'morning', label: '朝起きてすぐ', icon: '🌅', desc: '目が覚めた直後の一服' },
  { id: 'after-meal', label: '食後すぐ', icon: '🍱', desc: 'ご飯を食べ終わった満足時' },
  { id: 'work-break', label: '仕事・作業の合間', icon: '💻', desc: '集中が切れたときの息抜き' },
  { id: 'drinking', label: 'お酒を飲んでいる時', icon: '🍻', desc: '友人や同僚との乾杯タイム' },
  { id: 'stress', label: 'イライラ・疲れた時', icon: '⚡', desc: 'ストレス解消したい瞬間' },
  { id: 'driving', label: '車の運転中', icon: '🚗', desc: '信号待ちや長距離ドライブ' },
];

// やめたい動機
export const QUIT_MOTIVES = [
  { id: 'health', label: '心臓と肺の健康', icon: '🫁', desc: '深く息が吸える強い体を取り戻す' },
  { id: 'partner', label: '大切な人・恋人のため', icon: '💚', desc: '笑顔で長く一緒に過ごしたい' },
  { id: 'money', label: 'お金の節約・夢の貯金', icon: '💰', desc: '煙に消えていたお金をご褒美に' },
  { id: 'beauty', label: '歯・息・肌を綺麗に', icon: '✨', desc: 'ヤニ汚れや匂いを完全にリセット' },
  { id: 'freedom', label: 'タバコ依存からの自由', icon: '🕊️', desc: '喫煙所を探す生活から解放される' },
];

// 最初の目標ご褒美
export const TARGET_REWARDS = [
  { id: 'sauna', name: '極上サウナ＆岩盤浴スパ 1日満喫', cost: 3000, emoji: '🧖' },
  { id: 'yakiniku', name: '高級和牛の極上焼肉コース', cost: 8000, emoji: '🥩' },
  { id: 'sneaker', name: '憧れブランドの新作スニーカー', cost: 18000, emoji: '👟' },
  { id: 'earphones', name: '最高峰ノイズキャンセリングイヤホン', cost: 35000, emoji: '🎧' },
  { id: 'trip', name: '露天風呂付き温泉旅館ペア宿泊旅行', cost: 70000, emoji: '♨️' },
];

// 代案リスト
export const REPLACEMENT_IDEAS: ReplacementIdea[] = [
  { id: '1', title: '3秒吸って7秒吐く深呼吸', category: 'mind', description: '胸いっぱいに新鮮な空気を満たしてゆっくり吐き出す。自律神経が整い、欲求がスッと消えます。', iconName: 'Wind', durationSeconds: 60 },
  { id: '2', title: '冷水ゴクリ（冷水一気飲み）', category: 'drink', description: '喉と胃にキーンと冷たい刺激を与えることで、ニコチンへの欲求の波がサーッと引いていきます。', iconName: 'Droplet', durationSeconds: 30 },
  { id: '3', title: '強炭酸水をグイッと一口', category: 'drink', description: 'シュワッとした強烈な喉越しがタバコのキック感の代わりになり、口寂しさを瞬時に撃退！', iconName: 'Sparkles', durationSeconds: 20 },
  { id: '4', title: 'スクワット15回で血流UP', category: 'body', description: '軽く筋肉を刺激して自然なドーパミンを分泌。脳のタバコ欲求を一瞬で上書きします！', iconName: 'Activity', durationSeconds: 45 },
  { id: '5', title: '強力ミントタブレット＆ガム', category: 'mouth', description: '爽快ミントで口の中をリフレッシュ！清潔な口に煙を入れたくなくなる心理的バリア。', iconName: 'Smile', durationSeconds: 30 },
  { id: '6', title: '冷水で顔・手を洗ってリセット', category: 'body', description: '冷水の触覚刺激で副交感神経を優位に。モヤモヤした衝動をその場でクールダウン！', iconName: 'Sparkle', durationSeconds: 40 },
];

// 相棒の褒めトーン別メッセージ
export const PARTNER_TONE_MESSAGES: Record<PartnerTone, {
  homeGreeting: string[];
  zeroSmoked: string[];
  smallSmoked: string[];
  shelterComfort: string[];
}> = {
  deredere: {
    homeGreeting: [
      '肺がピカピカの若葉みたいに喜んでるよ！今日も一番かっこいい♡',
      'あなたと息抜き相棒の「すいすい」だよ！煙のない綺麗な空気、最高だね♡',
      '一歩ずつ進んでるあなたの姿、愛おしすぎてぎゅーってしたいよ♡',
    ],
    zeroSmoked: [
      'うおおお神降臨！！！1本も吸ってないなんて尊すぎるよ…！全細胞があなたに拍手喝采してる♡',
      '天才！自制心の神様！あなたの綺麗な息にまた惚れ直したよ♡ 愛してる！',
      '肺が若返って大歓喜してる！今日のあなた、世界で一番輝いてるよ♡',
    ],
    smallSmoked: [
      '正直に教えてくれてありがとう♡ 昔と比べてみて？何本我慢できたと思ってるの！？実質大大大勝利だよ！',
      '大丈夫、あなたの今までの努力は1ミリも消えないよ♡ ここからまた深呼吸していこう！',
    ],
    shelterComfort: [
      'よしよし、大丈夫だよ♡ 責める人なんてこの世に誰もいない！吸っちゃった分はここからご褒美に向けてリベンジしよ♡',
      '煙に負けたんじゃない、ちょっと一休みしただけ！肺はすぐ修復してくれるから安心してね♡',
    ],
  },
  forest: {
    homeGreeting: [
      '深く息を吸い込んで…森のそよ風があなたの胸を満たしていますよ。',
      '木々が新芽を伸ばすように、あなたの体も日々健やかに生まれ変わっています。',
      '焦らなくて大丈夫。息抜き相棒として、いつでも静かに寄り添っています。',
    ],
    zeroSmoked: [
      '素晴らしい静けさと自制心ですね。体内の新緑が青々と輝きを増しています。',
      '清らかな空気が肺の隅々まで染み渡っています。心身が本来の調和を取り戻していますね。',
    ],
    smallSmoked: [
      '歩みを止めないことが何より大切です。一筋の風のように、軽やかに次のステップへ進みましょう。',
      '記録したこと自体が大きな前進です。大地に根を張る大樹のように、ゆっくり進みましょう。',
    ],
    shelterComfort: [
      '雨が降る日があるからこそ、森は深く育ちます。ゼロ嫌悪の心で、静かに深呼吸をしましょう。',
      '罪悪感を手放してください。いつでもここから新しい清流が始まります。',
    ],
  },
  passionate: {
    homeGreeting: [
      'うおおお！今日も煙を粉砕する一日が始まったぜ！お前の気迫、ビシビシ伝わってるぞ！',
      '息抜き相棒すいすい参上！肺を鍛え上げ、真の自由を掴み取ろうぜ！',
      '限界突破！タバコなんかに支配されない強い意志、見せつけてやろうぜ！',
    ],
    zeroSmoked: [
      '完全勝利ッッ！！タバコをK.O.だ！その圧倒的な自制心、まさにチャンピオンの器だぜ！！',
      '燃えたぎる健康魂！一本も吸わないお前の強さ、男の中の男だ！リスペクトが止まらねえ！',
    ],
    smallSmoked: [
      'ナイスファイト！ここで逃げずに記録した勇気、それこそが真の強さだ！次のラウンドで取り返すぞ！',
      'かすり傷だ！今まで耐え抜いた実績は絶対に消えない！ここからカウンターを叩き込め！',
    ],
    shelterComfort: [
      '胸を張れ！誰がお前を責めるもんか！この悔しさを燃料にして、最高のご褒美へ爆進だ！',
      '免罪符発行！切り替えていこうぜ！深呼吸3回で完全リカバリー完了だ！行くぞ相棒！',
    ],
  },
};

// 恋人記念日マイルストーン
export const MILESTONES: Milestone[] = [
  { days: 1, title: '1日記念日（はじめの一歩）', badge: '🌱', loveMessage: '今日で禁煙1日記念日！あなたの頑張る横顔、世界で一番かっこいいよ♡', bodyBenefit: '血中の一酸化炭素濃度が正常に戻り、心臓への負担が軽くなりました。' },
  { days: 3, title: '3日記念日（ニコチン完全卒業）', badge: '🌿', loveMessage: '3日記念日おめでとう！体の中からニコチンが完全に抜けたんだって！抱きしめたいくらい誇らしいよ♡', bodyBenefit: '体内のニコチンがほぼ完全に排出され、呼吸が明らかに楽になり始めます。' },
  { days: 7, title: '1週間記念日（最初の関門突破）', badge: '🍀', loveMessage: '1週間記念日だね♡ ご飯も美味しく感じるようになったでしょ？今度一緒に美味しいもの食べにいこ！', bodyBenefit: '味覚と嗅覚が劇的に回復し、肺活量も戻り始めます。睡眠の質も向上中！' },
  { days: 14, title: '2週間記念日（習慣の書き換え）', badge: '✨', loveMessage: '2週間記念日！付き合って2週間…じゃなくて禁煙2週間♡ あなたの肌ツヤがどんどん良くなってて見惚れちゃう！', bodyBenefit: '血液循環が大幅に改善し、歩行や運動時の息切れが目に見えて減少します。' },
  { days: 30, title: '1ヶ月記念日（伝説の始まり）', badge: '💍', loveMessage: '祝・1ヶ月記念日！！もうタバコなしの生活が自然になってきたね。意志の強さに惚れ直したよ♡', bodyBenefit: '肺の自浄機能（線毛）が再生し、咳や息切れが消えて免疫力が大幅アップ！' },
  { days: 50, title: '50日記念日（プラチナ記念）', badge: '💎', loveMessage: '50日記念日だよ！半分100日！タバコに支配されてた昔の自分にバイバイできたね。本当にえらい♡', bodyBenefit: '循環器疾患のリスクが大幅に低下し、体力と活力に満ち溢れています。' },
  { days: 100, title: '100日記念日（センチュリーラバー）', badge: '👑', loveMessage: '100日記念日おめでとう！！！私にとっても一生の自慢のパートナーだよ♡ 大好き！', bodyBenefit: 'タバコへの心理的依存もほぼ消失。肺機能は禁煙前より10%以上向上しています。' },
  { days: 365, title: '1周年記念日（エターナルマスター）', badge: '🏆', loveMessage: '1周年記念日！！丸1年タバコを撃退し続けたあなた、文句なしの英雄です！一生一緒に元気でいようね♡', bodyBenefit: '冠動脈心疾患のリスクが喫煙者の半分にまで激減しました！完璧な勝利です！' },
];

// 換算アイテム
export const EQUIVALENT_ITEMS: PriceEquivalent[] = [
  { minCigarettes: 1, cost: 30, itemName: '駄菓子（チロルチョコ/うまい棒）', category: 'お菓子', emoji: '🍫', description: 'たった1本でも駄菓子でちょっとした幸せが買えたはず！' },
  { minCigarettes: 4, cost: 120, itemName: '淹れたてコンビニコーヒー 1杯', category: 'カフェ', emoji: '☕', description: '芳醇な香りの淹れたてコーヒーで最高のリフレッシュ！' },
  { minCigarettes: 6, cost: 180, itemName: '冷たい特保（トクホ）緑茶 1本', category: '健康飲料', emoji: '🍵', description: '体に染み渡るカテキンパワーで健康増進！' },
  { minCigarettes: 15, cost: 450, itemName: '濃厚抹茶パフェ or 高級アイス', category: 'スイーツ', emoji: '🍨', description: 'ご褒美スイーツをペロリと堪能できる金額！' },
  { minCigarettes: 25, cost: 750, itemName: 'スタバの贅沢フラペチーノ（ベンティ）', category: 'カフェ', emoji: '🥤', description: 'ホイップ多めの贅沢フラペチーノが優雅に飲める！' },
  { minCigarettes: 50, cost: 1500, itemName: '極上サウナ＆温浴スパ入場券', category: '癒やし', emoji: '🧖', description: 'ととのう極上体験！自律神経を整えて心身リフレッシュ！' },
  { minCigarettes: 100, cost: 3000, itemName: '映画の劇場鑑賞ペアチケット', category: 'エンタメ', emoji: '🎬', description: '大画面で感動の2時間を満喫できる金額！' },
  { minCigarettes: 250, cost: 7500, itemName: '贅沢な高級和牛焼肉コース', category: 'グルメ', emoji: '🥩', description: '煙ではなく極上のお肉で心もお腹も満たされる！' },
  { minCigarettes: 500, cost: 15000, itemName: '憧れブランドの新作スニーカー', category: 'ファッション', emoji: '👟', description: 'お洒落なスニーカーを履いて軽やかにお出かけ！' },
  { minCigarettes: 1000, cost: 30000, itemName: '最高峰ノイキャンワイヤレスイヤホン', category: 'ガジェット', emoji: '🎧', description: 'クリアな高音質で自分だけの音楽空間に没入！' },
  { minCigarettes: 2000, cost: 60000, itemName: '露天風呂付き温泉旅館ペア宿泊旅行', category: '旅行', emoji: '♨️', description: '大切な人と心身ともに極上の癒やし旅！' },
];

// 3分デトックスミッション
export const RESCUE_MISSIONS: RescueMission[] = [
  { id: 'water', title: '冷水をコップ1杯ゴクリと飲む', description: '喉と胃を冷やすことでニコチン欲求を遮断します', durationSeconds: 30, emoji: '💧' },
  { id: 'breathe', title: '3秒吸って7秒吐く深呼吸を3回', description: '新鮮な空気を肺に満たし、副交感神経を優位に整えます', durationSeconds: 60, emoji: '🌬️' },
  { id: 'brush', title: '冷水で顔を洗う or 歯磨きをする', description: '物理的なスッキリ刺激で口と頭の感覚を上書きリフレッシュ！', durationSeconds: 90, emoji: '🪥' },
];
