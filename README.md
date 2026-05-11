# 📡 Kurdish TV API v2.0

> API ئازاد بۆ هەموو کەناڵە کوردی و عێراقییەکان  
> Free API for all Kurdish & Iraqi TV channels — JSON + M3U

---

## 🚀 Endpoints

| Endpoint | Description | کوردی |
|---|---|---|
| `GET /api/channels` | All channels (with filters) | هەموو کەناڵەکان |
| `GET /api/kurdish` | Kurdish channels worldwide | کەناڵە کوردییەکان |
| `GET /api/iraq` | All Iraqi channels | کەناڵە عێراقییەکان |
| `GET /api/search?q=rudaw` | Search channels | گەڕان |
| `GET /api/m3u` | M3U playlist | پلەیلیست |
| `GET /api/categories` | Available categories | کاتیگۆریەکان |

## 🔍 Filters

```
/api/channels?lang=ku           # Kurdish only
/api/channels?lang=ar           # Arabic only
/api/channels?category=News     # News channels
/api/channels?q=rudaw           # Search
/api/channels?page=2&limit=50   # Pagination
/api/m3u?lang=ku&download=1     # Download Kurdish M3U
```

## 📦 Response Schema

```json
{
  "success": true,
  "total": 42,
  "channels": [
    {
      "id": "Rudaw.iq",
      "name": "Rudaw",
      "nameKu": "ڕووداو",
      "nameAr": "روداو",
      "logo": "https://…",
      "category": "News",
      "language": "ku",
      "country": "iq",
      "isKurdish": true,
      "website": "https://rudaw.net",
      "description": "شبکه‌ی هەواڵەکانی ڕووداو",
      "url": "https://…/stream.m3u8"
    }
  ]
}
```

## 🌍 Data Source

All stream URLs are sourced from [iptv-org/iptv](https://github.com/iptv-org/iptv) (MIT License).  
Channel metadata is curated specifically for the Kurdish community.

## 📺 Featured Kurdish Channels

Rudaw • Kurdistan 24 • NRT • KurdSat • Waar TV • Zagros TV • KNNC  
Kurdmax • Sterk TV • Ronahi TV • Gulan TV • Speda TV • Payam TV • + more

---

Built with ❤️ for Kurdistan | Deployed on Vercel
