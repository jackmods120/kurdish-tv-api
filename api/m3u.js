// api/m3u.js  →  GET /api/m3u
// دابەزاندنی پلەیلیستی M3U
// ?lang=ku    → تەنیا کوردی
// ?lang=ar    → تەنیا عەرەبی
// ?source=iraq|kurdish|all
// ?download=1 → بۆ دابەزاندن

const { fetchSource, fetchAll } = require('../lib/fetch');

function buildM3U(channels, title) {
  let out = `#EXTM3U x-tvg-url="" tvg-title="${title}"\n\n`;
  for (const ch of channels) {
    const label = ch.nameKu ? `${ch.nameKu} | ${ch.name}` : ch.name;
    out += `#EXTINF:-1`;
    if (ch.id)       out += ` tvg-id="${ch.id}"`;
    if (ch.name)     out += ` tvg-name="${ch.name}"`;
    if (ch.logo)     out += ` tvg-logo="${ch.logo}"`;
    if (ch.category) out += ` group-title="${ch.category}"`;
    if (ch.language) out += ` tvg-language="${ch.language}"`;
    if (ch.country)  out += ` tvg-country="${ch.country.toUpperCase()}"`;
    out += `,${label}\n${ch.url}\n\n`;
  }
  return out;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { lang, source = 'all', download, category } = req.query;

  try {
    let channels;

    if (lang === 'ku' || source === 'kurdish') {
      const all = await fetchAll();
      channels = all.filter(c => c.isKurdish || c.language === 'ku');
    } else if (source === 'iraq') {
      channels = await fetchSource('iraq');
    } else {
      channels = await fetchAll();
    }

    if (lang && lang !== 'ku') {
      channels = channels.filter(c => c.language === lang.toLowerCase());
    }
    if (category) {
      channels = channels.filter(c => (c.category || '').toLowerCase() === category.toLowerCase());
    }

    const isKuOnly = lang === 'ku' || source === 'kurdish';
    const title    = isKuOnly ? 'کەناڵە کوردییەکان — Kurdish TV' : 'کەناڵە کوردی و عێراقییەکان — Kurdish & Iraqi TV';
    const filename = isKuOnly ? 'kurdish-tv.m3u' : 'kurdish-iraq-tv.m3u';

    if (download === '1' || download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
    res.setHeader('Content-Type', 'audio/x-mpegurl; charset=utf-8');
    res.status(200).send(buildM3U(channels, title));

  } catch (err) {
    console.error('[/api/m3u]', err.message);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(500).json({
      success: false,
      error:   'نەتوانرا پلەیلیستەکە دروست بکرێت',
      errorEn: 'Failed to build M3U playlist',
      message: err.message,
    });
  }
};
