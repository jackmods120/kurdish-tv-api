// api/iraq.js  →  GET /api/iraq
// هەموو کەناڵە عێراقییەکان (عەرەبی + کوردی + تورکمانی)

const { fetchSource } = require('../lib/fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { lang, category, q } = req.query;

  try {
    let channels = await fetchSource('iraq');

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
        (c.nameKu || '').includes(q) ||
        (c.nameAr || '').includes(q)
      );
    }

    // Language breakdown
    const stats = { kurdish: 0, arabic: 0, other: 0, total: channels.length };
    for (const c of channels) {
      if (c.isKurdish || c.language === 'ku') stats.kurdish++;
      else if (c.language === 'ar')            stats.arabic++;
      else                                     stats.other++;
    }

    return res.status(200).json({
      success:   true,
      title:     'کەناڵە عێراقییەکان',
      titleEn:   'Iraqi TV Channels',
      note:      'هەموو کەناڵەکانی عێراق — کوردی، عەرەبی، تورکمانی',
      noteEn:    'All Iraqi channels — Kurdish, Arabic, Turkmen',
      total:     channels.length,
      stats,
      filters:   { lang: lang || null, category: category || null, q: q || null },
      channels,
    });

  } catch (err) {
    console.error('[/api/iraq]', err.message);
    return res.status(500).json({
      success:  false,
      error:    'نەتوانرا کەناڵەکان وەربگیرێن',
      errorEn:  'Failed to fetch Iraqi channels',
      message:  err.message,
    });
  }
};
