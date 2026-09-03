import { ReadingMode } from '../types';

export const adultColors = {
  background: '#F6F5F2', surface: '#FFFFFF', primary: '#314B64', accent: '#C58B55',
  text: '#1E2935', muted: '#687581', border: '#E1E4E0', chip: '#E8EDF0', success: '#5B7F62', fontScale: 1,
};

export const kidsColors = {
  // Intentionally vivid and high-contrast: this palette is used only in Kids mode.
  background: '#FFF4B8', surface: '#FFFFFF', primary: '#6C2BD9', accent: '#FF7A00',
  text: '#24113D', muted: '#5B4774', border: '#FF3D81', chip: '#17C3B2', success: '#00A86B', fontScale: 1.2,
};

export type Palette = typeof adultColors;
export const paletteFor = (mode: ReadingMode): Palette => mode === 'kids' ? kidsColors : adultColors;
