const axios = require('axios');

// پلەی لیستی عێراق لە iptv-org (فۆرماتێکی پێوەندی M3U)
const PLAYLIST_URL = 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/iq.m3u';

module.exports = async (req, res) => {
  try {
    const response = await axios.get(PLAYLIST_URL, { timeout: 10000 });
    const rawText = response.data;

    const lines = rawText.split('\n');
    const channels = [];
    let currentName = null;

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('#EXTINF:')) {
        // دەرهێنانی ناوی کەناڵ لە پاش کۆمای یەکەم
        const commaIndex = line.indexOf(',');
        if (commaIndex !== -1) {
          currentName = line.substring(commaIndex + 1).trim();
        }
      } else if (line && !line.startsWith('#')) {
        // ئەگەر ناوێکمان هەبێت و لینکەکە دروست بێت
        if (currentName && (line.startsWith('http://') || line.startsWith('https://'))) {
          // ئەم بەشە دەتوانێت تەنیا کەناڵە کوردییەکان پاڵێو بکات
          // بۆ نموونە، ئەگەر ناوەکە "Kurd" یان "Rudaw" یان "NRT" تێدابێت
          const lowerName = currentName.toLowerCase();
          if (
            lowerName.includes('kurd') ||
            lowerName.includes('rudaw') ||
            lowerName.includes('nrt') ||
            lowerName.includes('kurdsat') ||
            lowerName.includes('waar') ||
            lowerName.includes('zagros') ||
            lowerName.includes('knnc') ||
            lowerName.includes('k24') ||
            lowerName.includes('kmax')
          ) {
            channels.push({ name: currentName, url: line });
          }
          currentName = null;
        }
      }
    }

    if (channels.length === 0) {
      return res.status(404).json({ error: 'هیچ کەناڵێکی کوردی نەدۆزرایەوە.' });
    }

    res.status(200).json({
      source: 'iptv-org/iptv (IQ playlist)',
      total: channels.length,
      channels: channels
    });

  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'نەتوانرا کەناڵەکان وەربگیرێن.' });
  }
};
