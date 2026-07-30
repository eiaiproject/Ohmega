import { site } from '../data/site';

export const seoDefaults = {
  title: `OHMEGA | Telur Omega di ${site.serviceArea}, Antar ke Rumah`,
  description: `Pesan telur OHMEGA dengan kandungan Omega-3, DHA, dan EPA. Gratis antar di Perumahan Amartha Safira dan ongkir flat Rp5.000 untuk area ${site.serviceArea}.`,
  image: `${site.siteUrl}${site.ogImage}`,
  url: site.siteUrl,
  locale: 'id_ID',
} as const;
