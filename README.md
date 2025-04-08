# 📊 Market Price Telegram Bot | ربات تلگرامی قیمت بازار

A simple Telegram bot that sends updated prices of gold, foreign currencies, and cryptocurrencies to your Telegram channel every 30 minutes.  
رباتی ساده برای ارسال قیمت‌های به‌روز طلا، ارز و ارز دیجیتال به کانال تلگرام، هر ۳۰ دقیقه یک‌بار.

---

## 🚀 Features | ویژگی‌ها

- 🔄 Fetches real-time market prices from API  
  دریافت قیمت‌های لحظه‌ای از API  
- 📩 Sends beautiful, emoji-rich messages to Telegram  
  ارسال پیام‌های مرتب و همراه با ایموجی به تلگرام  
- ⏰ Runs automatically every 30 minutes  
  اجرا به‌صورت خودکار هر نیم‌ساعت  
- 🕒 Active only during working hours (11:00–16:00 Tehran time)  
  فعال فقط در ساعات کاری (۱۱ تا ۱۶ به‌وقت تهران)  
- ☁️ Deployed on Cloudflare Workers – fast & free  
  قابل استقرار روی Cloudflare Workers (سریع و رایگان)

---

## 📦 Requirements | پیش‌نیازها

- ✅ [Cloudflare Account](https://dash.cloudflare.com/)  
  حساب Cloudflare  
- ✅ [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)  
  ابزار Wrangler CLI  
- ✅ [Node.js](https://nodejs.org/)  
  نود.جی‌اس

---

## ⚙️ Installation & Deployment | نصب و راه‌اندازی

### 1. Install Wrangler CLI | نصب Wrangler:
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare | ورود به حساب Cloudflare:
```bash
wrangler login
```

### 3. Deploy the project | استقرار پروژه:
```bash
wrangler deploy
```

---

## 🛠 Configuration | تنظیمات

Update your `wrangler.toml` file with these environment variables:  
مقادیر زیر را در فایل `wrangler.toml` وارد کنید:

```toml
TELEGRAM_BOT_TOKEN = "your_telegram_bot_token"
TELEGRAM_CHANNEL = "your_channel_id"
API_KEY = "your_market_api_key"
```

---

## 🧪 Development | توسعه محلی

Run the bot locally for testing:  
اجرای محلی برای تست:

```bash
wrangler dev
```

---

## 📋 Logs | مشاهده لاگ‌ها

Watch logs in real-time (for debugging):  
مشاهده لاگ‌ها به‌صورت زنده:

```bash
wrangler tail
```

---

## ⚠️ Notes | نکات مهم

- Bot is only active between **10:00 to 17:00 Tehran time**  
  ربات فقط بین **ساعت ۱۰ تا ۱۷** فعال است  
- Messages are sent in **HTML format**  
  پیام‌ها با فرمت **HTML** ارسال می‌شوند  
- All errors are logged in Cloudflare  
  خطاها در لاگ Cloudflare ثبت می‌شوند

---

## 📢 Made with ❤️ for @alan_chandeh