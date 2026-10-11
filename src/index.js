// API: https://sarfe.erfjab.com/api/prices
// فرمت داده: { "BTC/IRT": "21940530582", "BTC/USDT": "83108.7", "usd1": 264400, ... }

function isWithinWorkingHours() {
  const now = new Date();
  const tehranTime = new Date(now.getTime() + (3.5 * 60 * 60 * 1000));
  const hour = tehranTime.getUTCHours();
  return hour >= 10 && hour < 17;
}

function formatNumber(num) {
  const n = parseFloat(num);
  if (isNaN(n)) return num;

  if (n >= 1000) {
    return Math.round(n).toLocaleString('en-US');
  }
  if (n >= 1) {
    return n.toFixed(2);
  }
  // اعداد خیلی کوچک مثل قیمت SHIB
  return n.toPrecision(4);
}

function getEmoji(key) {
  const emojis = {
    // ارزهای دیجیتال
    'BTC': '₿',
    'ETH': '🔷',
    'BNB': '🟡',
    'USDT': '�',
    'SOL': '◎',
    'XRP': '🔵',
    'DOGE': '🐶',
    'ADA': '🔵',
    'TRX': '♦️',
    'TON': '💎',
    // ارزهای خارجی
    'usd': '💵',
    'eur': '💶',
    'gbp': '💷',
    'cad': '🍁',
    'try': '🇹🇷',
    'aed': '🇦🇪',
    'aud': '🇦🇺',
    'cny': '🇨🇳',
    // طلا و سکه
    'gol18': '�',
    'ounce': '🌟',
    'azadi1': '🏆',
    'emami1': '🎖️',
    'azadi1_2': '🥈',
    'azadi1_4': '🥉',
    'mithqal': '�',
  };
  return emojis[key] || '📊';
}

// نام‌های فارسی برای کلیدهای API
const PERSIAN_NAMES = {
  // طلا و سکه
  gol18: 'طلای ۱۸ عیار (گرم)',
  ounce: 'انس جهانی طلا',
  mithqal: 'مثقال طلا',
  azadi1: 'سکه بهار آزادی',
  emami1: 'سکه امامی',
  azadi1_2: 'نیم سکه',
  azadi1_4: 'ربع سکه',
  azadi1g: 'گرمی',
  // ارزهای خارجی
  usd: 'دلار آمریکا',
  eur: 'یورو',
  gbp: 'پوند انگلیس',
  cad: 'دلار کانادا',
  try: 'لیر ترکیه',
  aed: 'درهم امارات',
  aud: 'دلار استرالیا',
  cny: 'یوان چین',
  sar: 'ریال عربستان',
  omr: 'ریال عمان',
  azn: 'منات آذربایجان',
  rub: 'روبل روسیه',
  inr: 'روپیه هند',
  iqd: 'دینار عراق',
  afn: 'افغانی افغانستان',
};

function formatMarketMessage(data) {
  const now = new Date();
  const tehranTime = new Date(now.getTime() + (3.5 * 60 * 60 * 1000));
  const timeStr = tehranTime.toUTCString().replace('GMT', '').trim();

  let message = "🌟 قیمت‌های به‌روز بازار 🌟\n";
  message += `⏰ ${tehranTime.getUTCHours().toString().padStart(2,'0')}:${tehranTime.getUTCMinutes().toString().padStart(2,'0')} - به وقت تهران\n\n`;

  // ─── طلا و سکه ───
  message += "🏅 طلا و سکه:\n";

  const goldItems = [
    { key: 'gol18',    priceKey: 'gol18',    unit: 'تومان' },
    { key: 'ounce',    priceKey: 'ounce',    unit: 'تومان' },
    { key: 'mithqal',  priceKey: 'mithqal',  unit: 'تومان' },
    { key: 'azadi1',   priceKey: 'azadi1',   unit: 'تومان' },
    { key: 'emami1',   priceKey: 'emami1',   unit: 'تومان' },
    { key: 'azadi1_2', priceKey: 'azadi1_2', unit: 'تومان' },
    { key: 'azadi1_4', priceKey: 'azadi1_4', unit: 'تومان' },
  ];

  for (const item of goldItems) {
    // قیمت خرید (key1) یا قیمت پایه
    const buyKey  = item.priceKey + '1';
    const sellKey = item.priceKey + '2';
    const rawBuy  = data[buyKey]  ?? data[item.priceKey];
    const rawSell = data[sellKey] ?? null;

    if (rawBuy == null) continue;

    const name = PERSIAN_NAMES[item.key] ?? item.key;
    const emoji = getEmoji(item.key);

    if (rawSell != null) {
      message += `${emoji} ${name}:\n`;
      message += `   خرید: ${formatNumber(rawBuy)} | فروش: ${formatNumber(rawSell)} ${item.unit}\n`;
    } else {
      message += `${emoji} ${name}: ${formatNumber(rawBuy)} ${item.unit}\n`;
    }
  }

  message += "\n";

  // ─── ارزهای خارجی ───
  message += "💱 ارزهای خارجی (تومان):\n";

  const currencyItems = [
    { key: 'usd' },
    { key: 'eur' },
    { key: 'gbp' },
    { key: 'aed' },
    { key: 'try' },
    { key: 'cad' },
    { key: 'aud' },
    { key: 'cny' },
  ];

  for (const item of currencyItems) {
    const buy  = data[item.key + '1'];
    const sell = data[item.key + '2'];
    if (buy == null) continue;

    const name  = PERSIAN_NAMES[item.key] ?? item.key.toUpperCase();
    const emoji = getEmoji(item.key);
    message += `${emoji} ${name}: ${formatNumber(buy)} | ${formatNumber(sell)}\n`;
  }

  message += "\n";

  // ─── ارزهای دیجیتال ───
  message += "🪙 ارزهای دیجیتال:\n";

  const cryptoSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'TRX', 'TON', 'USDT'];

  for (const symbol of cryptoSymbols) {
    const irtKey  = `${symbol}/IRT`;
    const usdtKey = `${symbol}/USDT`;
    const irt  = data[irtKey];
    const usdt = data[usdtKey];

    if (irt == null && usdt == null) continue;

    const emoji = getEmoji(symbol);
    let line = `${emoji} ${symbol}:`;
    if (usdt != null) line += ` $${formatNumber(usdt)}`;
    if (irt  != null) line += ` | ${formatNumber(irt)} تومان`;
    message += line + '\n';
  }

  message += `\n📢 @alan_chandeh`;
  return message;
}

async function sendTelegramMessage(message, env) {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const channel  = env.TELEGRAM_CHANNEL;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channel,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Telegram API error: ${response.status} - ${err.description || 'Unknown error'}`);
  }

  return response.json();
}

async function fetchAndSend(env) {
  const apiUrl = 'https://sarfe.erfjab.com/api/prices';
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const message = formatMarketMessage(data);
  await sendTelegramMessage(message, env);
}

export default {
  // اجرای زمان‌بندی‌شده (cron)
  async scheduled(event, env, ctx) {
    try {
      if (!isWithinWorkingHours()) {
        console.log('Outside working hours, skipping update');
        return;
      }
      await fetchAndSend(env);
      console.log('Market prices updated successfully');
    } catch (error) {
      console.error('Error in scheduled task:', error);
    }
  },

  // تریگر دستی از طریق HTTP
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // حالت debug: فقط داده API رو نشون بده بدون ارسال به تلگرام
    // مثال: https://your-worker.workers.dev/?debug=1
    if (url.searchParams.get('debug') === '1') {
      try {
        const apiUrl = 'https://sarfe.erfjab.com/api/prices';
        const response = await fetch(apiUrl);
        const data = await response.json();
        const message = formatMarketMessage(data);
        const info = {
          status: 'debug mode - message NOT sent to Telegram',
          bot_token_set: !!env.TELEGRAM_BOT_TOKEN,
          channel_set: !!env.TELEGRAM_CHANNEL,
          channel_value: env.TELEGRAM_CHANNEL,
          api_ok: response.ok,
          preview_message: message,
        };
        return new Response(JSON.stringify(info, null, 2), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // حالت عادی: fetch و send به تلگرام
    try {
      await fetchAndSend(env);
      return new Response('Message sent successfully!', {
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (error) {
      console.error('Error in fetch handler:', error);
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }
};
