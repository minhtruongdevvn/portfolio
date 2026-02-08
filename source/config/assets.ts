export const BASE_URL = 'https://conrad-truong.online/';  // Empty string for local paths

// Icon paths
export const ICONS = {
  computer: `${BASE_URL}assets/icons/computer.svg`,
  recycleBin: `${BASE_URL}assets/icons/recycle-bin.svg`,
  fileExplorer: `${BASE_URL}assets/icons/file-explorer.svg`,
  steam: `${BASE_URL}assets/icons/steam.svg`,
  photos: `${BASE_URL}assets/icons/photos.svg`,
  movies: `${BASE_URL}assets/icons/movies.svg`,
  briefcase: `${BASE_URL}assets/icons/briefcase.svg`,
  graduation: `${BASE_URL}assets/icons/graduation.svg`,
  projects: `${BASE_URL}assets/icons/projects.svg`,
  music: `${BASE_URL}assets/icons/music.svg`,
  windowsLogo: `${BASE_URL}assets/icons/windows-logo.svg`,
  volume: `${BASE_URL}assets/icons/volume.svg`,
  network: `${BASE_URL}assets/icons/network.svg`,
  battery: `${BASE_URL}assets/icons/battery.svg`,
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
