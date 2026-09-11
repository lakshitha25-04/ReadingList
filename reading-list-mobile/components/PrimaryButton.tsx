import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Palette } from '../theme/colors';

export function PrimaryButton({ label, onPress, colors, compact = false, disabled = false }: { label: string; onPress: () => void; colors: Palette; compact?: boolean; disabled?: boolean }) {
  return <TouchableOpacity activeOpacity={.78} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.button, { backgroundColor: colors.primary }, disabled && styles.disabled, compact && styles.compact]}><Text style={[styles.label, compact && styles.compactLabel]}>{label}</Text></TouchableOpacity>;
}
const styles = StyleSheet.create({ button: { minHeight: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, shadowColor: '#1E2935', shadowOffset: { width: 0, height: 3 }, shadowOpacity: .14, shadowRadius: 5, elevation: 3 }, disabled: { opacity: .45 }, compact: { minHeight: 38, borderRadius: 11 }, label: { color: '#fff', fontSize: 16, fontWeight: '800' }, compactLabel: { fontSize: 13 } });
