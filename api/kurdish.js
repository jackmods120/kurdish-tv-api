// api/kurdish.js  →  GET /api/kurdish
// هەموو کەناڵە کوردییەکان لە عێراق و جیهانەوە

const { fetchSource, fetchAll } = require('../lib/fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { category, q } = req.query;

  try {
    // Fetch both Iraq + worldwide Kurdish sources
    const all = await fetchAll();

    // Keep only Kurdish channels
    let channels = all.filter(c => c.isKurdish || c.language === 'ku');

    // Deduplicate by name (keep first occurrence)
    const seenNames = new Set();
    channels = channels.filter(c => {
      const key = (c.name || '').toLowerCase().trim();
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });

    if (category) {
      const cc = category.toLowerCase();
      channels = channels.filter(c => (c.category || '').toLowerCase() === cc);
    }
    if (q) {
      const ql = q.toLowerCase();
      channels = channels.filter(c =>
        (c.name || '').toLowerCase().includes(ql) ||
        (c.nameKu || '').includes(q)
      );
    }

    // Group counts by category
    const byCat = {};
    for (const c of channels) {
      const cat = c.category || 'General';
      byCat[cat] = (byCat[cat] || 0) + 1;
    }

    // Curated "must-know" list for the response header
    const topChannels = ['Rudaw', 'Kurdistan 24', 'NRT', 'KurdSat', 'Waar', 'Zagros', 'KNNC', 'Kurdmax', 'Sterk', 'Ronahi'];

    return res.status(200).json({
      success:         true,
      title:           'کەناڵە کوردییەکان',
      titleEn:         'Kurdish TV Channels',
      note:            'هەموو کەناڵە کوردییەکان لە عێراق، ئێران، تورکیا، سووریا',
      noteEn:          'All Kurdish-language channels from Iraq, Iran, Turkey, Syria & diaspora',
      total:           channels.length,
      topChannels,
      byCategory:      byCat,
      filters:         { category: category || null, q: q || null },
      channels,
    });

  } catch (err) {
    console.error('[/api/kurdish]', err.message);
    return res.status(500).json({
      success:  false,
      error:    'نەتوانرا کەناڵەکان وەربگیرێن',
      errorEn:  'Failed to fetch Kurdish channels',
      message:  err.message,
    });
  }
};
