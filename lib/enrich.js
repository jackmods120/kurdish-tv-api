// lib/enrich.js — داتابەیسی کەناڵە کوردی و عێراقییەکان

// ────────────────────────────────────────────────
//  Metadata map  (key = lowercase substring to match against channel name)
// ────────────────────────────────────────────────
const CHANNEL_META = {
  // ── Kurdish News ──────────────────────────────
  rudaw:          { nameKu: 'ڕووداو',        nameAr: 'روداو',         cat: 'News',          lang: 'ku', site: 'https://rudaw.net',         desc: 'شبکه‌ی هەواڵەکانی ڕووداو لە هەولێر',         descEn: 'Kurdish news network based in Erbil' },
  'kurdistan 24': { nameKu: 'کوردستان ٢٤',  nameAr: 'كوردستان 24',  cat: 'News',          lang: 'ku', site: 'https://kurdistan24.net',    desc: 'کەناڵی نوێی کوردستان ٢٤',                     descEn: 'Kurdistan 24 international news channel' },
  'k24':          { nameKu: 'K٢٤',           nameAr: 'K24',           cat: 'News',          lang: 'ku', site: 'https://kurdistan24.net',    desc: 'کەناڵی نوێی K24',                              descEn: 'K24 news channel' },
  'nrt2':         { nameKu: 'NRT ٢',                                  cat: 'Entertainment', lang: 'ku', site: 'https://nrttv.com' },
  'nrt':          { nameKu: 'NRT',           nameAr: 'NRT',           cat: 'News',          lang: 'ku', site: 'https://nrttv.com',          desc: 'نالیا ڕادیۆ و تەلەفیزیۆن',                    descEn: 'Nalia Radio & Television' },
  'waar':         { nameKu: 'وار',           nameAr: 'وار',           cat: 'News',          lang: 'ku', site: 'https://waartv.com',         desc: 'کەناڵی وار بۆ هەواڵ',                          descEn: 'Waar TV news channel' },
  'zagros':       { nameKu: 'زاگرۆس',       nameAr: 'زاغروس',       cat: 'News',          lang: 'ku', site: 'https://zagrostv.com',       desc: 'کەناڵی زاگرۆس',                                descEn: 'Zagros TV — Kurdish news' },
  'knnc':         { nameKu: 'KNNC',                                   cat: 'News',          lang: 'ku',                                    desc: 'کەناڵی هەواڵی KNNC',                           descEn: 'KNNC Kurdish news channel' },
  'sterk':        { nameKu: 'ستێرک',                                  cat: 'News',          lang: 'ku',                                    desc: 'ستێرک تی‌ڤی',                                   descEn: 'Sterk TV' },
  'ronahi':       { nameKu: 'ڕۆناهی',                                 cat: 'News',          lang: 'ku',                                    desc: 'ڕۆناهی تی‌ڤی',                                  descEn: 'Ronahi TV' },
  'nuçe':         { nameKu: 'نووچە',                                  cat: 'News',          lang: 'ku',                                    descEn: 'Nûçe TV' },
  'nuce':         { nameKu: 'نووچە',                                  cat: 'News',          lang: 'ku',                                    descEn: 'Nûçe TV' },
  'medya':        { nameKu: 'مەدیا',                                  cat: 'News',          lang: 'ku',                                    descEn: 'Medya Haber TV' },

  // ── Kurdish General / Entertainment ───────────
  'kurdsat':      { nameKu: 'کوردسات',       nameAr: 'كوردسات',      cat: 'General',       lang: 'ku', site: 'https://kurdsat.tv',         desc: 'کوردسات — کەناڵی گشتی',                        descEn: 'KurdSat general channel' },
  'kurdmax':      { nameKu: 'کوردمێکس',      nameAr: 'كوردماكس',     cat: 'Entertainment', lang: 'ku', site: 'https://kurdmax.com',        desc: 'کوردمێکس — سەرگەرمی',                          descEn: 'Kurdmax entertainment channel' },
  'kmax':         { nameKu: 'KMax',                                   cat: 'Entertainment', lang: 'ku',                                    descEn: 'KMax TV' },
  'gulan':        { nameKu: 'گولان',                                  cat: 'Entertainment', lang: 'ku',                                    descEn: 'Gulan TV' },
  'speda':        { nameKu: 'سپێدە',                                  cat: 'General',       lang: 'ku',                                    descEn: 'Speda TV' },
  'ava tv':       { nameKu: 'ئاڤا',                                   cat: 'General',       lang: 'ku',                                    descEn: 'Ava TV' },
  'ava':          { nameKu: 'ئاڤا',                                   cat: 'General',       lang: 'ku',                                    descEn: 'Ava TV' },
  'gk':           { nameKu: 'GK',                                     cat: 'General',       lang: 'ku',                                    descEn: 'GK TV Kurdistan' },
  'kurdistan tv': { nameKu: 'کوردستان TV',                            cat: 'General',       lang: 'ku',                                    descEn: 'Kurdistan TV' },
  'mm kurdsat':   { nameKu: 'MM کوردسات',                             cat: 'Entertainment', lang: 'ku',                                    descEn: 'MM Kurdsat' },
  'korek':        { nameKu: 'کۆرەک',                                  cat: 'General',       lang: 'ku',                                    descEn: 'Korek TV' },
  'payam':        { nameKu: 'پەیام',         nameAr: 'بيام',          cat: 'Religious',     lang: 'ku',                                    descEn: 'Payam TV — religious' },
  'nalia':        { nameKu: 'نالیا',                                  cat: 'News',          lang: 'ku',                                    descEn: 'Nalia TV' },
  'kurdistan':    { nameKu: 'کوردستان',                               cat: 'General',       lang: 'ku',                                    descEn: 'Kurdistan channel' },

  // ── Iraqi Arabic ───────────────────────────────
  'al iraqiya':   { nameAr: 'العراقية',      cat: 'General',          lang: 'ar', site: 'https://iraqia.gov.iq',     descEn: 'Official Iraqi state television' },
  'iraqiya':      { nameAr: 'العراقية',      cat: 'General',          lang: 'ar', site: 'https://iraqia.gov.iq',     descEn: 'Al Iraqiya state TV' },
  'al sharqiya':  { nameAr: 'الشرقية',       cat: 'News',             lang: 'ar',                                    descEn: 'Al Sharqiya news channel' },
  'sharqiya':     { nameAr: 'الشرقية',       cat: 'News',             lang: 'ar',                                    descEn: 'Sharqiya TV' },
  'al sumaria':   { nameAr: 'السومرية',      cat: 'News',             lang: 'ar', site: 'https://alsumarianews.com', descEn: 'Al Sumaria news channel' },
  'sumaria':      { nameAr: 'السومرية',      cat: 'News',             lang: 'ar',                                    descEn: 'Sumaria TV' },
  'dijlah':       { nameAr: 'دجلة',          cat: 'News',             lang: 'ar',                                    descEn: 'Dijlah TV' },
  'baghdad':      { nameAr: 'بغداد',         cat: 'General',          lang: 'ar',                                    descEn: 'Baghdad TV' },
  'al rasheed':   { nameAr: 'الرشيد',        cat: 'General',          lang: 'ar',                                    descEn: 'Al Rasheed TV' },
  'rasheed':      { nameAr: 'الرشيد',        cat: 'General',          lang: 'ar',                                    descEn: 'Rasheed TV' },
  'afaq':         { nameAr: 'آفاق',          cat: 'News',             lang: 'ar',                                    descEn: 'Afaq TV' },
  'beladi':       { nameAr: 'بلدي',          cat: 'News',             lang: 'ar',                                    descEn: 'Beladi TV' },
  'biladi':       { nameAr: 'بلدي',          cat: 'News',             lang: 'ar',                                    descEn: 'Biladi TV' },
  'al ghad':      { nameAr: 'الغد',          cat: 'News',             lang: 'ar',                                    descEn: 'Al Ghad Iraqi TV' },
  'ghad':         { nameAr: 'الغد',          cat: 'News',             lang: 'ar',                                    descEn: 'Al Ghad TV' },
  'forat':        { nameAr: 'الفرات',        cat: 'General',          lang: 'ar',                                    descEn: 'Forat TV' },
  'furat':        { nameAr: 'الفرات',        cat: 'General',          lang: 'ar',                                    descEn: 'Furat TV' },
  'mada':         { nameAr: 'المدى',         cat: 'News',             lang: 'ar',                                    descEn: 'Al Mada TV' },
  'shabab':       { nameAr: 'شباب',          cat: 'Entertainment',    lang: 'ar',                                    descEn: 'Shabab Iraqi TV' },
  'anwar':        { nameAr: 'أنوار',         cat: 'Religious',        lang: 'ar',                                    descEn: 'Anwar Al Iraq' },
  'turkmeneli':   { nameAr: 'تركمانيلي',     cat: 'General',          lang: 'tr',                                    descEn: 'Turkmeneli TV — Iraqi Turkmen channel' },
};

// Keywords that identify a Kurdish channel (in case lang attribute is missing)
const KURDISH_KEYWORDS = [
  'kurd', 'rudaw', 'nrt', 'kurdsat', 'waar', 'zagros', 'knnc',
  'kurdmax', 'kmax', 'sterk', 'ronahi', 'payam', 'speda', 'gulan',
  'hawler', 'sulaimani', 'duhok', 'kurdistan', 'nuçe', 'nuce', 'medya haber',
];

function isKurdish(name) {
  const l = (name || '').toLowerCase();
  return KURDISH_KEYWORDS.some(kw => l.includes(kw));
}

function detectCategory(groupTitle) {
  const g = (groupTitle || '').toLowerCase();
  if (g.includes('news'))                        return 'News';
  if (g.includes('sport'))                       return 'Sports';
  if (g.includes('entertain') || g.includes('music') || g.includes('series')) return 'Entertainment';
  if (g.includes('kids') || g.includes('child')) return 'Kids';
  if (g.includes('religi') || g.includes('islam') || g.includes('quran')) return 'Religious';
  if (g.includes('movie') || g.includes('film') || g.includes('cinema'))  return 'Movies';
  return 'General';
}

function enrichChannel(ch) {
  const nameLow = (ch.name || ch.displayName || '').toLowerCase();
  let meta = null;

  for (const [key, val] of Object.entries(CHANNEL_META)) {
    if (nameLow.includes(key)) { meta = val; break; }
  }

  const isku = (ch.language === 'ku') || isKurdish(ch.name);

  if (meta) {
    return {
      ...ch,
      nameKu:      meta.nameKu    || '',
      nameAr:      meta.nameAr    || '',
      category:    meta.cat       || detectCategory(ch.group),
      language:    ch.language    || meta.lang || (isku ? 'ku' : 'ar'),
      country:     ch.country     || (meta.lang === 'ku' ? 'iq' : (meta.lang === 'ar' ? 'iq' : '')),
      website:     meta.site      || '',
      description: meta.desc      || '',
      descriptionEn: meta.descEn  || '',
      isKurdish:   meta.lang === 'ku' || isku,
    };
  }

  return {
    ...ch,
    nameKu: '', nameAr: '',
    category:   detectCategory(ch.group),
    language:   ch.language || (isku ? 'ku' : 'ar'),
    country:    ch.country  || 'iq',
    website: '', description: '', descriptionEn: '',
    isKurdish: isku,
  };
}

module.exports = { enrichChannel, CHANNEL_META, KURDISH_KEYWORDS, isKurdish };
