export const site = {
  brandName: 'OHMEGA',
  tagline: 'Kaya Protein, Rendah Kolesterol',
  whatsappDisplay: '085111331269',
  whatsappDisplayFormatted: '0851-1133-1269',
  whatsappInternational: '6285111331269',
  instagramHandle: 'ohmega_id',
  instagramUrl: 'https://www.instagram.com/ohmega_id/',
  serviceArea: 'Sidoarjo',
  producerName: 'PT Mahkota Unggas Sejahtera',
  producerCity: 'Mojokerto',
  distributorName: 'OHMEGA',
  distributorCity: 'Sidoarjo',
  currentYear: 2026,
  siteUrl: 'https://ohmega.web.id',
  ogImage: '/social-preview.png',
  // Naikkan versi ini setiap mengganti social-preview agar platform (WhatsApp/Facebook) tidak memakai cache lama.
  ogImageVersion: 4,
  favicon: '/favicon.svg',
  addressRegion: 'Jawa Timur',
  // Skema terima: Amartha kami antar gratis; luar itu ambil via ojek yang dipesan pelanggan.
  baseName: 'Perumahan Amartha Safira',
  baseLat: -7.458908492552493,
  baseLng: 112.68800267540239,
  freeZones: ['Perumahan Amartha Safira'],
  deliveryPromise: 'Amartha Safira kami antar gratis; luar itu ambil via ojek yang Anda pesan agar cepat sampai dan aman.',
  deliveryNote: 'Stok dan kesiapan dikonfirmasi via WhatsApp; ongkir ojek luar zona ditanggung pelanggan.',
} as const;

export type Site = typeof site;
