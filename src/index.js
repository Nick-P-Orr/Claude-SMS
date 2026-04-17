require('dotenv').config();

const express = require('express');
const twilio = require('twilio');
const { chat } = require('./claude');
const { resetHistory } = require('./conversation');

const app = express();
app.use(express.urlencoded({ extended: false }));

const { TWILIO_AUTH_TOKEN, PORT = 3000 } = process.env;

app.post('/sms', twilio.webhook({ authToken: TWILIO_AUTH_TOKEN }), async (req, res) => {
  const from = req.body.From;
  const body = (req.body.Body || '').trim();

  const twiml = new twilio.twiml.MessagingResponse();

  if (body.toUpperCase() === 'RESET') {
    resetHistory(from);
    twiml.message('Conversation reset.');
    return res.type('text/xml').send(twiml.toString());
  }

  try {
    const reply = await chat(from, body);
    twiml.message(reply);
  } catch (err) {
    console.error('Claude API error:', err);
    twiml.message('Sorry, something went wrong. Please try again.');
  }

  res.type('text/xml').send(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Claude-SMS server listening on port ${PORT}`);
});
