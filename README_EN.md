# 🤖 Market Price Telegram Bot

This bot automatically sends updated prices of gold, foreign currencies, and cryptocurrencies to your Telegram channel every 30 minutes.

## Features
- Real-time price data from API
- Beautiful message formatting with emojis
- Automatically runs on Cloudflare Workers
- Active only during business hours (11:00–16:00 Tehran time)

## Requirements
- Cloudflare account
- Wrangler CLI
- Node.js

## Quick Start
```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

## Configuration
Add the following to your `wrangler.toml`:
- `TELEGRAM_BOT_TOKEN`: your Telegram bot token
- `TELEGRAM_CHANNEL`: your channel ID
- `API_KEY`: your market data API key