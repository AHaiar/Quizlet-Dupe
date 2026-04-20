export type Card = {
  id: string;
  question: string;
  answer: string;
};

export type DeckProgress = {
  studiedCount: number;
  correctCount: number;
  quizAttempts: number;
};

export type Deck = {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  progress: DeckProgress;
  createdAt: number;
};

export type RootStackParamList = {
  Home: undefined;
  CreateDeck: undefined;
  DeckDetails: { deckId: string };
  EditCard: { deckId: string; cardId?: string };
  Study: { deckId: string };
  Quiz: { deckId: string };
};
