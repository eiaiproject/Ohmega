import { prices, perUnitPrice } from '../lib/content';
import { buildWhatsAppLink, buildPackMessage } from '../utils/whatsapp';

export interface Product {
  id: 'pack-4' | 'pack-10' | 'pack-30';
  name: string;
  quantity: number;
  image: string;
  imageAlt: string;
  description: string;
  badge?: string;
  status: 'available' | 'coming-soon';
  price?: number;
  pricePerUnit?: number;
  savings?: number;
  whatsappHref: string;
  buttonLabel: string;
}

/** Tabungan isi 30 dibanding isi 10: hanya dihitung jika memang lebih hemat. */
const savingsPack30 = perUnitPrice(10, prices.pack10) * 30 - prices.pack30;

export const products: Product[] = [
  {
    id: 'pack-4',
    name: 'OHMEGA Isi 4',
    quantity: 4,
    image: '/images/product-4.webp',
    imageAlt: 'Kemasan telur OHMEGA isi 4',
    description: 'Pilihan ringkas untuk mencoba atau memenuhi kebutuhan praktis.',
    status: 'available',
    price: prices.pack4,
    pricePerUnit: perUnitPrice(4, prices.pack4),
    whatsappHref: buildWhatsAppLink(buildPackMessage(4, prices.pack4)),
    buttonLabel: 'Pesan Isi 4',
  },
  {
    id: 'pack-10',
    name: 'OHMEGA Isi 10',
    quantity: 10,
    image: '/images/product-10.webp',
    imageAlt: 'Kemasan telur OHMEGA isi 10',
    description: 'Pilihan yang sesuai untuk kebutuhan keluarga.',
    badge: 'Pilihan Keluarga',
    status: 'available',
    price: prices.pack10,
    pricePerUnit: perUnitPrice(10, prices.pack10),
    whatsappHref: buildWhatsAppLink(buildPackMessage(10, prices.pack10)),
    buttonLabel: 'Pesan Isi 10',
  },
  {
    id: 'pack-30',
    name: 'OHMEGA Isi 30',
    quantity: 30,
    image: '/images/product-30.webp',
    imageAlt: 'Kemasan telur OHMEGA isi 30',
    description: 'Pilihan jumlah besar untuk kebutuhan rutin atau usaha.',
    badge: savingsPack30 > 0 ? 'Paling Hemat' : undefined,
    status: 'available',
    price: prices.pack30,
    pricePerUnit: perUnitPrice(30, prices.pack30),
    savings: savingsPack30 > 0 ? savingsPack30 : undefined,
    whatsappHref: buildWhatsAppLink(buildPackMessage(30, prices.pack30)),
    buttonLabel: 'Pesan Isi 30',
  },
];

/** Harga per butir termurah dari semua kemasan yang tersedia (untuk "Mulai Rp… per butir"). */
const pricedProducts = products.filter(p => p.status === 'available' && p.price);
export const startingPerUnit = pricedProducts.length
  ? Math.min(...pricedProducts.map(p => p.price! / p.quantity))
  : 0;
