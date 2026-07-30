export interface Product {
  id: 'pack-4' | 'pack-6' | 'pack-10' | 'pack-30';
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

function waLink(msg: string): string {
  const base = 'https://wa.me/6285111331269';
  return `${base}?text=${encodeURIComponent(msg)}`;
}

const msgPack10 = `Halo OHMEGA, saya ingin memesan telur omega kemasan isi 10 seharga Rp29.000.

Nama:
Alamat pengiriman:
Jumlah kemasan:
Pilihan waktu pengiriman:`;

const msgPack30 = `Halo OHMEGA, saya ingin memesan telur omega kemasan isi 30 seharga Rp81.000.

Nama:
Alamat pengiriman:
Jumlah kemasan:
Pilihan waktu pengiriman:`;

const msgPack4 = `Halo OHMEGA, saya ingin mendapatkan informasi saat kemasan isi 4 sudah tersedia.`;

const msgPack6 = `Halo OHMEGA, saya ingin mendapatkan informasi saat kemasan isi 6 sudah tersedia.`;

export const products: Product[] = [
  {
    id: 'pack-10',
    name: 'OHMEGA Isi 10',
    quantity: 10,
    image: '/images/product-10.svg',
    imageAlt: 'Kemasan telur OHMEGA isi 10',
    description: 'Pilihan yang sesuai untuk kebutuhan keluarga.',
    badge: 'Pilihan Keluarga',
    status: 'available',
    price: 29000,
    pricePerUnit: 2900,
    whatsappHref: waLink(msgPack10),
    buttonLabel: 'Pesan Isi 10',
  },
  {
    id: 'pack-30',
    name: 'OHMEGA Isi 30',
    quantity: 30,
    image: '/images/product-30.svg',
    imageAlt: 'Kemasan telur OHMEGA isi 30',
    description: 'Pilihan jumlah besar untuk kebutuhan rutin atau usaha.',
    badge: 'Paling Hemat',
    status: 'available',
    price: 81000,
    pricePerUnit: 2700,
    savings: 6000,
    whatsappHref: waLink(msgPack30),
    buttonLabel: 'Pesan Isi 30',
  },
  {
    id: 'pack-4',
    name: 'OHMEGA Isi 4',
    quantity: 4,
    image: '/images/product-4.svg',
    imageAlt: 'Ilustrasi kemasan OHMEGA isi 4',
    description: 'Pilihan ringkas untuk mencoba atau memenuhi kebutuhan praktis.',
    status: 'coming-soon',
    whatsappHref: waLink(msgPack4),
    buttonLabel: 'Tanya Ketersediaan',
  },
  {
    id: 'pack-6',
    name: 'OHMEGA Isi 6',
    quantity: 6,
    image: '/images/product-6.svg',
    imageAlt: 'Ilustrasi kemasan OHMEGA isi 6',
    description: 'Pilihan praktis untuk kebutuhan telur dalam jumlah kecil.',
    status: 'coming-soon',
    whatsappHref: waLink(msgPack6),
    buttonLabel: 'Tanya Ketersediaan',
  },
];
