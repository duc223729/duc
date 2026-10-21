import { Redis } from '@upstash/redis';
import crypto from 'crypto';
const redis = Redis.fromEnv();
export const dbGet = async (k, fb) => (await redis.get(k)) ?? fb;
export const dbSet = (k, v) => redis.set(k, v);
export const hashPw = (s) => crypto.createHash('sha256').update('tamsu-v1|' + s).digest('hex');
export async function getUsers() { return (await dbGet('users', [])) || []; }
export async function saveUsers(u) { await dbSet('users', u); }
export async function getPosts() { return (await dbGet('posts', [])) || []; }
export async function savePosts(p) { await dbSet('posts', p.slice(0, 500)); }
export async function getSession(token) { if (!token) return null; return await dbGet('sess:' + token, null); }
export function json(res, code, obj) { return res.status(code).json(obj); }
