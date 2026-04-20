import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Card } from '../types';
import { useDecks } from '../context/DecksContext';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCard'>;

export default function EditCardScreen({ route, navigation }: Props) {
  const { deckId, cardId } = route.params;
  const { getDeckById, addCard, updateCard } = useDecks();
  const deck = getDeckById(deckId);

  const existingCard = useMemo(() => deck?.cards.find((card: Card) => card.id === cardId), [deck, cardId]);

  const [question, setQuestion] = useState(existingCard?.question ?? '');
  const [answer, setAnswer] = useState(existingCard?.answer ?? '');

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Missing fields', 'Please enter both a question and an answer.');
      return;
    }

    if (!deck) {
      Alert.alert('Error', 'Deck not found.');
      return;
    }

    if (existingCard) {
      updateCard(deck.id, existingCard.id, question.trim(), answer.trim());
    } else {
      addCard(deck.id, question.trim(), answer.trim());
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="Front / question"
          value={question}
          onChangeText={setQuestion}
          placeholder="What is the powerhouse of the cell?"
          multiline
        />
        <TextField
          label="Back / answer"
          value={answer}
          onChangeText={setAnswer}
          placeholder="The mitochondria"
          multiline
        />
        <PrimaryButton title={existingCard ? 'Save Changes' : 'Add Card'} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
});
