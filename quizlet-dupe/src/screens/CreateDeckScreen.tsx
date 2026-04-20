import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import { useDecks } from '../context/DecksContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateDeck'>;

export default function CreateDeckScreen({ navigation }: Props) {
  const { createDeck } = useDecks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a deck title.');
      return;
    }

    const deckId = createDeck(title.trim(), description.trim());
    navigation.replace('DeckDetails', { deckId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="Deck title"
          value={title}
          onChangeText={setTitle}
          placeholder="Biology Chapter 1"
        />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Cells, DNA, and organelles"
          multiline
        />
        <PrimaryButton title="Create Deck" onPress={handleCreate} />
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

