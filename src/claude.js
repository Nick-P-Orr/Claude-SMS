const Anthropic = require('@anthropic-ai/sdk');
const { getHistory, appendMessage } = require('./conversation');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_CHARS = parseInt(process.env.MAX_SMS_CHARS || '1600', 10);

async function chat(phoneNumber, userMessage) {
  appendMessage(phoneNumber, 'user', userMessage);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are a helpful assistant replying via SMS. Be concise — responses may be split across multiple SMS segments.',
    messages: getHistory(phoneNumber),
  });

  const text = response.content[0].text;
  const trimmed = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS - 3) + '...' : text;

  appendMessage(phoneNumber, 'assistant', text);

  return trimmed;
}

module.exports = { chat };
