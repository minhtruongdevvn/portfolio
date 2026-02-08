import { SVG_DATA_URIS } from './svg-data.js';

export const BASE_URL = import.meta.env.VITE_BASE_URL || '';

// Icon paths
export const ICONS = {
  computer: SVG_DATA_URIS['computer'],
  recycleBin: SVG_DATA_URIS['recycle-bin'],
  fileExplorer: SVG_DATA_URIS['file-explorer'],
  steam: SVG_DATA_URIS['steam'],
  photos: SVG_DATA_URIS['photos'],
  movies: SVG_DATA_URIS['movies'],
  briefcase: SVG_DATA_URIS['briefcase'],
  graduation: SVG_DATA_URIS['graduation'],
  projects: SVG_DATA_URIS['projects'],
  music: SVG_DATA_URIS['music'],
  windowsLogo: SVG_DATA_URIS['windows-logo'],
  volume: SVG_DATA_URIS['volume'],
  network: SVG_DATA_URIS['network'],
  battery: SVG_DATA_URIS['battery'],
  textEditor: SVG_DATA_URIS['text-editor'], // Added
  iframe: SVG_DATA_URIS['iframe'], // Added
} as const;

// Wallpaper paths
export const WALLPAPERS = {
  default: `${BASE_URL}assets/wallpapers/windows7.jpg`,
  apocalypse: `${BASE_URL}assets/wallpapers/apocalypse.jpg`,
} as const;

type AssetCategory = 'icons' | 'wallpapers';
type IconKey = keyof typeof ICONS;
type WallpaperKey = keyof typeof WALLPAPERS;

/**
 * Helper function to get asset URL
 * Usage: getAssetUrl('icons', 'computer')
 */
export function getAssetUrl(category: 'icons', name: IconKey): string;
export function getAssetUrl(category: 'wallpapers', name: WallpaperKey): string;
export function getAssetUrl(category: AssetCategory, name: string): string {
  const categories = {
    icons: ICONS,
    wallpapers: WALLPAPERS,
  };

  return (categories[category] as Record<string, string>)?.[name] || '';
}
