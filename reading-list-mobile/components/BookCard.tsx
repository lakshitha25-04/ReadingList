import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Book } from '../types';
import { Palette } from '../theme/colors';

function StarRating({ rating, color }: { rating: number; color: string }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return <Text accessibilityLabel={`${rating} out of 5 stars`} style={[styles.rating, { color }]}>{'★'.repeat(filled)}<Text style={styles.emptyStars}>{'★'.repeat(5 - filled)}</Text></Text>;
}

export function BookCard({ book, colors, kids = false, onPress }: { book: Book; colors: Palette; kids?: boolean; onPress?: () => void }) {
  return <TouchableOpacity activeOpacity={.82} onPress={onPress} style={[styles.card, kids && styles.kidsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <Image source={{ uri: book.cover }} style={[styles.cover, kids && styles.kidsCover]} />
    <View style={styles.info}>
      <Text numberOfLines={1} style={[styles.title, kids && styles.kidsTitle, { color: colors.text }]}>{book.title}</Text>
      <Text numberOfLines={1} style={[styles.author, kids && styles.kidsAuthor, { color: colors.muted }]}>{book.author}</Text>
      <View style={styles.meta}><Text style={[styles.genre, { color: colors.primary, backgroundColor: colors.chip }]}>{book.genre}</Text><StarRating rating={book.rating} color={kids ? '#FF7A00' : colors.accent} /></View>
    </View>
  </TouchableOpacity>;
}
const styles = StyleSheet.create({
  card: { width: 158, borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginRight: 12, shadowColor: '#1E2935', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .12, shadowRadius: 7, elevation: 4 },
  kidsCard: { width: 224, borderRadius: 30, borderWidth: 5, marginRight: 16, shadowColor: '#6C2BD9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: .32, shadowRadius: 8, elevation: 9 },
  cover: { height: 172, width: '100%', backgroundColor: '#DCE4E8', borderTopLeftRadius: 15, borderTopRightRadius: 15 }, kidsCover: { height: 260, borderTopLeftRadius: 25, borderTopRightRadius: 25 }, info: { padding: 12 }, title: { fontSize: 15, lineHeight: 20, fontWeight: '800' }, kidsTitle: { fontSize: 20, lineHeight: 25 }, author: { fontSize: 13, lineHeight: 18, marginTop: 4 }, kidsAuthor: { fontSize: 14, marginTop: 5 }, meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }, genre: { fontSize: 10, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 9 }, rating: { fontSize: 12, letterSpacing: 0.4 }, emptyStars: { color: '#C9CFD5' },
});
