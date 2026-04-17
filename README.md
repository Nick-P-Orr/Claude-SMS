# Claude-SMS

Interact with Claude AI from any SMS-capable phone — no smartphone or data plan required.

## What it does

You send an SMS to a Twilio phone number. The message is forwarded to a small webhook server, which passes it to the Claude API and sends Claude's response back to you as SMS. Conversation history is maintained per sender phone number so context carries across messages.

## Architecture

```
[Dumb Phone]
    │  SMS
    ▼
[Twilio Phone Number]
    │  HTTP POST (webhook)
    ▼
[Webhook Server]  ──►  [Claude API]
    │  Twilio REST API
    ▼
[Dumb Phone]
    │  SMS reply
```

## Stack

- **Twilio** — phone number, inbound webhook, outbound SMS
- **Express** — lightweight webhook server
- **Anthropic SDK** — Claude API client
- **Node.js** — runtime

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in your Twilio and Anthropic credentials
```

### 3. Expose your server (development)

```bash
npx ngrok http 3000
```

Set the ngrok URL as your Twilio number's SMS webhook (HTTP POST) in the Twilio console.

### 4. Run

```bash
npm start
```

## Environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Your Twilio SMS number (E.164 format) |
| `PORT` | Server port (default: 3000) |

## Conversation history

History is stored in-memory keyed by sender phone number. It resets when the server restarts. To clear your own history, text `RESET`.

## SMS length

SMS segments are 160 characters. Twilio handles multi-part messages automatically, but Claude's responses are trimmed to a configurable maximum to keep costs and readability sensible.

## Deployment

Deploy the server to any Node-compatible host (Railway, Render, Fly.io, etc.) and point your Twilio webhook at the public URL.
