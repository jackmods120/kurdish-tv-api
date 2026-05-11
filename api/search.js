// api/search.js  →  GET /api/search?q=rudaw
// گەڕان لە کەناڵەکان

const { fetchAll } = require('../lib/fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;

  if (!q || q.trim().length < 1) {
    return res.status(400).json({
      success: false,
      error:   'تکایە کلیلەوشەیەک بنووسە',
      errorEn: 'Please provide a search query (?q=...)',
    });
  }

  try {
    const all = await fetchAll();
    const ql  = q.toLowerCase().trim();

    const results = all.filter(c =>
      (c.name        || '').toLowerCase().includes(ql) ||
      (c.displayName || '').toLowerCase().includes(ql) ||
      (c.nameKu      || '').includes(q) ||
      (c.nameAr      || '').includes(q) ||
      (c.category    || '').toLowerCase().includes(ql) ||
      (c.descriptionEn || '').toLowerCase().includes(ql)
    );

    return res.status(200).json({
      success: true,
      query:   q,
      total:   results.length,
      channels: results,
    });

  } catch (err) {
    console.error('[/api/search]', err.message);
    return res.status(500).json({
      success: false,
      error:   'نەتوانرا گەڕان ئەنجام بدرێت',
      errorEn: 'Search failed',
      message: err.message,
    });
  }
};
