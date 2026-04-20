import React, { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Card } from '../types';
import { useDecks } from '../context/DecksContext';
import PrimaryButton from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type Choice = {
  id: string;
  value: string;
  isCorrect: boolean;
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizScreen({ route, navigation }: Props) {
  const { deckId } = route.params;
  const { getDeckById, recordQuizResult } = useDecks();
  const deck = getDeckById(deckId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const currentCard = deck?.cards[currentIndex];

  const choices = useMemo<Choice[]>(() => {
    if (!deck || !currentCard) return [];

    const wrongAnswers = shuffle(
      deck.cards
        .filter((card: Card) => card.id !== currentCard.id)
        .map((card: Card) => card.answer)
    ).slice(0, 3);

    return shuffle([
      { id: 'correct', value: currentCard.answer, isCorrect: true },
      ...wrongAnswers.map((answer: string, index: number) => ({
        id: `wrong-${index}`,
        value: answer,
        isCorrect: false,
      })),
    ]);
  }, [deck, currentCard]);

  useEffect(() => {
    if (!deck || deck.cards.length < 2) return;
    if (finished) {
      recordQuizResult(deck.id, score);
      Alert.alert('Quiz finished', `You scored ${score} out of ${deck.cards.length}.`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [finished, deck, navigation, recordQuizResult, score]);

  if (!deck || deck.cards.length < 2 || !currentCard) {
    return (
      <View style={styles.centered}>
        <Text>You need at least 2 cards to take a quiz.</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!selectedChoice) {
      Alert.alert('Pick an answer', 'Please choose one option before continuing.');
      return;
    }

    const chosen = choices.find((choice) => choice.id === selectedChoice);
    const nextScore = chosen?.isCorrect ? score + 1 : score;

    if (currentIndex === deck.cards.length - 1) {
      setScore(nextScore);
      setFinished(true);
      return;
    }

    setScore(nextScore);
    setCurrentIndex((prev) => prev + 1);
    setSelectedChoice(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>
          Question {currentIndex + 1} of {deck.cards.length}
        </Text>
        <Text style={styles.prompt}>{currentCard.question}</Text>

        {choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          return (
            <PrimaryButton
              key={choice.id}
              title={choice.value}
              onPress={() => setSelectedChoice(choice.id)}
              variant={isSelected ? 'primary' : 'secondary'}
            />
          );
        })}

        <View style={styles.submitWrap}>
          <PrimaryButton title="Submit Answer" onPress={handleSubmit} />
        </View>
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
    color: '#334155',
    fontWeight: '700',
    marginBottom: 16,
  },
  prompt: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
  },
  submitWrap: {
    marginTop: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

