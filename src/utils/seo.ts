import { site } from '../data/site';

export const seoDefaults = {
  title: `OHMEGA | Telur Omega di ${site.serviceArea}, Antar ke Rumah`,
  description: `Pesan telur OHMEGA dengan kandungan Omega-3, DHA, dan EPA. Antar ke rumah di ${site.serviceArea}, gratis di area terpilih. Pengiriman dikonfirmasi melalui WhatsApp.`,
  image: `${site.siteUrl}${site.ogImage}?v=${site.ogImageVersion}`,
  imageAlt: `OHMEGA — Telur Omega untuk keluarga di ${site.serviceArea}`,
  imageWidth: 1200,
  imageHeight: 630,
  url: site.siteUrl,
  locale: 'id_ID',
} as const;
