import { site } from '../data/site';
import { prices } from '../lib/content';

const base = `https://wa.me/${site.whatsappInternational}`;

/** Pesan pemesanan untuk satu kemasan, dengan harga otomatis dari content loader (`src/lib/content.ts`). */
export function buildPackMessage(quantity: number, price: number): string {
  const formatted = `Rp${price.toLocaleString('id-ID')}`;
  return `Halo OHMEGA, saya ingin memesan telur omega kemasan isi ${quantity} seharga ${formatted}.\n\nNama:\nAlamat pengiriman:\nJumlah kemasan:\nPilihan waktu pengiriman:`;
}

export const messages = {
  general: `Halo OHMEGA, saya ingin menanyakan produk telur OHMEGA. Mohon informasi harga dan ketersediaan untuk wilayah ${site.serviceArea}.`,
  pack4:   buildPackMessage(4, prices.pack4),
  pack10:  buildPackMessage(10, prices.pack10),
  pack30:  buildPackMessage(30, prices.pack30),
} as const;

export function buildWhatsAppLink(message: string): string {
  return `${base}?text=${encodeURIComponent(message)}`;
}
