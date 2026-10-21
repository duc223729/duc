import { Redis } from '@upstash/redis';
import { getUsers, hashPw, json } from './_store.js';
import crypto from 'crypto';
const redis = Redis.fromEnv();
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  const { username = '', password = '' } = req.body || {};
  const u = String(username).trim().toLowerCase();
  const users = await getUsers();
  const f = users.find(x => x.username === u);
  if (!f || f.pw !== hashPw(String(password))) return json(res, 401, { error: 'Sai tai khoan.' });
  const tok = crypto.randomBytes(24).toString('hex');
  await redis.set('sess:' + tok, u, { ex: 60 * 60 * 24 * 30 });
  return json(res, 200, { ok: true, token: tok, displayname: f.displayname });
}
