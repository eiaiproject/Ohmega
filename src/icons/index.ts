const spriteFiles = import.meta.glob('./sprite/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export const ICON_NAMES = [
  'arrow_right','check','close','external_link','factory','instagram','location',
  'menu','message','nutrition','shield','store','truck'
] as const;

export type IconName = typeof ICON_NAMES[number];

export function getIcon(name: IconName): string {
  const path = `./sprite/${name}.svg`;
  const url = spriteFiles[path];
  if (!url) throw new Error(`Icon not found: ${name}`);
  return url;
}
