// api/categories.js  →  GET /api/categories

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const categories = [
    { id: 'News',          nameKu: 'هەواڵ',    nameAr: 'أخبار',   nameEn: 'News' },
    { id: 'Entertainment', nameKu: 'سەرگەرمی', nameAr: 'ترفيه',   nameEn: 'Entertainment' },
    { id: 'Sports',        nameKu: 'وەرزش',    nameAr: 'رياضة',   nameEn: 'Sports' },
    { id: 'Religious',     nameKu: 'ئایینی',   nameAr: 'ديني',    nameEn: 'Religious' },
    { id: 'Kids',          nameKu: 'منداڵان',  nameAr: 'أطفال',   nameEn: 'Kids' },
    { id: 'Movies',        nameKu: 'فیلم',     nameAr: 'أفلام',   nameEn: 'Movies' },
    { id: 'General',       nameKu: 'گشتی',     nameAr: 'عام',     nameEn: 'General' },
  ];

  return res.status(200).json({
    success:    true,
    title:      'کاتیگۆریەکان',
    titleEn:    'Available Categories',
    usageExample: '/api/channels?category=News',
    total:      categories.length,
    categories,
  });
};
