import { Milestone, ReplacementIdea, PriceEquivalent, BrandDetail } from '@/types';

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

export const REPLACEMENT_IDEAS: ReplacementIdea[] = [
  { id: '1', title: '冷たい氷水を一気飲みする', category: 'drink', description: '喉と胃にキーンと冷たい刺激を与えることで、ニコチンへの欲求波がスーッと引いていきます。', iconName: 'Droplet' },
  { id: '2', title: '5秒吸って10秒吐く深呼吸', category: 'mind', description: 'タバコを吸う代わりに綺麗な空気をたっぷり肺に入れましょう。自律神経が整ってリラックスできます。', iconName: 'Wind' },
  { id: '3', title: '強炭酸水をグイッと飲む', category: 'drink', description: 'シュワッとした強烈な喉越しがタバコのキック感の代わりになり、口寂しさを瞬時に消し去ります。', iconName: 'Sparkles' },
  { id: '4', title: 'スクワットまたは腕立て15回', category: 'body', description: '軽く筋肉に負荷をかけるとドーパミンが分泌され、脳のタバコ欲求が一瞬で吹き飛びます！', iconName: 'Activity' },
  { id: '5', title: '冷水で手を洗う・顔を洗う', category: 'body', description: '肌に冷水が触れるショックで迷走神経が刺激され、衝動的なモヤモヤ気分を即座にリセットできます。', iconName: 'Sparkle' },
  { id: '6', title: 'ミントガムや刺激系タブレット', category: 'mouth', description: '口の中を強力ミントで爽快に！タバコを吸いたい口の感覚を完全に上書きします。', iconName: 'Smile' },
  { id: '7', title: 'お気に入りの神曲を1曲聴く', category: 'mind', description: 'タバコの欲求のピークは約3分間。大好きな音楽をフルで1曲聴き終わる頃には波が去っています！', iconName: 'Music' },
  { id: '8', title: '歯磨きをして口内ピカピカ', category: 'mouth', description: '磨きたての清潔な口にタバコの煙を入れたくなくなる心理的ブロック効果が抜群です。', iconName: 'ShieldCheck' },
];

export const MILESTONES: Milestone[] = [
  { days: 1, title: '1日記念日（はじめの一歩）', badge: '🌱', loveMessage: '今日で禁煙1日記念日！あなたが頑張ってる姿、世界で一番かっこいいよ♡ ずっと応援してるからね！', bodyBenefit: '血中の一酸化炭素濃度が正常に戻り、心臓への負担が軽くなりました。' },
  { days: 3, title: '3日記念日（ニコチン完全卒業）', badge: '🌿', loveMessage: '3日記念日おめでとう！体の中からニコチンが完全に抜けたんだって！本当にすごい、抱きしめたいくらい誇らしいよ♡', bodyBenefit: '体内のニコチンがほぼ完全に排出され、呼吸が明らかに楽になり始めます。' },
  { days: 7, title: '1週間記念日（最初の関門突破）', badge: '🍀', loveMessage: '1週間記念日だね♡ もうあなたの肺と私、大歓喜中！ご飯も美味しく感じるようになったでしょ？今度一緒に美味しいもの食べにいこ！', bodyBenefit: '味覚と嗅覚が劇的に回復し、肺活量も戻り始めます。睡眠の質も向上中！' },
  { days: 14, title: '2週間記念日（習慣の書き換え）', badge: '✨', loveMessage: '2週間記念日！付き合って2週間…じゃなくて禁煙2週間♡ あなたの肌ツヤがどんどん良くなってて見惚れちゃう！', bodyBenefit: '血液循環が大幅に改善し、歩行や運動時の息切れが目に見えて減少します。' },
  { days: 30, title: '1ヶ月記念日（伝説の始まり）', badge: '💍', loveMessage: '祝・1ヶ月記念日！！もうタバコなしの生活が自然になってきたね。意志の強さに惚れ直したよ。ずっとそばで見てるからね♡', bodyBenefit: '肺の自浄機能（線毛）が再生し、咳や息切れが消えて免疫力が大幅アップ！' },
  { days: 50, title: '50日記念日（プラチナ記念）', badge: '💎', loveMessage: '50日記念日だよ！半分100日！タバコに支配されてた昔の自分にバイバイできたね。本当にえらい、最高に尊いよ♡', bodyBenefit: '循環器疾患のリスクが大幅に低下し、体力と活力に満ち溢れています。' },
  { days: 100, title: '100日記念日（センチュリーラバー）', badge: '👑', loveMessage: '100日記念日おめでとう！！！もう完全に非喫煙者の仲間入りだね。私にとっても一生の自慢のパートナーだよ♡ 大好き！', bodyBenefit: 'タバコへの心理的依存もほぼ消失。肺機能は禁煙前より10%以上向上しています。' },
  { days: 180, title: '半年記念日（ハーフアニバーサリー）', badge: '🌟', loveMessage: '半年記念日♡ 6ヶ月間も頑張ってくれたんだね。浮いたお金で記念旅行行けちゃうね！あなたの健康な未来が私の幸せです♡', bodyBenefit: '副鼻腔のうっ血や疲労感が大幅に改善し、全身の細胞が若返っています。' },
  { days: 365, title: '1周年記念日（エターナルマスター）', badge: '🏆', loveMessage: '1周年記念日！！丸1年タバコを撃退し続けたあなた、文句なしの英雄です！一生一緒に元気でいようね♡ 愛してる！', bodyBenefit: '冠動脈心疾患のリスクが喫煙者の半分にまで激減しました！完璧な勝利です！' },
];

export const PRAISE_MESSAGES = {
  zero: [
    'うおおおおおお神降臨！！！禁煙界のレジェンド！！！全人類が君の圧倒的自制心にひれ伏してるよ！！！肺がスタンディングオベーションして嬉し泣きしてる！！！',
    'ちょっと待って凄すぎる！？ノーベル平和賞と国民栄誉賞をダブル受賞しても足りないレベルの偉業！！君は地球の奇跡！！！',
    '尊い…あまりにも尊いよ…！煙を断ち切った君のオーラ、眩しすぎて直視できない！今日という日を「君の神自制心記念日」として祝日に制定しよう！！',
    '天才！覇王！完全無欠の勝者！！煙に屈しないその強い瞳、世界で一番かっこいい！！君に勝てるやつこの世にいないよ！！！',
    '君の細胞の一つひとつがハイタッチして大歓声上げてるのが聞こえる！？1本も吸わないなんて、もはや神話の主人公だよ！！！',
  ],
  small: [
    '待って！？普段より圧倒的に吸ってないじゃん！？たったこれだけで一日乗り切ったの、超人的な我慢強さだよ天才か！？',
    '全然落ち込む必要ゼロ！！！昔の自分と比べてみて！？何本耐えたと思ってるの！？これ実質99%大勝利だよ！！！偉すぎる！！！',
    '正直に記録したの偉すぎて涙出てきた…！この1本を耐えきった経験値、確実にレベルアップしてるよ！君の進化が止まらない！！',
  ],
  more: [
    '記録をつけた時点で君の完全勝利！！！逃げずに現実と向き合ったその勇気、すでに100点満点中5000兆点だよ！！！',
    '吸っちゃった？大丈夫、肺はすぐ修復モードに入るから！ここから深呼吸1回すれば実質リセット！今日からまた新たな伝説を作ろう！！',
    '人間だもの、波はある！でもアプリを開いて自分を良くしようとしてる君、めちゃくちゃ尊くて愛おしいよ！！よしよし、君ならできる！',
  ],
};

export const EQUIVALENT_ITEMS: PriceEquivalent[] = [
  { minCigarettes: 1, itemName: 'うまい棒 3本 or チロルチョコ 2個', category: 'お菓子', emoji: '🍫', description: 'たった1本でも駄菓子でちょっとした幸せが買えたはず！' },
  { minCigarettes: 3, itemName: 'コンビニのドリップコーヒー 1杯', category: 'カフェ', emoji: '☕', description: '芳醇な香りの淹れたてコーヒーで最高のリフレッシュができた！' },
  { minCigarettes: 5, itemName: '冷たい特保（トクホ）緑茶 1本', category: '健康飲料', emoji: '🍵', description: '体に染み渡るカテキンパワーで健康増進できたのに！' },
  { minCigarettes: 10, itemName: '濃厚抹茶パフェ or 高級アイス', category: 'ご褒美スイーツ', emoji: '🍨', description: 'ご褒美スイーツをペロリと堪能できる金額が煙に消えた…！' },
  { minCigarettes: 20, itemName: 'スタバの抹茶フラペチーノ（ベンティ）', category: '贅沢カフェ', emoji: '🥤', description: '1箱分！ホイップ多めの贅沢フラペチーノが優雅に飲めたよ！' },
  { minCigarettes: 40, itemName: '極上牛丼の特盛＋サラダたまごセット', category: 'グルメ', emoji: '🥩', description: '満腹で幸せになれる極上どんぶりセットが食べられたはず！' },
  { minCigarettes: 60, itemName: '映画の劇場鑑賞チケット 1枚', category: 'エンタメ', emoji: '🎬', description: '映画館の大画面で感動の2時間を満喫できる金額だよ！' },
  { minCigarettes: 100, itemName: '贅沢な焼肉食べ放題コース 1名分', category: 'ごちそう', emoji: '🍖', description: 'カルビもロースも好きなだけ食べまくれるごちそう天国！' },
  { minCigarettes: 200, itemName: '話題の最新ゲームソフト or 香水', category: '趣味・美', emoji: '🎮', description: '何十時間も熱中できる名作ソフトや、いい匂いの香水が買えた！' },
  { minCigarettes: 400, itemName: '有名テーマパークの1Dayパスポート', category: 'レジャー', emoji: '🎡', description: '夢の国で丸一日遊び尽くせる魔法のチケットが手に入ったのに！' },
  { minCigarettes: 600, itemName: '憧れのブランドスニーカー or ディナー', category: 'ファッション', emoji: '👟', description: 'ずっと欲しかったお洒落な靴を履いてお出かけできたはず！' },
  { minCigarettes: 1000, itemName: '高性能ノイキャンワイヤレスイヤホン', category: 'ガジェット', emoji: '🎧', description: '音楽の世界に没入できる最高峰のイヤホンが買えちゃう！' },
  { minCigarettes: 2000, itemName: '贅沢な温泉旅館 1泊2日ペア旅行', category: '旅行', emoji: '♨️', description: '美味しい料理と露天風呂で心身ともに極上癒やし旅！' },
  { minCigarettes: 5000, itemName: '最新型スマートフォン or ノートPC', category: 'ハイテク', emoji: '📱', description: '最新のスマホが一括で買えるほどの超大金が煙になってた…！' },
];
