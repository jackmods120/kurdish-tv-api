// lib/fetch.js — هاوبەشی فێچکردن و کیش بۆ Kurdish TV API
const axios = require('axios');
const { parseM3U } = require('./parser');
const { enrichChannel } = require('./enrich');

const SOURCES = {
  iraq:    'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/iq.m3u',
  kurdish: 'https://iptv-org.github.io/iptv/languages/kur.m3u',
};

// In-memory cache (lives as long as the serverless instance is warm)
const _cache = {};
const CACHE_TTL = 25 * 60 * 1000; // 25 minutes

async function fetchSource(key) {
  const url = SOURCES[key];
  if (!url) throw new Error(`Unknown source: ${key}`);

  const now = Date.now();
  if (_cache[key] && now - _cache[key].ts < CACHE_TTL) {
    return _cache[key].data;
  }

  const res = await axios.get(url, {
    timeout: 18000,
    headers: { 'User-Agent': 'KurdishTV-API/2.0 (+https://kurdish-tv-api.vercel.app)' },
  });

  const channels = parseM3U(res.data).map(enrichChannel);
  _cache[key] = { data: channels, ts: now };
  return channels;
}

async function fetchAll() {
  const results = await Promise.allSettled([
    fetchSource('iraq'),
    fetchSource('kurdish'),
  ]);

  const merged = [];
  const seen = new Set();

  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const ch of r.value) {
        if (!seen.has(ch.url)) {
          seen.add(ch.url);
          merged.push(ch);
        }
      }
    }
  }
  return merged;
}

module.exports = { fetchSource, fetchAll, SOURCES };
