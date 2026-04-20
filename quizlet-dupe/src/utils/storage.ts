import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck } from '../types';

const STORAGE_KEY = 'quizlet_dupe_decks_v1';

export async function saveDecks(decks: Deck[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export async function loadDecks(): Promise<Deck[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Deck[];
  } catch {
    return [];
  }
}
