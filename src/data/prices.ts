// ─────────────────────────────────────────────────────────────
//  HARGA PRODUK OHMEGA
//  Ini SATU-SATUNYA file yang perlu Anda ubah saat harga telur
//  naik atau turun. Cukup ganti angkanya, lalu commit & deploy
//  (Cloudflare Pages akan membangun ulang situs secara otomatis).
//
//  Yang ikut menyesuaikan secara otomatis:
//  • Harga per butir di kartu produk
//  • Label "Hemat …" (isi 30 dibanding isi 10)
//  • Pesan WhatsApp saat pelanggan memesan
//  • Tulisan "Mulai Rp… per butir" di hero & trust bar
// ─────────────────────────────────────────────────────────────

export const prices = {
  // OHMEGA Isi 4 — harga per kemasan (4 butir)
  pack4: 12000,
  // OHMEGA Isi 10 — harga per kemasan (10 butir)
  pack10: 29000,
  // OHMEGA Isi 30 — harga per kemasan (30 butir)
  pack30: 81000,
} as const;

/** Harga per butir = harga kemasan ÷ jumlah butir (dibulatkan). */
export function perUnitPrice(quantity: number, price: number): number {
  return Math.round(price / quantity);
}
