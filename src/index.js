// API: https://sarfe.erfjab.com/api/prices

function getTehranTime() {
  const now = new Date();
  const tehran = new Date(now.getTime() + (3.5 * 60 * 60 * 1000));
  // تبدیل به تاریخ شمسی ساده (تقریبی برای نمایش)
  const hour = tehran.getUTCHours().toString().padStart(2, '0');
  const min  = tehran.getUTCMinutes().toString().padStart(2, '0');

  // تاریخ میلادی به شمسی (تقریب)
  const jdate = toJalali(tehran.getUTCFullYear(), tehran.getUTCMonth() + 1, tehran.getUTCDate());
  return `${jdate.jy}/${jdate.jm.toString().padStart(2,'0')}/${jdate.jd.toString().padStart(2,'0')} ${hour}:${min}`;
}

// تبدیل تاریخ میلادی به جلالی
function toJalali(gy, gm, gd) {
  const g_d_no = [31,28,31,30,31,30,31,31,30,31,30,31];
  const j_d_no = [31,31,31,31,31,31,30,30,30,30,30,29];
  let jy, jm, jd, i, gy2, days;
  gy2 = (gm > 2) ? (gy + 1) : gy;
  days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4)
       - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);
  for (i = 0; i < gm - 1; i++) days += g_d_no[i];
  days += gd;
  jy = -1595;
  days -= 948391;
  jy += 2820 * Math.floor(days / 1029983);
  const r = days % 1029983;
  if (r !== 1029982) {
    const a = Math.floor(r / 366);
    jy += 33 * a;
    const b = r % 366;
    jy += Math.floor((b + 5) / 8);
    days = b - Math.floor((8 * Math.floor((b + 5) / 8) + 29) / 33) * 33 + Math.floor(Math.floor((b + 5) / 8) * 33 / 8);
  } else {
    jy += 2819;
    days = 365;
  }
  jm = 0;
  for (i = 0; i < 12; i++) {
    if (days <= j_d_no[i]) { jm = i + 1; jd = days; break; }
    days -= j_d_no[i];
  }
  return { jy, jm, jd };
}

function formatNumber(num) {
  const n = parseFloat(num);
  if (isNaN(n)) return num;
  if (n >= 1000) return Math.round(n).toLocaleString('en-US');
  if (n >= 1)    return n.toFixed(2);
  return n.toPrecision(4);
}

function formatMarketMessage(data) {
  const now = getTehranTime();
  let message = "🌟 قیمت‌های به‌روز شده 🌟\n\n";

  // ─── طلا و سکه ───
  message += "طلا و سکه:\n";

  const goldItems = [
    { key: 'gol18',    emoji: '💫', name: 'طلای ۱۸ عیار',     unit: 'تومان' },
    { key: 'ounce',    emoji: '🌟', name: 'انس جهانی طلا',    unit: 'دلار' },
    { key: 'emami1',   emoji: '🎖️', name: 'سکه امامی',        unit: 'تومان' },
    { key: 'azadi1',   emoji: '🏆', name: 'سکه بهار آزادی',   unit: 'تومان' },
    { key: 'azadi1_2', emoji: '🥈', name: 'نیم سکه',          unit: 'تومان' },
    { key: 'azadi1_4', emoji: '🥉', name: 'ربع سکه',          unit: 'تومان' },
  ];

  for (const item of goldItems) {
    const price = data[item.key + '1'] ?? data[item.key];
    if (price == null) continue;
    message += `${item.emoji} ${item.name}: ${formatNumber(price)} ${item.unit}\n`;
  }

  // ─── ارزهای خارجی ───
  message += "ارزهای خارجی:\n";

  const currencyItems = [
    { key: 'USDT', emoji: '💲', name: 'دلار تتر',       irt: true  },
    { key: 'usd',  emoji: '💵', name: 'دلار',           irt: false },
    { key: 'eur',  emoji: '💶', name: 'یورو',           irt: false },
    { key: 'aed',  emoji: '🦗', name: 'درهم امارات',   irt: false },
    { key: 'gbp',  emoji: '💷', name: 'پوند',           irt: false },
    { key: 'cad',  emoji: '🍁', name: 'دلار کانادا',   irt: false },
    { key: 'try',  emoji: '🦃', name: 'لیر ترکیه',     irt: false },
  ];

  for (const item of currencyItems) {
    let price;
    if (item.irt) {
      // تتر از بخش کریپتو
      price = data['USDT/IRT'];
    } else {
      price = data[item.key + '1'];
    }
    if (price == null) continue;
    message += `${item.emoji} ${item.name}: ${formatNumber(price)} تومان\n`;
  }

  // ─── ارزهای دیجیتال ───
  message += "ارزهای دیجیتال:\n";

  const cryptoItems = [
    { symbol: 'BTC',  emoji: '₿',  name: 'بیت‌کوین'  },
    { symbol: 'ETH',  emoji: '🔷', name: 'اتریوم'    },
    { symbol: 'BNB',  emoji: '🟡', name: 'بی‌ان‌بی'  },
    { symbol: 'SOL',  emoji: '◎',  name: 'سولانا'    },
    { symbol: 'XRP',  emoji: '🔵', name: 'ریپل'      },
    { symbol: 'DOGE', emoji: '🐶', name: 'دوج‌کوین'  },
  ];

  for (const item of cryptoItems) {
    const usdt = data[`${item.symbol}/USDT`];
    if (usdt == null) continue;
    message += `${item.emoji} ${item.name}: ${formatNumber(usdt)} دلار\n`;
  }

  message += `📢 @alan_chandeh`;
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
  const response = await fetch('https://sarfe.erfjab.com/api/prices');
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const message = formatMarketMessage(data);
  await sendTelegramMessage(message, env);
}

export default {
  async scheduled(event, env, ctx) {
    try {
      await fetchAndSend(env);
      console.log('Market prices updated successfully');
    } catch (error) {
      console.error('Error in scheduled task:', error);
    }
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // حالت debug: پیش‌نمایش پیام بدون ارسال به تلگرام
    // https://your-worker.workers.dev/?debug=1
    if (url.searchParams.get('debug') === '1') {
      try {
        const res  = await fetch('https://sarfe.erfjab.com/api/prices');
        const data = await res.json();
        const message = formatMarketMessage(data);
        return new Response(
          JSON.stringify({
            status: 'debug - NOT sent to Telegram',
            bot_token_set: !!env.TELEGRAM_BOT_TOKEN,
            channel: env.TELEGRAM_CHANNEL,
            preview: message,
          }, null, 2),
          { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

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
