import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useDecks } from '../context/DecksContext';
import StudyCard from '../components/StudyCard';
import PrimaryButton from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Study'>;

export default function StudyScreen({ route }: Props) {
  const { deckId } = route.params;
  const { getDeckById, markStudied } = useDecks();
  const deck = getDeckById(deckId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = useMemo(() => deck?.cards[index], [deck, index]);

  useEffect(() => {
    if (deck && deck.cards.length > 0) {
      markStudied(deck.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!deck || deck.cards.length === 0 || !card) {
    return (
      <View style={styles.centered}>
        <Text>No cards available to study.</Text>
      </View>
    );
  }

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1 < deck.cards.length ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>
          Card {index + 1} of {deck.cards.length}
        </Text>

        <StudyCard
          front={card.question}
          back={card.answer}
          flipped={flipped}
          onFlip={() => setFlipped((prev) => !prev)}
        />

        <PrimaryButton title="Previous" onPress={handlePrev} disabled={index === 0} />
        <PrimaryButton title="Next" onPress={handleNext} disabled={index === deck.cards.length - 1} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  progress: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

