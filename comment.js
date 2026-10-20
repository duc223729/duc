import { getPosts, savePosts, getSession, getUsers, json } from './_store.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  const { token = '', postId, text = '' } = req.body || {};
  const u = await getSession(token);
  if (!u) return json(res, 401, { error: 'Het phien.' });
  const users = await getUsers();
  const me = users.find(x => x.username === u);
  if (!me) return json(res, 401, { error: 'Het phien.' });
  const tx = String(text).trim();
  if (!tx) return json(res, 400, { error: 'Trong.' });
  const posts = await getPosts();
  const p = posts.find(x => x.id === Number(postId));
  if (!p) return json(res, 404, { error: 'Khong thay bai.' });
  p.comments.push({ user: me.username, displayname: me.displayname, text: tx.slice(0, 1000), time: new Date().toLocaleString('vi-VN') });
  await savePosts(posts);
  return json(res, 200, { ok: true });
}
