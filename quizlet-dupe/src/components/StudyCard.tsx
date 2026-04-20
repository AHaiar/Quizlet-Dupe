import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
};

export default function StudyCard({ front, back, flipped, onFlip }: Props) {
  return (
    <Pressable onPress={onFlip} style={styles.outer}>
      <View style={styles.card}>
        <Text style={styles.label}>{flipped ? 'Answer' : 'Question'}</Text>
        <Text style={styles.text}>{flipped ? back : front}</Text>
        <Text style={styles.helper}>Tap to flip</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginVertical: 16,
  },
  card: {
    minHeight: 260,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  helper: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 14,
  },
});

