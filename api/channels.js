// api/channels.js  →  GET /api/channels
// فلتەر:  ?lang=ku|ar|tr   ?category=News   ?q=rudaw   ?page=1   ?limit=100   ?source=all|iraq|kurdish

const { fetchSource, fetchAll } = require('../lib/fetch');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { lang, category, q, page = '1', limit = '100', source = 'all' } = req.query;

  try {
    let channels;

    if (source === 'iraq')    channels = await fetchSource('iraq');
    else if (source === 'kurdish') channels = await fetchSource('kurdish');
    else                      channels = await fetchAll();

    // ── Filters ──────────────────────────────────
    if (lang) {
      const lc = lang.toLowerCase();
      channels = channels.filter(c => c.language === lc || (lc === 'ku' && c.isKurdish));
    }
    if (category) {
      const cc = category.toLowerCase();
      channels = channels.filter(c => (c.category || '').toLowerCase() === cc);
    }
    if (q) {
      const ql = q.toLowerCase();
      channels = channels.filter(c =>
        (c.name || '').toLowerCase().includes(ql) ||
        (c.displayName || '').toLowerCase().includes(ql) ||
        (c.nameKu || '').includes(q) ||
        (c.nameAr || '').includes(q)
      );
    }

    // ── Pagination ────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit) || 100), 500);
    const start    = (pageNum - 1) * limitNum;
    const data     = channels.slice(start, start + limitNum);

    // ── Stats ─────────────────────────────────────
    const cats = {};
    for (const ch of channels) {
      const c = ch.category || 'General';
      cats[c] = (cats[c] || 0) + 1;
    }

    return res.status(200).json({
      success:    true,
      source:     source === 'all' ? 'iptv-org (Iraq + Kurdish worldwide)' : `iptv-org (${source})`,
      total:      channels.length,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(channels.length / limitNum),
      filters:    { lang: lang || null, category: category || null, q: q || null },
      stats:      { categories: cats },
      channels:   data,
    });

  } catch (err) {
    console.error('[/api/channels]', err.message);
    return res.status(500).json({
      success:  false,
      error:    'نەتوانرا کەناڵەکان وەربگیرێن',
      errorEn:  'Failed to fetch channels',
      message:  err.message,
    });
  }
};
