import { getPosts, savePosts, getSession, json } from './_store.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  const { token = '', postId } = req.body || {};
  const u = await getSession(token);
  if (!u) return json(res, 401, { error: 'Het phien.' });
  const posts = await getPosts();
  const p = posts.find(x => x.id === Number(postId));
  if (!p) return json(res, 404, { error: 'Khong thay bai.' });
  p.likes = p.likes || [];
  if (p.likes.includes(u)) p.likes = p.likes.filter(x => x !== u);
  else p.likes.push(u);
  await savePosts(posts);
  return json(res, 200, { ok: true });
}
