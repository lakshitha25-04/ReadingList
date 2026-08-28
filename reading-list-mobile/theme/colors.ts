import { ReadingMode } from '../types';

export const adultColors = {
  background: '#F6F5F2', surface: '#FFFFFF', primary: '#314B64', accent: '#C58B55',
  text: '#1E2935', muted: '#687581', border: '#E1E4E0', chip: '#E8EDF0', success: '#5B7F62',
};

export const kidsColors = {
  background: '#FFF8E8', surface: '#FFFFFF', primary: '#5B4CC4', accent: '#FF8A5B',
  text: '#312B4A', muted: '#6D6680', border: '#F1D7A9', chip: '#DDF5FF', success: '#39A96B',
};

export type Palette = typeof adultColors;
export const paletteFor = (mode: ReadingMode): Palette => mode === 'kids' ? kidsColors : adultColors;
