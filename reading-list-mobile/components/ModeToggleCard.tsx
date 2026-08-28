import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette } from '../theme/colors';
import { ReadingMode } from '../types';

export function ModeToggleCard({ mode, colors, onPress }: { mode: ReadingMode; colors: Palette; onPress: () => void }) {
  const kids = mode === 'kids';
  return <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: kids ? '#FFF0C7' : '#E9EFF3', borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: kids ? '#FFCE69' : '#B9CBD8' }]}><Text style={styles.emoji}>{kids ? '🦄' : '📚'}</Text></View><View style={styles.copy}><Text style={[styles.title, { color: colors.text }]}>{kids ? 'Kids Mode' : 'Adult Mode'}</Text><Text style={[styles.description, { color: colors.muted }]}>{kids ? 'Big books, bright colours, simple choices' : 'Discover, plan and track every great read'}</Text></View><Text style={[styles.arrow, { color: colors.primary }]}>›</Text></TouchableOpacity>;
}
const styles = StyleSheet.create({ card: { minHeight: 126, borderWidth: 1, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }, icon: { height: 62, width: 62, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 }, emoji: { fontSize: 30 }, copy: { flex: 1 }, title: { fontSize: 20, fontWeight: '800', marginBottom: 5 }, description: { fontSize: 13, lineHeight: 19 }, arrow: { fontSize: 34, fontWeight: '300' } });
