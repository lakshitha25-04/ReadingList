import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Palette } from '../theme/colors';

export function GenreChip({ label, colors, selected = false }: { label: string; colors: Palette; selected?: boolean }) {
  return <TouchableOpacity activeOpacity={.75} style={[styles.chip, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border }]}><Text style={[styles.text, { color: selected ? '#fff' : colors.text }]}>{label}</Text></TouchableOpacity>;
}
const styles = StyleSheet.create({ chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9, marginRight: 8 }, text: { fontSize: 13, fontWeight: '700' } });
