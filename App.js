import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';

const HIGHLIGHT_MS = 250;

export default function App() {
  const [count, setCount] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const flash = () => {
    setHighlight(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHighlight(false), HIGHLIGHT_MS);
  };

  const handleTap = () => {
    setCount((prev) => {
      const next = prev + 1;
      if (next % 10 === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        flash();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return next;
    });
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCount(0);
    setHighlight(false);
  };

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.center}>
        <Text style={[styles.count, highlight && styles.countHighlight]}>
          {count}
        </Text>
        <Text style={styles.hint}>画面をタップ</Text>
      </View>
      <Pressable
        onPress={handleReset}
        style={({ pressed }) => [styles.reset, pressed && styles.resetPressed]}
        hitSlop={12}
      >
        <Text style={styles.resetText}>リセット</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 56,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 120,
    fontWeight: '700',
    color: '#222222',
    fontVariant: ['tabular-nums'],
  },
  countHighlight: {
    color: '#FF6B35',
  },
  hint: {
    marginTop: 12,
    fontSize: 16,
    color: '#999999',
  },
  reset: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  resetPressed: {
    backgroundColor: '#EEEEEE',
  },
  resetText: {
    fontSize: 14,
    color: '#666666',
  },
});
