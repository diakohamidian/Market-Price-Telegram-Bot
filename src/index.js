function isWithinWorkingHours() {
  const now = new Date();
  const tehranTime = new Date(now.getTime() + (3.5 * 60 * 60 * 1000));
  const hour = tehranTime.getUTCHours();
  return hour >= 10 && hour < 17;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercentage(percent) {
  const sign = percent >= 0 ? "+" : "";
  const emoji = percent > 0 ? "🟢" : percent < 0 ? "🔴" : "⚪";
  return `${emoji} ${sign}${percent}%`;
}

function getEmoji(symbol) {
  const emojis = {
    'IR_GOLD_18K': '💫',
    'IR_GOLD_24K': '🌟',
    'IR_COIN_BAHAR': '🏆',
    'IR_COIN_EMAMI': '🎖️',
    'IR_COIN_NIM': '🥈',
    'IR_COIN_ROB': '🥉',
    'USD': '💵',
    'EUR': '💶',
    'GBP': '💷',
    'CAD': '🍁',
    'TRY': '🦃',
    'AED': '🦗',
    'USDT': '💲',
    'BTC': '₿',
    'ETH': '🔷',
    'BNB': '🟡'
  };
  return emojis[symbol] || '📊';
}

function formatMarketMessage(data) {
  const golddate = data.gold[0].date;
  const goldtime = data.gold[0].time;
  const currencydate = data.currency[1].date
  const currencytime = data.currency[1].time
  const currcryptocurrencydate = data.cryptocurrency[0].date
  const currcryptocurrencytime = data.cryptocurrency[0].time

  let message = "🌟 قیمت‌های به‌روز شده 🌟\n\n";

  message += "طلا و سکه:\n";
  data.gold
    .filter(item => [
      'IR_GOLD_18K',
      'IR_GOLD_24K',
      'IR_COIN_BAHAR',
      'IR_COIN_EMAMI',
      'IR_COIN_NIM',
      'IR_COIN_ROB'
    ].includes(item.symbol))
    .forEach(item => {
      message += `${getEmoji(item.symbol)} ${item.name}: ${formatNumber(item.price)} ${item.unit} ${formatPercentage(item.change_percent)}\n`;
    });
  message += `⏰بروزرسانی: ${golddate} ${goldtime}`
  message += "\n\n";

  message += "ارزهای خارجی:\n";
  data.currency
    .filter(item => [
      'USD',
      'EUR',
      'GBP',
      'CAD',
      'TRY',
      'AED',
      'USDT'
    ].includes(item.symbol))
    .forEach(item => {
      message += `${getEmoji(item.symbol)} ${item.name}: ${formatNumber(item.price)} ${item.unit} ${formatPercentage(item.change_percent)}\n`;
    });
  message += `⏰بروزرسانی: ${currencydate} ${currencytime}`
  message += "\n\n";

  message += "ارزهای دیجیتال:\n";
  data.cryptocurrency
    .filter(item => ['BTC', 'ETH', 'BNB'].includes(item.symbol))
    .forEach(item => {
      message += `${getEmoji(item.symbol)} ${item.name}: ${formatNumber(item.price)} ${item.unit} ${formatPercentage(item.change_percent)}\n`;
    });

  message += `⏰بروزرسانی: ${currencydate} ${currcryptocurrencytime}`
  message += "\n";
  message += `\n📢 @alan_chandeh`;
  return message;
}

async function sendTelegramMessage(message, env) {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const channel = env.TELEGRAM_CHANNEL;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channel,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error details:', errorData);
      throw new Error(`Telegram API error: ${response.status} - ${errorData.description || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

export default {
  async scheduled(event, env, ctx) {
    try {
      if (!isWithinWorkingHours()) {
        console.log('Outside working hours, skipping update');
        return;
      }

      const apiKey = env.API_KEY;
      const response = await fetch(`https://brsapi.ir/Api/Market/Gold_Currency.php?key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const message = formatMarketMessage(data);
      await sendTelegramMessage(message, env);

      console.log('Market prices updated successfully');
    } catch (error) {
      console.error('Error in scheduled task:', error);
    }
  },

  async fetch(request, env, ctx) {
    try {
      const apiKey = env.API_KEY;
      const response = await fetch(`https://brsapi.ir/Api/Market/Gold_Currency.php?key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const message = formatMarketMessage(data);
      await sendTelegramMessage(message, env);

      return new Response('Message sent successfully!', {
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (error) {
      console.error('Error in webhook:', error);
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }
};
