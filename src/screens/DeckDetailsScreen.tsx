import React from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useDecks } from '../context/DecksContext';
import PrimaryButton from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'DeckDetails'>;

export default function DeckDetailsScreen({ route, navigation }: Props) {
  const { deckId } = route.params;
  const { getDeckById, deleteDeck, deleteCard, resetProgress } = useDecks();
  const deck = getDeckById(deckId);

  if (!deck) {
    return (
      <View style={styles.centered}>
        <Text>Deck not found.</Text>
      </View>
    );
  }

  const confirmDeleteDeck = () => {
    Alert.alert('Delete deck', 'This will permanently remove the deck and all cards.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDeck(deck.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const confirmDeleteCard = (cardId: string) => {
    Alert.alert('Delete card', 'Are you sure you want to remove this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCard(deck.id, cardId),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={deck.cards}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{deck.title}</Text>
            <Text style={styles.description}>{deck.description || 'No description yet'}</Text>

            <View style={styles.statsBox}>
              <Text style={styles.stat}>Cards: {deck.cards.length}</Text>
              <Text style={styles.stat}>Studied: {deck.progress.studiedCount}</Text>
              <Text style={styles.stat}>Total correct answers: {deck.progress.correctCount}</Text>
              <Text style={styles.stat}>Quiz attempts: {deck.progress.quizAttempts}</Text>
            </View>

            <PrimaryButton title="Add Card" onPress={() => navigation.navigate('EditCard', { deckId: deck.id })} />
            <PrimaryButton
              title="Study Flashcards"
              onPress={() => navigation.navigate('Study', { deckId: deck.id })}
              disabled={deck.cards.length === 0}
            />
            <PrimaryButton
              title="Start Quiz"
              variant="secondary"
              onPress={() => navigation.navigate('Quiz', { deckId: deck.id })}
              disabled={deck.cards.length < 2}
            />
            <PrimaryButton title="Reset Progress" variant="secondary" onPress={() => resetProgress(deck.id)} />
            <PrimaryButton title="Delete Deck" variant="danger" onPress={confirmDeleteDeck} />

            <Text style={styles.cardsHeading}>Cards</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              <Text style={styles.cardQuestion}>{item.question}</Text>
              <Text style={styles.cardAnswer}>{item.answer}</Text>
            </View>
            <View style={styles.cardActions}>
              <PrimaryButton
                title="Edit"
                onPress={() => navigation.navigate('EditCard', { deckId: deck.id, cardId: item.id })}
                variant="secondary"
              />
              <PrimaryButton title="Delete" onPress={() => confirmDeleteCard(item.id)} variant="danger" />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No cards yet. Add your first card.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 16,
  },
  statsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  stat: {
    color: '#334155',
    marginBottom: 4,
    fontWeight: '600',
  },
  cardsHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 18,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardRow: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    marginBottom: 12,
  },
  cardQuestion: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardAnswer: {
    fontSize: 15,
    color: '#475569',
  },
  cardActions: {
    flexDirection: 'column',
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 10,
    marginHorizontal: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

