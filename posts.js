import { getPosts, savePosts, getSession, getUsers, json } from './_store.js';
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const posts = (await getPosts()).slice(0, 100);
    return json(res, 200, posts);
  }
  if (req.method === 'POST') {
    const { token = '', content = '', mood = '', image = '' } = req.body || {};
    const u = await getSession(token);
    if (!u) return json(res, 401, { error: 'Het phien.' });
    const users = await getUsers();
    const me = users.find(x => x.username === u);
    if (!me) return json(res, 401, { error: 'Het phien.' });
    const ct = String(content).trim();
    if (!ct) return json(res, 400, { error: 'Trong.' });
    if (String(image).length > 700000) return json(res, 400, { error: 'Anh qua lon.' });
    const posts = await getPosts();
    let nid = 1;
    posts.forEach(p => { if (p.id >= nid) nid = p.id + 1; });
    posts.unshift({ id: nid, user: me.username, displayname: me.displayname, content: ct.slice(0, 3000), image: String(image), mood: String(mood).slice(0, 30), likes: [], comments: [], time: new Date().toLocaleString('vi-VN') });
    await savePosts(posts);
    return json(res, 200, { ok: true });
  }
  return json(res, 405, { error: 'method' });
}
