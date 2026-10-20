import { getUsers, saveUsers, hashPw, json } from './_store.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  const { username = '', displayname = '', password = '' } = req.body || {};
  const u = String(username).trim().toLowerCase();
  const dn = String(displayname).trim();
  if (u.length < 3 || dn.length < 2 || String(password).length < 4) return json(res, 400, { error: 'Nhap day du.' });
  if (!/^[a-z0-9_.]+$/.test(u)) return json(res, 400, { error: 'Ten dang nhap chi a-z 0-9 _ .' });
  const users = await getUsers();
  if (users.some(x => x.username === u)) return json(res, 400, { error: 'Ten dang nhap da ton tai.' });
  if (users.some(x => String(x.displayname).toLowerCase() === dn.toLowerCase())) return json(res, 400, { error: 'Ten hien thi da ton tai.' });
  users.unshift({ username: u, displayname: dn, pw: hashPw(password), time: new Date().toISOString() });
  await saveUsers(users);
  return json(res, 200, { ok: true });
}
