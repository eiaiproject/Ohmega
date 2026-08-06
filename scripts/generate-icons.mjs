import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const spriteDir = resolve(__dirname, '../src/icons/sprite');

// Mapping: local filename → reicon icon name
const ICON_MAP = {
  'arrow_right':    'ArrowRight',
  'check':          'Check',
  'chevron_down':   'ChevronDown',
  'close':          'X',
  'external_link':  'ArrowUpRight',
  'factory':        'Industry',
  'instagram':      'Instagram',
  'location':       'Location',
  'menu':           'Menu',
  'message':        'Message',
  'nutrition':      'ClipboardList',
  'package':        'Package',
  'phone':          'Phone',
  'shield':         'Shield',
  'store':          'Store',
  'truck':          'Truck',
};

mkdirSync(spriteDir, { recursive: true });

let imported = 0;
let failed = [];

for (const [file, iconName] of Object.entries(ICON_MAP)) {
  try {
    // Dynamically import the reicon icon module
    const mod = await import(`reicon/icons/${iconName}`);
    const iconFn = mod.default || mod[iconName];
    if (!iconFn || typeof iconFn.toSvg !== 'function') {
      failed.push(`${file} → ${iconName}: no toSvg`);
      continue;
    }
    const svg = iconFn.toSvg({ weight: 'Outline', size: 24, className: '' });
    // Add aria-hidden since icons are decorative
    const withAria = svg.replace('<svg ', '<svg aria-hidden="true" ');
    writeFileSync(resolve(spriteDir, `${file}.svg`), withAria, 'utf-8');
    imported++;
  } catch (e) {
    failed.push(`${file} → ${iconName}: ${e.message}`);
  }
}

console.log(`Generated ${imported} icons.`);
if (failed.length) {
  console.log('Failed:', failed.join('\n  '));
}
