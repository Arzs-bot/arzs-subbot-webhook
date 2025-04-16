import { middleware } from '@line/bot-sdk';
import { handleInternalMessage } from '../utils/internalHandler.js';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const middlewareFn = middleware(config);

  await new Promise((resolve, reject) => {
    middlewareFn(req, res, (err) => (err ? reject(err) : resolve()));
  });

  const events = req.body.events;
  const results = await Promise.all(events.map(handleInternalMessage));
  res.json(results);
}