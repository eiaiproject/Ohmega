import type { IconName } from '../icons';

export interface NutritionItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  featured: boolean;
  icon: IconName;
}

export const nutrition: NutritionItem[] = [
  { id: 'omega3', name: 'Omega-3', value: '793,1', unit: 'mg', featured: true,  icon: 'nutrition' },
  { id: 'dha',    name: 'DHA',      value: '399,8', unit: 'mg', featured: false, icon: 'nutrition' },
  { id: 'epa',    name: 'EPA',      value: '7,9',   unit: 'mg', featured: false, icon: 'nutrition' },
];

export const nutritionNote =
  'Informasi kandungan ditampilkan per 100 gram berdasarkan data pengujian produk. Dokumen pendukung akan ditambahkan setelah tersedia.';
