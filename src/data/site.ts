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
  // Delivery
  deliveryArea: 'Perumahan Amartha Safira',
  deliveryAreaLat: -7.458541,
  deliveryAreaLng: 112.688837,
  deliveryFreeArea: 'Perumahan Amartha Safira',
  deliveryNote: 'Stok dan waktu pengiriman dikonfirmasi melalui WhatsApp.',
} as const;

export type Site = typeof site;
