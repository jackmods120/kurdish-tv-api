const axios = require('axios');

// سەرچاوەی پلەی لیستی تایبەتی کوردی (ڕاستەوخۆ لە GitHub)
const PLAYLIST_URL = 'https://raw.githubusercontent.com/BotanAtomic/Kurdistan-TV/master/canal.txt';

module.exports = async (req, res) => {
  try {
    // داتاکە وەردەگرین
    const response = await axios.get(PLAYLIST_URL, { timeout: 8000 });
    const rawText = response.data;

    // شیکردنەوەی فایلی M3U بۆ دەرهێنانی ناو و لینک
    const lines = rawText.split('\n');
    const channels = [];

    let currentName = null;
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('#EXTINF:')) {
        // نموونە: #EXTINF:-1,Rudaw TV
        const commaIndex = line.indexOf(',');
        if (commaIndex !== -1) {
          currentName = line.substring(commaIndex + 1).trim();
        }
      } else if (line && !line.startsWith('#')) {
        // ئەگەر ناوێکمان هەبێت، ئەوا ئەم لینکە ئەندامێکی نوێیە
        if (currentName) {
          channels.push({ name: currentName, url: line });
          currentName = null; // ریست بکەین بۆ کەناڵی دواتر
        }
      }
    }

    // ئەگەر هیچ کەناڵێک نەدۆزرایەوە
    if (channels.length === 0) {
      return res.status(404).json({ error: 'هیچ کەناڵێکی کوردی نەدۆزرایەوە.' });
    }

    // گەڕاندنەوەی JSONـێکی پاک
    res.status(200).json({
      source: 'BotanAtomic/Kurdistan-TV',
      total: channels.length,
      channels: channels
    });

  } catch (error) {
    console.error('هەڵە لە وەرگرتنی داتا:', error.message);
    res.status(500).json({ error: 'نەتوانرا کەناڵەکان وەربگیرێن، تکایە دواتر هەوڵبدەرەوە.' });
  }
};
