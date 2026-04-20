import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useDecks } from '../context/DecksContext';
import DeckCard from '../components/DeckCard';
import PrimaryButton from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { decks, loading } = useDecks();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Study smarter</Text>
        <Text style={styles.subheading}>Build decks, review flashcards, and test yourself.</Text>

        <PrimaryButton title="Create New Deck" onPress={() => navigation.navigate('CreateDeck')} />

        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DeckCard deck={item} onPress={() => navigation.navigate('DeckDetails', { deckId: item.id })} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No decks yet. Create your first one.</Text>}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  inner: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 16,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  empty: {
    marginTop: 24,
    color: '#64748b',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
