// lib/parser.js — پارسەری M3U بۆ Kurdish TV API

function parseM3U(text) {
  const channels = [];
  const lines = text.split('\n');
  let meta = {};

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith('#EXTINF:')) {
      meta = {};
      // parse all key="value" attributes
      const attrRegex = /([a-zA-Z\-]+)="([^"]*?)"/g;
      let m;
      while ((m = attrRegex.exec(line)) !== null) {
        meta[m[1]] = m[2];
      }
      // display name is after the last comma
      const ci = line.lastIndexOf(',');
      if (ci !== -1) meta._name = line.substring(ci + 1).trim();

    } else if (line.startsWith('#EXTVLCOPT:') || line.startsWith('#KODIPROP:')) {
      // keep meta, skip helper lines

    } else if (line && !line.startsWith('#') && meta._name) {
      if (/^https?:\/\/|^rtm[ps]:\/\/|^rtsp:\/\//i.test(line)) {
        channels.push({
          id:          meta['tvg-id']       || '',
          name:        meta['tvg-name']     || meta._name,
          displayName: meta._name,
          logo:        meta['tvg-logo']     || '',
          group:       meta['group-title']  || '',
          language:   (meta['tvg-language'] || '').toLowerCase(),
          country:    (meta['tvg-country']  || '').toLowerCase(),
          url:         line,
        });
        meta = {};
      }
    }
  }

  return channels;
}

module.exports = { parseM3U };
