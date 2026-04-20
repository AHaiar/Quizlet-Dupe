import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Card, Deck } from '../types';
import { loadDecks, saveDecks } from '../utils/storage';
import { makeId } from '../utils/id';

type DecksContextType = {
  decks: Deck[];
  loading: boolean;
  createDeck: (title: string, description: string) => string;
  updateDeck: (deckId: string, title: string, description: string) => void;
  deleteDeck: (deckId: string) => void;
  getDeckById: (deckId: string) => Deck | undefined;
  addCard: (deckId: string, question: string, answer: string) => void;
  updateCard: (deckId: string, cardId: string, question: string, answer: string) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  markStudied: (deckId: string) => void;
  recordQuizResult: (deckId: string, correctAnswers: number) => void;
  resetProgress: (deckId: string) => void;
};

const DecksContext = createContext<DecksContextType | undefined>(undefined);

export function DecksProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadDecks();
      if (saved.length > 0) {
        setDecks(saved);
      } else {
        setDecks([
          {
            id: makeId(),
            title: 'Spanish Basics',
            description: 'Starter vocabulary',
            createdAt: Date.now(),
            progress: {
              studiedCount: 0,
              correctCount: 0,
              quizAttempts: 0,
            },
            cards: [
              { id: makeId(), question: 'Hola', answer: 'Hello' },
              { id: makeId(), question: 'Adiós', answer: 'Goodbye' },
              { id: makeId(), question: 'Gracias', answer: 'Thank you' },
            ],
          },
        ]);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveDecks(decks).catch(console.error);
    }
  }, [decks, loading]);

  const value = useMemo<DecksContextType>(() => ({
    decks,
    loading,
    createDeck: (title, description) => {
      const newDeck: Deck = {
        id: makeId(),
        title,
        description,
        createdAt: Date.now(),
        progress: {
          studiedCount: 0,
          correctCount: 0,
          quizAttempts: 0,
        },
        cards: [],
      };
      setDecks((prev) => [newDeck, ...prev]);
      return newDeck.id;
    },
    updateDeck: (deckId, title, description) => {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId ? { ...deck, title, description } : deck
        )
      );
    },
    deleteDeck: (deckId) => {
      setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
    },
    getDeckById: (deckId) => decks.find((deck) => deck.id === deckId),
    addCard: (deckId, question, answer) => {
      const newCard: Card = { id: makeId(), question, answer };
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId ? { ...deck, cards: [...deck.cards, newCard] } : deck
        )
      );
    },
    updateCard: (deckId, cardId, question, answer) => {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                cards: deck.cards.map((card) =>
                  card.id === cardId ? { ...card, question, answer } : card
                ),
              }
            : deck
        )
      );
    },
    deleteCard: (deckId, cardId) => {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId
            ? { ...deck, cards: deck.cards.filter((card) => card.id !== cardId) }
            : deck
        )
      );
    },
    markStudied: (deckId) => {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                progress: {
                  ...deck.progress,
                  studiedCount: deck.progress.studiedCount + 1,
                },
              }
            : deck
        )
      );
    },
    recordQuizResult: (deckId, correctAnswers) => {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                progress: {
                  studiedCount: deck.progress.studiedCount,
                  correctCount: deck.progress.correctCount + correctAnswers,
                  quizAttempts: deck.progress.quizAttempts + 1,
                },
              }
            : deck
        )
      );
    },
    resetProgress: (deckId) => {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                progress: {
                  studiedCount: 0,
                  correctCount: 0,
                  quizAttempts: 0,
                },
              }
            : deck
        )
      );
    },
  }), [decks, loading]);

  return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>;
}

export function useDecks() {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error('useDecks must be used inside DecksProvider');
  }
  return context;
}