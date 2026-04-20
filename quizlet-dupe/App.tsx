import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CreateDeckScreen from './src/screens/CreateDeckScreen';
import DeckDetailsScreen from './src/screens/DeckDetailsScreen';
import StudyScreen from './src/screens/StudyScreen';
import QuizScreen from './src/screens/QuizScreen';
import EditCardScreen from './src/screens/EditCardScreen';
import { DecksProvider } from './src/context/DecksContext';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <DecksProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Decks' }} />
          <Stack.Screen name="CreateDeck" component={CreateDeckScreen} options={{ title: 'Create Deck' }} />
          <Stack.Screen name="DeckDetails" component={DeckDetailsScreen} options={{ title: 'Deck Details' }} />
          <Stack.Screen name="EditCard" component={EditCardScreen} options={{ title: 'Edit Card' }} />
          <Stack.Screen name="Study" component={StudyScreen} options={{ title: 'Study' }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </DecksProvider>
  );
}

