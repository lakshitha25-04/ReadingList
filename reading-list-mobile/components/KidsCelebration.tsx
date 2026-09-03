import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export function KidsCelebration({ visible }: { visible: boolean }) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  }, [visible, pop]);
  if (!visible) return null;
  return <Animated.View pointerEvents="none" style={[styles.card, { opacity: pop, transform: [{ scale: pop }] }]}><Text style={styles.sparkles}>✨ 🎈 ✨</Text><Text style={styles.message}>Great job! 🎉</Text><Text style={styles.sparkles}>⭐ 🎊 ⭐</Text></Animated.View>;
}
const styles = StyleSheet.create({ card: { position: 'absolute', zIndex: 50, alignSelf: 'center', top: '40%', backgroundColor: '#6C2BD9', borderColor: '#FFEA00', borderWidth: 5, borderRadius: 28, paddingHorizontal: 25, paddingVertical: 17, alignItems: 'center', shadowColor: '#24113D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: .35, shadowRadius: 10, elevation: 12 }, message: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' }, sparkles: { fontSize: 22, marginVertical: 2 } });
