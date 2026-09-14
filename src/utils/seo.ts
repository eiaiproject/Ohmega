import { site } from '../data/site';

export const seoDefaults = {
  title: `OHMEGA | Telur Omega di ${site.serviceArea}, Pesan via WhatsApp`,
  description: `Pesan telur OHMEGA dengan kandungan Omega-3, DHA, dan EPA. Zona inti kami antar; luar itu ambil via ojek yang Anda pesan. Stok dikonfirmasi via WhatsApp.`,
  image: `${site.siteUrl}${site.ogImage}?v=${site.ogImageVersion}`,
  imageAlt: `OHMEGA: Telur Omega untuk keluarga di ${site.serviceArea}`,
  imageWidth: 1200,
  imageHeight: 630,
  url: site.siteUrl,
  locale: 'id_ID',
} as const;
