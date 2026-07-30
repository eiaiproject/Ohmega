export const site = {
  brandName: 'OHMEGA',
  tagline: 'High Protein, Low Cholesterol',
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
  siteUrl: 'https://ohmega.id',
  ogImage: '/social-preview.svg',
  favicon: '/favicon.svg',
  // Delivery
  deliveryArea: 'Perumahan Amartha Safira',
  deliveryAreaLat: -7.458541,
  deliveryAreaLng: 112.688837,
  deliveryFreeArea: 'Perumahan Amartha Safira',
  deliveryFlatRate: 5000,
  deliveryFlatRateLabel: 'Rp5.000',
  deliveryNote: 'Stok dan waktu pengiriman dikonfirmasi melalui WhatsApp.',
} as const;

export type Site = typeof site;
