export interface Pattern {
  id: string
  name: string
  category: 'Reversal' | 'Continuation'
  bias: 'Bullish' | 'Bearish'
  reliability: 1 | 2 | 3 | 4 | 5
  description: string
  identification: string[]
  entry: string
  stop: string
  target: string
  psychology: string
}

export const PATTERNS: Pattern[] = [
  {
    id: 'head-shoulders',
    name: 'Head & Shoulders (Top)',
    category: 'Reversal',
    bias: 'Bearish',
    reliability: 4,
    description:
      'The classic trend-exhaustion pattern. Three peaks: a higher middle peak (the head) flanked by two lower peaks (the shoulders). The uptrend is dying because each push higher attracts fewer buyers.',
    identification: [
      'A prior uptrend must exist — this pattern reverses something.',
      'Left shoulder: rally to a peak, then a pullback.',
      'Head: a higher high, then another pullback to roughly the same level (the neckline).',
      'Right shoulder: a lower high — buyers fail to reclaim the head.',
      'Volume ideally shrinks from left shoulder → head → right shoulder.',
      'The trigger is a decisive close BELOW the neckline, not the pattern forming.',
    ],
    entry: 'Short on a confirmed close below the neckline, or on the retest of the neckline from below (safer, slightly worse price).',
    stop: 'Above the right shoulder high. If price can reclaim that, the bearish thesis is wrong.',
    target: 'Measure the head-to-neckline distance and project it down from the breakout point.',
    psychology:
      'The head is euphoria; the right shoulder is denial. The neckline break is the moment late buyers realize they are trapped — their stop losses become your fuel.',
  },
  {
    id: 'inverse-head-shoulders',
    name: 'Inverse Head & Shoulders',
    category: 'Reversal',
    bias: 'Bullish',
    reliability: 4,
    description:
      'The mirror image: a bottoming structure with three troughs, the middle one deepest. Sellers exhaust themselves, and each dip finds buyers earlier than the last.',
    identification: [
      'A prior downtrend must exist.',
      'Left shoulder: selloff to a low, then a bounce.',
      'Head: a lower low (capitulation), then a bounce to roughly the same neckline.',
      'Right shoulder: a higher low — sellers fail to make a new low.',
      'Trigger: decisive close ABOVE the neckline, ideally with expanding volume.',
    ],
    entry: 'Long on the neckline breakout close, or on the pullback retest of the neckline.',
    stop: 'Below the right shoulder low.',
    target: 'Head-to-neckline distance projected up from the breakout.',
    psychology:
      'The head is maximum despair — that is where the smart money accumulates. The right shoulder proves sellers no longer have the strength to push lower.',
  },
  {
    id: 'double-top',
    name: 'Double Top',
    category: 'Reversal',
    bias: 'Bearish',
    reliability: 3,
    description:
      'Price tests the same high twice and fails both times. The level becomes a visible ceiling where supply overwhelms demand.',
    identification: [
      'Two distinct peaks at roughly the same price (within ~1-3%).',
      'A meaningful pullback between the peaks (the valley).',
      'Second peak often has lower volume and weaker momentum (check RSI divergence).',
      'Trigger: close below the valley low.',
    ],
    entry: 'Short on the break of the valley low, or on its retest.',
    stop: 'Above the twin peaks.',
    target: 'Peak-to-valley height projected down from the valley.',
    psychology:
      'Buyers who missed the first top buy the second test expecting a breakout. When it fails, their trapped longs accelerate the decline.',
  },
  {
    id: 'double-bottom',
    name: 'Double Bottom',
    category: 'Reversal',
    bias: 'Bullish',
    reliability: 3,
    description:
      'The "W". Price tests a low twice, holds both times, and the floor becomes obvious. Sellers are done; the path of least resistance flips up.',
    identification: [
      'Two troughs at roughly the same level after a decline.',
      'A rally between them defines the neckline (the middle peak).',
      'Second low undercutting the first slightly, then recovering fast, is a bullish "spring" — a trap for shorts.',
      'Trigger: close above the middle peak.',
    ],
    entry: 'Long on the neckline break, or scale in at the second bottom with a tight stop (aggressive).',
    stop: 'Below the double-bottom lows.',
    target: 'Bottom-to-neckline height projected up.',
    psychology:
      'The second test shakes out the last weak hands. Everyone who wanted to sell has sold — only buyers are left.',
  },
  {
    id: 'ascending-triangle',
    name: 'Ascending Triangle',
    category: 'Continuation',
    bias: 'Bullish',
    reliability: 3,
    description:
      'Flat resistance on top, rising support below. Buyers get progressively more aggressive while sellers defend one price. Pressure builds until the ceiling gives way.',
    identification: [
      'At least two roughly equal highs forming horizontal resistance.',
      'At least two higher lows forming a rising trendline.',
      'The pattern should slope up into the apex — tightening action.',
      'Trigger: close above horizontal resistance with volume.',
    ],
    entry: 'Long on the resistance breakout or on the throwback retest of the broken line.',
    stop: 'Below the most recent higher low, or below the rising trendline.',
    target: 'Triangle height (resistance minus lowest low) projected up from the breakout.',
    psychology:
      'Sellers keep hitting the same bid at the ceiling, but buyers refuse to wait for deep pullbacks. Each higher low tells you demand is strangling supply.',
  },
  {
    id: 'bull-flag',
    name: 'Bull Flag',
    category: 'Continuation',
    bias: 'Bullish',
    reliability: 4,
    description:
      'A violent rally (the flagpole) followed by a shallow, orderly pullback or sideways drift (the flag). The market digests gains without giving them back — then continues.',
    identification: [
      'Flagpole: a near-vertical move, ideally on big volume.',
      'Flag: a pullback of no more than ~38-50% of the pole, sloping gently down or sideways, on shrinking volume.',
      'The flag should NOT retrace deeply — deep retracements are reversals in disguise.',
      'Trigger: break above the flag high.',
    ],
    entry: 'Long on the flag-high breakout.',
    stop: 'Below the flag low.',
    target: 'Flagpole length projected up from the breakout (the "measured move").',
    psychology:
      'Early buyers take small profits while everyone who missed the move waits to buy any dip. The shallow flag tells you dips are being bought instantly.',
  },
  {
    id: 'cup-and-handle',
    name: 'Cup & Handle',
    category: 'Continuation',
    bias: 'Bullish',
    reliability: 3,
    description:
      'A long, rounded bottoming arc (the cup) followed by a small downward drift (the handle) just below the prior high. Patience is the point: the market slowly absorbs all overhead supply.',
    identification: [
      'Cup: a U-shaped (not V-shaped) recovery back to the prior high, over weeks to months.',
      'Handle: a small pullback of roughly 8-15% below the cup rim, on low volume.',
      'The handle must form in the upper half of the cup.',
      'Trigger: breakout above the handle high / cup rim (the "pivot point" in CAN SLIM terms).',
    ],
    entry: 'Long at the pivot breakout — buy within ~5% of the pivot, never chase extended.',
    stop: 'Below the handle low, typically 7-8% under entry.',
    target: 'Cup depth projected up from the breakout.',
    psychology:
      'The cup wears out every seller from the old high. The handle shakes out the last weak holders. What is left is a clean runway.',
  },
  {
    id: 'falling-wedge',
    name: 'Falling Wedge',
    category: 'Reversal',
    bias: 'Bullish',
    reliability: 3,
    description:
      'Price makes lower highs and lower lows, but the two trendlines CONVERGE — the selloff is losing range and energy. Coiled downside resolves up more often than down.',
    identification: [
      'Both highs and lows decline, but the lows fall slower than the highs.',
      'At least two touches of each converging trendline.',
      'Volume typically contracts as the wedge develops.',
      'Trigger: close above the upper trendline.',
    ],
    entry: 'Long on the upper trendline breakout.',
    stop: 'Below the wedge low.',
    target: 'Wedge height at its widest point projected up from the breakout.',
    psychology:
      'Sellers still control direction but are losing power with every push. When they fail to expand the range, trapped shorts flip the move violently upward.',
  },
]

// ---------- strategies ----------

export interface Strategy {
  id: string
  name: string
  style: string
  timeframe: string
  bestFor: string
  difficulty: 1 | 2 | 3 | 4 | 5
  thesis: string
  rules: string[]
  entry: string
  stopLoss: string
  takeProfit: string
  whenItWorks: string
  whenItFails: string
  mistakes: string[]
}

export const STRATEGIES: Strategy[] = [
  {
    id: 'trend-pullback',
    name: 'Trend Pullback (Buy the Dip)',
    style: 'Swing',
    timeframe: 'Daily / 4H',
    bestFor: 'S&P 500, NASDAQ, large-cap stocks, BTC in uptrends',
    difficulty: 2,
    thesis:
      'Strong trends do not move in straight lines. Instead of chasing green candles, wait for price to pull back into a rising 20-period average and resume. You get trend direction WITH a good price.',
    rules: [
      'Only trade in the direction of the trend: price above rising MA20 > MA50 = longs only.',
      'Wait for a pullback to (or slightly below) the MA20.',
      'Require a rejection sign: bullish engulfing candle, hammer, or RSI resetting toward 40-50 without breaking structure.',
      'Never catch a falling knife on the first red day — let the pullback stabilize.',
    ],
    entry: 'Buy when price reclaims the MA20 or breaks the high of the reversal candle.',
    stopLoss: 'Below the pullback low or 1.5× ATR below entry, whichever is tighter but safe.',
    takeProfit: 'First target = prior high; trail the rest below the MA20 and let the trend pay you.',
    whenItWorks: 'Clean trending regimes — exactly what the Dashboard regime read flags as "uptrend".',
    whenItFails: 'Choppy ranges: the MA20 whipsaws and every "dip" keeps dipping. Stand down when price crosses MA20 both ways repeatedly.',
    mistakes: ['Buying every red candle without waiting for stabilization', 'Using it in a downtrend ("it is cheap now" is not a strategy)', 'No stop because "it always comes back"'],
  },
  {
    id: 'breakout',
    name: 'Range Breakout',
    style: 'Swing / Momentum',
    timeframe: 'Daily / 1H',
    bestFor: 'Stocks after consolidation, crypto after compression',
    difficulty: 3,
    thesis:
      'Price compresses into a tight range as buyers and sellers reach temporary equilibrium. The breakout side reveals who won — and trapped traders on the wrong side fuel the move.',
    rules: [
      'Identify a range with at least 2-3 touches of both boundaries.',
      'The tighter and longer the compression, the better the eventual move.',
      'Trade only the breakout candle that CLOSES outside the range, ideally with volume expansion.',
      'Optional safer variant: wait for the retest of the broken level to hold.',
    ],
    entry: 'On the close beyond the range boundary, or on the successful retest.',
    stopLoss: 'Back inside the range (below the breakout candle low for longs). A true breakout should not re-enter the box.',
    takeProfit: 'Measured move: range height projected from the breakout point. Take partials at 1R and 2R.',
    whenItWorks: 'After earnings digestion, volatility compression, long bases. Great for NVDA-style names and BTC consolidations.',
    whenItFails: 'Low-liquidity sessions and news-driven fake-outs ("stop hunts"). If it snaps back into the range immediately, exit — do not hope.',
    mistakes: ['Anticipating the breakout before the close', 'Ignoring volume', 'Averaging into a failed breakout'],
  },
  {
    id: 'rsi-reversal',
    name: 'RSI Mean Reversion',
    style: 'Counter-trend swing',
    timeframe: 'Daily',
    bestFor: 'Range-bound indices, gold, large caps',
    difficulty: 3,
    thesis:
      'In sideways markets, extremes revert. When RSI(14) pushes above 70 or below 30 in a RANGE (not a trend), price is stretched and statistically likely to snap back toward the mean.',
    rules: [
      'ONLY in a confirmed range — check the Dashboard: if trend reads "range", this is on the menu.',
      'RSI < 30 → look for longs; RSI > 70 → look for shorts/trimming longs.',
      'Wait for RSI to cross BACK through the level (30 up / 70 down) — the turn, not the extreme.',
      'Confluence with range support/resistance makes the A+ setup.',
    ],
    entry: 'On the RSI cross back, with price at a known range edge.',
    stopLoss: 'Beyond the recent extreme. If the extreme extends, the range may be breaking — wrong trade.',
    takeProfit: 'The range midpoint first, the opposite edge second.',
    whenItWorks: 'Summer chop, post-trend digestion, gold in consolidation.',
    whenItFails: 'Strong trends — RSI can stay overbought for weeks while price doubles. Never fade a trending market with this.',
    mistakes: ['Shorting overbought in a bull trend', 'Buying oversold without waiting for the turn', 'Using it during news events'],
  },
  {
    id: 'golden-cross',
    name: 'MA Cross (Trend Filter)',
    style: 'Position / Regime filter',
    timeframe: 'Daily / Weekly',
    bestFor: 'S&P 500, NASDAQ, BTC — long-term exposure decisions',
    difficulty: 1,
    thesis:
      'You do not need to predict markets — you need to be long when conditions are favorable and cautious when they are not. The 50/200-day relationship ("golden cross" / "death cross") is a crude but effective regime filter.',
    rules: [
      'MA50 above MA200 and both rising → risk-on: full position sizing allowed, pullbacks are opportunities.',
      'MA50 below MA200 and both falling → risk-off: cut size in half or more, rallies are suspect.',
      'Use the 20/50 cross as the faster trigger for entries within the regime.',
      'This is a filter for HOW BIG to trade, not a precise entry signal.',
    ],
    entry: 'Combine with Trend Pullback entries during risk-on regimes.',
    stopLoss: 'Regime change (50 crossing below 200) = exit campaign trades regardless of P&L.',
    takeProfit: 'Hold through the regime; the filter itself is the exit.',
    whenItWorks: 'Secular bull and bear markets — 2020-2021 long, 2022 avoided.',
    whenItFails: 'Sideways years where crosses whipsaw. Accept the small losses; they are the insurance premium.',
    mistakes: ['Treating the cross as a day-trading signal', 'Ignoring it because "this time is different"', 'Full leverage during death-cross regimes'],
  },
  {
    id: 'crypto-momentum',
    name: 'Crypto Momentum Rotation',
    style: 'Swing',
    timeframe: 'Daily / 4H',
    bestFor: 'BTC, ETH, SOL',
    difficulty: 3,
    thesis:
      'Crypto moves in violent momentum waves led by BTC. When BTC trends and holds above its 20D, altcoins (ETH, SOL) typically amplify the move with a lag. Rotate exposure, do not chase vertical candles.',
    rules: [
      'BTC above rising MA20 = crypto risk-on. Below = flat or minimal exposure.',
      'Enter alts only after BTC has made its move and is consolidating (the "alt window").',
      'Buy alts at their own MA20 pullbacks, never after >15% single-day candles.',
      'BTC dominance rising + BTC price falling = get out of alts first, they bleed faster.',
    ],
    entry: 'Alt pullback to MA20 while BTC holds its MA20.',
    stopLoss: 'Below the swing low OR below BTC losing its MA20 — whichever triggers first.',
    takeProfit: 'Scale out into strength: 1/3 at +1R, 1/3 at +2R, trail the rest. Crypto round-trips winners brutally.',
    whenItWorks: 'Post-halving cycles, ETF-flow-driven BTC trends, broad risk-on tapes.',
    whenItFails: 'Weekend low-liquidity traps, regulatory headlines, correlation flips where everything dumps together.',
    mistakes: ['Full-sizing alts while BTC is below its MA20', 'Not taking profits on parabolic moves', 'Marrying a coin'],
  },
  {
    id: 'gold-safe-haven',
    name: 'Gold Regime Switch',
    style: 'Position / Hedge',
    timeframe: 'Daily / Weekly',
    bestFor: 'Gold (GC=F / GLD) as portfolio hedge',
    difficulty: 2,
    thesis:
      'Gold is not a trading vehicle first — it is a regime detector. Gold rising while equities fall = defensive rotation. Gold rising WITH equities on falling real yields = liquidity trade. Learn to read it before you trade it.',
    rules: [
      'Watch the Dashboard: gold up + SPX down on the week = defense; consider hedges and smaller equity size.',
      'Gold in uptrend (above rising MA20/50) = hold core position, buy MA20 pullbacks.',
      'Gold below falling MA50 = do not force longs; the hedge is not paying.',
      'Size gold as insurance (5-15% of portfolio), not as a lottery ticket.',
    ],
    entry: 'MA20 pullbacks within an uptrend, or range breakouts after long consolidations.',
    stopLoss: 'Below the consolidation low or the MA50.',
    takeProfit: 'Trail below the MA20; gold trends for months when it trends.',
    whenItWorks: 'Rate-cut cycles, geopolitical stress, equity drawdowns, dollar weakness.',
    whenItFails: 'Strong-dollar, rising-real-yield environments — gold goes sideways for quarters and bleeds impatient traders.',
    mistakes: ['Trading gold like a meme stock', 'Ignoring real yields', 'Oversizing the hedge until it IS the risk'],
  },
]

// ---------- daily lessons ----------

export interface Lesson {
  day: number
  title: string
  category: 'Markets' | 'Technical' | 'Risk' | 'Mindset' | 'Strategy'
  minutes: number
  body: string[]
  takeaway: string
  action: string
}

export const LESSONS: Lesson[] = [
  {
    day: 1,
    title: 'Price is the only truth',
    category: 'Markets',
    minutes: 3,
    body: [
      'Everything you will ever learn about markets — indicators, patterns, fundamentals, news — is an attempt to explain one thing: price. Price is the real-time vote of every participant on the planet, weighted by money.',
      'Opinions are free and worthless. Positions cost money and reveal conviction. When someone tells you a stock "should" go up, ask where price actually is. If price disagrees with the thesis, price is right and the thesis is early — which in trading is the same as wrong.',
      'This is why your Dashboard starts with price, trend, and levels. Learn to read what IS happening before forming opinions about what SHOULD happen.',
    ],
    takeaway: 'Trade what you see, not what you think.',
    action: 'Open the Dashboard, pick one asset, and describe its trend in one sentence without using the words "should" or "will".',
  },
  {
    day: 2,
    title: 'The trend is a filter, not a prediction',
    category: 'Technical',
    minutes: 3,
    body: [
      'A trend does not tell you what happens next. It tells you which trades have the wind at their back. In an uptrend (price above rising MA20 > MA50), longs have a statistical edge. In a downtrend, shorts and cash do.',
      'Most losing trades come from fighting the trend: shorting strength because it "feels high" or buying weakness because it "feels cheap". Feelings are not edge.',
      'Your only job at the start of each day: name the regime. Uptrend, downtrend, or range. Everything else — entries, size, aggression — flows from that one decision.',
    ],
    takeaway: 'Name the regime first; every other decision depends on it.',
    action: 'Check today\'s Regime Read on the Dashboard. Write down which strategies from the Playbook fit this regime.',
  },
  {
    day: 3,
    title: 'Risk one percent, sleep at night',
    category: 'Risk',
    minutes: 4,
    body: [
      'The single rule that separates survivors from blown accounts: never risk more than 1% of your account on one trade. Risk = (entry − stop) × size. With 1% risk, you can be wrong 20 times in a row and still have 82% of your account. Without it, five bad trades end your career.',
      'Beginners size positions by conviction ("I feel great about this one — go big"). Professionals size by risk. Conviction is a feeling; risk is a number.',
      'Use the Position Sizer in Tools today. Notice how the stop distance — not your confidence — determines the size.',
    ],
    takeaway: 'Position size is derived from your stop, never from your confidence.',
    action: 'Run three hypothetical trades through the Position Sizer with different stop distances. See how size changes.',
  },
  {
    day: 4,
    title: 'Support and resistance are zones, not lines',
    category: 'Technical',
    minutes: 3,
    body: [
      'A level like "SPX 5,800" is not a wall — it is a neighborhood where supply and demand previously battled. Price will overshoot, undershoot, and fake you out around it.',
      'Old resistance becomes new support (and vice versa) because humans anchor: people who sold at a level feel relief when price returns and buy back; people who bought feel fear and sell into breakeven.',
      'Practical rule: treat levels as zones of ±0.5-1%, and put stops OUTSIDE the zone, not exactly at the line where everyone else\'s stops sit.',
    ],
    takeaway: 'Place stops beyond the zone, not on the line.',
    action: 'Open any symbol detail on the Dashboard and find the 60-day support/resistance. Where would stops cluster?',
  },
  {
    day: 5,
    title: 'Losses are tuition, not failure',
    category: 'Mindset',
    minutes: 3,
    body: [
      'A stopped-out trade that followed your rules is a GOOD trade that lost money. A winning trade that broke your rules is a BAD trade that happened to pay. Confusing these two is how gamblers are made.',
      'Your journal judges process, not P&L. Did you follow the setup? Was size right? Was the stop where the thesis died? If yes, the loss is simply the cost of doing business — tuition paid for information.',
      'The market will always offer another trade. Your account only survives if today\'s loss stays small enough to trade tomorrow.',
    ],
    takeaway: 'Judge every trade by process, not by outcome.',
    action: 'Log one past trade (real or paper) in the Journal and grade it on process, not profit.',
  },
  {
    day: 6,
    title: 'Volume confirms, price decides',
    category: 'Technical',
    minutes: 3,
    body: [
      'Price can move on thin volume and it means little. Breakouts on heavy volume mean institutions are behind the move; breakouts on no volume are traps waiting for you.',
      'In patterns, the ideal sequence is: volume expands on the impulsive part (flagpole, head), contracts during consolidation (flag, handle), and explodes on the trigger (neckline break, range breakout).',
      'No volume data on your screen? Then demand stronger price confirmation: a decisive CLOSE beyond the level, not an intraday poke.',
    ],
    takeaway: 'A breakout without volume is a rumor; with volume, it is news.',
    action: 'Look at the last big move in BTC or NVDA. Did volume (or candle conviction) expand on the breakout day?',
  },
  {
    day: 7,
    title: 'Risk/reward: the math of survival',
    category: 'Risk',
    minutes: 4,
    body: [
      'If you risk $100 to make $300 (a 3R trade), you only need to win 26% of the time to break even. If you risk $300 to make $100, you need to win 76% of the time. Same market, opposite math.',
      'Amateurs ask "will this trade win?" Professionals ask "what do I make when right vs lose when wrong?" You cannot control win rate. You can fully control R:R by choosing entries near stops and refusing bad asymmetry.',
      'Minimum standard for swing trades: 2R. Below that, pass — there will be another trade tomorrow.',
    ],
    takeaway: 'Never enter before knowing the stop, the target, and the R multiple.',
    action: 'Use the R:R Calculator in Tools on a setup you are watching. If it is under 2R, write down why you will skip it.',
  },
  {
    day: 8,
    title: 'Head & Shoulders: the anatomy of a top',
    category: 'Strategy',
    minutes: 4,
    body: [
      'Revisit the Head & Shoulders card in the Pattern Trainer. Burn in the sequence: left shoulder (strength), head (euphoria), right shoulder (failure), neckline break (trigger).',
      'The most common error is shorting the right shoulder BEFORE the neckline breaks. Patterns are not trades until they trigger. A right shoulder that holds becomes a higher low — a bullish structure.',
      'The retest of the broken neckline is the highest-probability entry: trapped longs sell into breakeven, giving you a defined, low-risk short.',
    ],
    takeaway: 'A pattern is a hypothesis; the trigger is the trade.',
    action: 'Take the Pattern Quiz in the Trainer until you identify H&S and inverse H&S correctly 3 times.',
  },
  {
    day: 9,
    title: 'Overtrading: the silent account killer',
    category: 'Mindset',
    minutes: 3,
    body: [
      'Every trade has a cost: spread, fees, slippage, and attention. Twenty mediocre trades a day lose to two planned trades a week — mathematically and psychologically.',
      'Overtrading is emotional: boredom, revenge after a loss, FOMO after a win. Notice that none of those are market signals. The fix is structural: maximum trades per day (e.g. 2), and a checklist that must pass before entry.',
      'Boredom is not a setup. If there is no A+ trade, the professional position is flat.',
    ],
    takeaway: 'You are paid for waiting, not for clicking.',
    action: 'Set your personal daily trade limit in the Journal notes and honor it for one week.',
  },
  {
    day: 10,
    title: 'Moving averages: why they work',
    category: 'Technical',
    minutes: 3,
    body: [
      'A moving average is the average cost of everyone who bought in the last N days. When price pulls back to the MA20 in an uptrend, the average recent buyer is at breakeven — and winners defending their positions buy more. That is why MAs "bounce" price.',
      'MAs are self-fulfilling because enough traders watch them — use the same ones everyone uses (20, 50, 200) rather than exotic periods.',
      'Slope matters more than touch. A rising MA20 is demand; a flat one is noise; a falling one is supply.',
    ],
    takeaway: 'Trade the 20/50/200 like everyone else — the crowd is what makes them work.',
    action: 'On any Dashboard chart, note whether MA20 and MA50 are rising, flat, or falling — and what that implies.',
  },
  {
    day: 11,
    title: 'The stop loss is your best employee',
    category: 'Risk',
    minutes: 3,
    body: [
      'A stop loss is not an admission of failure — it is a pre-commitment made while you are rational, protecting you from the version of you that is emotional. In the heat of a loss, nobody thinks clearly.',
      'Place stops where the trade thesis is objectively wrong: below the pattern, below the swing low, beyond the level. Not at an arbitrary "-5%" and never at your pain threshold.',
      'Moving a stop farther away after entry is the single most reliable predictor of account death. You may move stops toward profit, never toward loss.',
    ],
    takeaway: 'Stops move one direction only: toward locking in profit.',
    action: 'For your next trade, write the stop reason as a sentence ("thesis dies if price closes below X because...") before entering.',
  },
  {
    day: 12,
    title: 'Breakouts and the retest',
    category: 'Strategy',
    minutes: 4,
    body: [
      'Review the Range Breakout strategy in the Playbook. The hardest part is not spotting the box — it is handling the moment of the break. Chasing the first spike means buying the top of the trap when it fails.',
      'The professional entry is the retest: price breaks out, pulls back to the broken level, and holds. Resistance becoming support, live in front of you. Slightly worse price, dramatically better odds.',
      'If there is no retest and price runs without you — let it go. Missing a move costs nothing. Chasing one can cost everything.',
    ],
    takeaway: 'The retest is the entry; the chase is the donation.',
    action: 'Find one recent breakout on the Dashboard. Did it retest? What would each entry have cost/made?',
  },
  {
    day: 13,
    title: 'FOMO: the fear that empties accounts',
    category: 'Mindset',
    minutes: 3,
    body: [
      'FOMO is the belief that this move is the last opportunity ever. It peaks exactly at tops, because the same emotion driving you to buy is driving everyone else — and when the last FOMO buyer is in, there is nobody left to push price higher.',
      'Antidote 1: the market opens again tomorrow. Antidote 2: if you missed the entry, the R:R is gone — you would be buying where early buyers sell to you. Antidote 3: vertical moves retrace; flags and pullbacks give second entries.',
      'Log every FOMO urge in your Journal with the outcome one week later. The data will cure you faster than willpower.',
    ],
    takeaway: 'If you feel urgent, you are the exit liquidity.',
    action: 'Add an "emotion" note to your next three journal entries — name the feeling before you name the setup.',
  },
  {
    day: 14,
    title: 'RSI: momentum, not magic',
    category: 'Technical',
    minutes: 3,
    body: [
      'RSI measures the speed of recent up-moves vs down-moves on a 0-100 scale. Above 70 = overbought, below 30 = oversold. But "overbought" means strong, not "must fall" — in bull trends RSI lives above 70 for weeks.',
      'The two uses that actually work: (1) in ranges, fade RSI extremes back to the mean; (2) in trends, watch DIVERGENCE — price makes a higher high but RSI makes a lower high = momentum is quietly dying.',
      'Your Dashboard shows RSI on every asset. Pair it with the trend badge: RSI > 70 + uptrend = hold, not short. RSI > 70 + range = caution.',
    ],
    takeaway: 'Overbought is a condition, not a signal. Context decides.',
    action: 'Find one asset on the Dashboard with RSI above 65. Is it trending or ranging? What does RSI therefore suggest?',
  },
  {
    day: 15,
    title: 'Correlation: your hidden position size',
    category: 'Risk',
    minutes: 4,
    body: [
      'Owning NVDA, MSFT, and QQQ is not three positions — in a selloff it is one giant tech position. Correlated trades multiply your real risk while feeling diversified.',
      'Typical clusters: mega-cap tech moves together; BTC and ETH move together (and often with NASDAQ in risk-off); gold sometimes hedges stocks, sometimes joins them; the dollar sits underneath everything.',
      'Rule of thumb: treat highly correlated positions as one when summing risk. Three 1% tech risks = 3% on one idea. Your Dashboard shows the five core assets side by side for exactly this reason.',
    ],
    takeaway: 'Count correlated positions as one trade when sizing.',
    action: 'List your current (or hypothetical) positions and group them by correlation cluster. What is your real total risk?',
  },
  {
    day: 16,
    title: 'Flags: trading continuation',
    category: 'Strategy',
    minutes: 4,
    body: [
      'Review the Bull Flag in the Pattern Trainer. The flag works because it separates strong moves from noise: a violent pole proves conviction, a shallow flag proves nobody wants to sell.',
      'The failure mode is the deep pullback. If the "flag" retraces more than half the pole, it is not a flag — it is a reversal wearing a flag costume. Depth is the tell.',
      'Measured-move targets (pole length projected from breakout) work surprisingly often because algos and humans both trade them.',
    ],
    takeaway: 'Shallow flag = continuation; deep "flag" = reversal.',
    action: 'Take the Pattern Quiz and specifically drill flag vs wedge identification.',
  },
  {
    day: 17,
    title: 'Revenge trading: the second loss is optional',
    category: 'Mindset',
    minutes: 3,
    body: [
      'After a loss, your brain demands the money back — immediately, from the same market that took it. That urge produces the worst trades of your life: bigger size, worse setups, no plan.',
      'The loss is gone. The market does not owe you, and the next trade does not know the last one existed. Revenge trades trade your ego, not the chart.',
      'Structural fix: after any stopped-out loss, mandatory 30-minute break and a written journal entry before the next trade. Boring? Yes. That is the point.',
    ],
    takeaway: 'The market took tuition; do not pay it twice in one day.',
    action: 'Write your personal "after a loss" protocol in the Journal and sign it.',
  },
  {
    day: 18,
    title: 'Timeframes: one trade, three charts',
    category: 'Technical',
    minutes: 3,
    body: [
      'A daily uptrend contains 4H pullbacks, which contain 15-minute downtrends. All three are "the trend" depending on your window — this is why traders argue about the same chart.',
      'The professional routine: top-down. Weekly/daily for regime and bias, 4H/1H for the setup, lower for entry timing. Never let a lower timeframe talk you out of a higher-timeframe thesis — or into one.',
      'Match your stop and holding period to the timeframe you traded. A daily-chart stop on a 5-minute attention span is a guaranteed premature exit.',
    ],
    takeaway: 'Decide your timeframe before the trade, then respect its rules.',
    action: 'Label every Dashboard observation you make today with its timeframe: regime (daily), setup, or entry.',
  },
  {
    day: 19,
    title: 'Drawdown: the math that ends careers',
    category: 'Risk',
    minutes: 4,
    body: [
      'Lose 10% and you need +11% to recover. Lose 50% and you need +100%. Lose 90% and you need +900%. Losses compound against you geometrically — capital preservation IS the strategy.',
      'Set a personal circuit breaker: at −5% month, cut size in half; at −10%, stop and review. Professionals have these in writing. Amateurs discover them after the fact.',
      'Your edge is meaningless if a drawdown removes you from the game before it plays out. Survival first, returns second, always.',
    ],
    takeaway: 'You only need to get rich once — protect the pile that gets you there.',
    action: 'Write your circuit-breaker rules in the Journal. Exact numbers, exact actions.',
  },
  {
    day: 20,
    title: 'Crypto is a different animal',
    category: 'Markets',
    minutes: 4,
    body: [
      'Crypto trades 24/7, has no circuit breakers, thinner order books, and reflexive sentiment. Moves of 10% that would be historic in equities are Tuesdays in crypto. Position sizing must respect that volatility — your Position Sizer uses stop distance, which handles this automatically if you let it.',
      'BTC leads. When BTC is below its 20D average, alts bleed regardless of their own charts. When BTC consolidates after a push, alts get their window. Trade the rotation, not the narratives.',
      'Weekends and low-liquidity hours are when stop-hunts happen. Size down or sit out; the Monday chart will still be there.',
    ],
    takeaway: 'Respect crypto volatility with size, not with stops you will ignore.',
    action: 'Compare BTC and ETH volatility on the Dashboard detail view (ann. vol). How does that change position size?',
  },
  {
    day: 21,
    title: 'The journal is the edge',
    category: 'Mindset',
    minutes: 3,
    body: [
      'Every trader has losing streaks. Only journalers know WHY. After 30 logged trades you will see your personal leaks: the setup you always lose on, the time of day you gamble, the emotion preceding your worst trades.',
      'Log the plan BEFORE entry, the emotion during, and the review after. Three lines per trade is enough; consistency beats detail.',
      'Weekly review: sort trades by setup and by emotion. Do more of what works, cut one leak per week. That loop — not any indicator — is how traders actually improve.',
    ],
    takeaway: 'Thirty honest journal entries teach more than three hundred YouTube videos.',
    action: 'Commit to 30 logged trades starting today. Set the target count in a journal note.',
  },
  {
    day: 22,
    title: 'Triangles: compression before expansion',
    category: 'Strategy',
    minutes: 4,
    body: [
      'Review the Ascending Triangle and Falling Wedge in the Pattern Trainer. The shared principle: when the range of movement shrinks, energy is being stored, not lost. Direction comes from the shape (rising lows = buyer aggression), timing comes from the apex.',
      'The best triangles have a flat side — a level everyone can see. Visible levels concentrate orders, and concentrated orders fuel fast breaks.',
      'False breaks happen at the apex when the pattern ran out of energy. Mid-pattern breaks with volume are the real ones.',
    ],
    takeaway: 'Compression is stored energy; the flat side tells you who defends what.',
    action: 'Pattern Quiz until you can separate ascending triangle from falling wedge at a glance.',
  },
  {
    day: 23,
    title: 'Scaling out: selling is harder than buying',
    category: 'Risk',
    minutes: 3,
    body: [
      'Entries get all the attention, but exits make the money. The core tension: cut winners too early and 2R math dies; hold too long and winners round-trip.',
      'The professional compromise is scaling: sell 1/3 at 1R (de-risks the trade emotionally), 1/3 at 2R (banks the math), trail the final third with the MA20 (lets outliers pay for everything).',
      'Also valid: all-out at a fixed target. What is NOT valid: deciding mid-trade based on how your day is going.',
    ],
    takeaway: 'Pick an exit plan before entry and execute it without negotiation.',
    action: 'Add a "planned exit" line to your journal template: target, scale plan, trailing rule.',
  },
  {
    day: 24,
    title: 'News: trade the reaction, not the headline',
    category: 'Markets',
    minutes: 3,
    body: [
      'By the time you read a headline, it is priced in. What is NOT priced in is the difference between the news and expectations. "Great" earnings can tank a stock if the market expected perfection.',
      'The tradable signal is the reaction: good news + price falls = distribution, weakness ahead. Bad news + price rises = accumulation, strength ahead. The divergence between news tone and price reaction is one of the oldest edges in markets.',
      'Retail buys headlines; professionals watch what price does with them.',
    ],
    takeaway: 'Bullish news that cannot lift price is the most bearish signal there is.',
    action: 'Next big headline day, write down the news tone and the closing reaction. Compare.',
  },
  {
    day: 25,
    title: 'Discipline beats intelligence',
    category: 'Mindset',
    minutes: 3,
    body: [
      'Markets are full of brilliant people losing money and average people compounding steadily. The difference is not IQ — it is the ability to follow a simple plan on the days when emotions scream otherwise.',
      'Intelligence is even a liability: smart people invent clever reasons to override their rules. The mediocre-but-disciplined trader just takes the setup, takes the stop, takes the target.',
      'Build the muscle: tiny size, strict rules, perfect execution. Scale the size only after 50 trades of documented discipline.',
    ],
    takeaway: 'A mediocre plan executed perfectly beats a brilliant plan executed emotionally.',
    action: 'Rate your last 5 trades: did you follow your plan exactly? What is your discipline score?',
  },
  {
    day: 26,
    title: 'Double bottoms and the spring',
    category: 'Strategy',
    minutes: 4,
    body: [
      'Review the Double Bottom in the Pattern Trainer, then go deeper: the strongest variant is the "spring" — the second low briefly breaks the first, triggers sell-stops, then snaps back above. That flush is the final transfer from weak hands to strong ones.',
      'Why it works: the breakdown sellers are now trapped. Their buy-to-cover orders plus real buyers create fuel for the rally through the neckline.',
      'Lesson beyond the pattern: obvious levels exist to be swept. If your stop sits exactly at the obvious low, you ARE the liquidity.',
    ],
    takeaway: 'The best reversals first fake the breakdown — stops outside the zone survive it.',
    action: 'Scan your Dashboard watchlist: is anything sitting near a potential double bottom right now?',
  },
  {
    day: 27,
    title: 'Risk of ruin: why leverage lies',
    category: 'Risk',
    minutes: 4,
    body: [
      'With 1% risk per trade and a 45% win rate at 2R, your risk of ruin is effectively zero. With 10% risk per trade, even a GOOD strategy has a real chance of blowing up — a normal 5-loss streak costs 41% of the account.',
      'Leverage does not change your edge; it changes how fast variance finds you. The same strategy that builds wealth at 1× can destroy it at 10×, with identical entries and exits.',
      'Crypto leverage marketing exists because liquidations are the exchange\'s business model. Do not be the product.',
    ],
    takeaway: 'Leverage amplifies variance, not skill. Size so that losing streaks are survivable.',
    action: 'Position Sizer: same trade at 1% vs 5% risk. Model a 5-loss streak for each in the Journal.',
  },
  {
    day: 28,
    title: 'Gold: reading the fear gauge',
    category: 'Markets',
    minutes: 3,
    body: [
      'Gold is a sentiment instrument as much as a commodity. Rising gold + falling stocks = fear. Rising gold + rising stocks + falling dollar = liquidity. Gold has been telling the market\'s story for 5,000 years.',
      'As a trade, gold trends beautifully but slowly — swing timeframes, wide stops, small size. As a hedge, hold a core position and stop staring at it daily.',
      'Watch the weekly relationship on your Dashboard: gold vs SPX divergence is one of the most reliable regime tells you get for free.',
    ],
    takeaway: 'Read gold for information first, trade it second.',
    action: 'Check this week: gold up or down? SPX up or down? What regime does the combination imply?',
  },
  {
    day: 29,
    title: 'Process over prediction',
    category: 'Strategy',
    minutes: 3,
    body: [
      'Nobody — not banks, not funds, not gurus — knows where price goes next. Professionals do not predict; they prepare: "IF price breaks the neckline, THEN I short with stop above the shoulder." Conditional plans, not forecasts.',
      'This reframes trading from being right to being ready. You can be wrong about direction and still make money, because the IF branch that triggered was the right one.',
      'Build your daily routine around scenarios: for each watched asset, write the two IF/THEN branches before the open.',
    ],
    takeaway: 'Replace "I think it goes up" with "IF it breaks X I buy, IF it loses Y I stand down."',
    action: 'Write IF/THEN scenarios for SPX and BTC in your Journal right now.',
  },
  {
    day: 30,
    title: 'The compounding of small edges',
    category: 'Mindset',
    minutes: 4,
    body: [
      'One month of daily 3-minute lessons. A journal with 30 honest entries. A handful of patterns you can actually recognize. None of it feels like much — and that is exactly why it works. Trading skill compounds invisibly, then visibly.',
      'Review your month: what is your win rate by setup? Your discipline score? Your most common emotion? You now have something 90% of traders never build: data about YOURSELF.',
      'The curriculum restarts today — day 1 reads differently now. Keep the loop: regime read in the morning, planned trades only, journal everything, weekly review. That is the whole game.',
    ],
    takeaway: 'Consistency in small things is the entire secret.',
    action: 'Write a one-paragraph review of your first month in the Journal. What is the ONE leak you fix next month?',
  },
]

export const LESSON_CATEGORIES = ['All', 'Markets', 'Technical', 'Risk', 'Mindset', 'Strategy'] as const
