import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Deck } from '../types';

type Props = {
  deck: Deck;
  onPress: () => void;
};

export default function DeckCard({ deck, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={styles.title}>{deck.title}</Text>
      <Text style={styles.description}>{deck.description || 'No description yet'}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{deck.cards.length} cards</Text>
        <Text style={styles.meta}>{deck.progress.quizAttempts} quizzes</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pressed: {
    opacity: 0.9,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  description: {
    color: '#475569',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
});
