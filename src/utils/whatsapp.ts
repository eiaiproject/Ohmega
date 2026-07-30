import { site } from '../data/site';

const base = `https://wa.me/${site.whatsappInternational}`;

export const messages = {
  general: `Halo OHMEGA, saya ingin menanyakan produk telur OHMEGA. Mohon informasi harga dan ketersediaan untuk wilayah ${site.serviceArea}.`,
  pack4:   `Halo OHMEGA, saya ingin mendapatkan informasi saat kemasan isi 4 sudah tersedia.`,
  pack6:   `Halo OHMEGA, saya ingin mendapatkan informasi saat kemasan isi 6 sudah tersedia.`,
  pack10:  `Halo OHMEGA, saya ingin memesan telur omega kemasan isi 10 seharga Rp29.000.\n\nNama:\nAlamat pengiriman:\nJumlah kemasan:\nPilihan waktu pengiriman:`,
  pack30:  `Halo OHMEGA, saya ingin memesan telur omega kemasan isi 30 seharga Rp81.000.\n\nNama:\nAlamat pengiriman:\nJumlah kemasan:\nPilihan waktu pengiriman:`,
} as const;

export function buildWhatsAppLink(message: string): string {
  return `${base}?text=${encodeURIComponent(message)}`;
}
