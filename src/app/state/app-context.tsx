"use client";

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Define types
export type Guest = {
  id: string;
  name: string;
  rsvpTime: string;
};

export type EventDetails = {
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  coverPhotoUrl: string;
  coverPhotoHint: string;
  rsvpsOpen: boolean;
};

type AppState = {
  eventDetails: EventDetails;
  guests: Guest[];
  rsvpSubmitted: boolean;
};

type Action =
  | { type: 'UPDATE_EVENT_DETAILS'; payload: Partial<EventDetails> }
  | { type: 'ADD_GUEST'; payload: { name: string } }
  | { type: 'RESET_RSVP' }
  | { type: 'HYDRATE_STATE'; payload: AppState };

// Initial State
const coverImage = PlaceHolderImages.find(img => img.id === 'event-cover')!;
const initialState: AppState = {
  eventDetails: {
    name: 'Midnight Bloom',
    date: 'SAT, OCT 26',
    time: '9:00 PM',
    venue: 'The Void',
    description: 'An immersive journey into sound and light. Lose yourself in the deep grooves and electric atmosphere. This is not just a party; it\'s an experience. Limited entry. Pure vibes only.',
    coverPhotoUrl: coverImage.imageUrl,
    coverPhotoHint: coverImage.imageHint,
    rsvpsOpen: true,
  },
  guests: [
    { id: '1', name: 'Alice', rsvpTime: new Date(Date.now() - 3600000).toLocaleString() },
    { id: '2', name: 'Bob', rsvpTime: new Date(Date.now() - 7200000).toLocaleString() },
  ],
  rsvpSubmitted: false,
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE_STATE':
        return { ...state, ...action.payload };
    case 'UPDATE_EVENT_DETAILS':
      return {
        ...state,
        eventDetails: { ...state.eventDetails, ...action.payload },
      };
    case 'ADD_GUEST':
      if (action.payload.name.trim() === '') return state;
      const newGuest: Guest = {
        id: new Date().toISOString(),
        name: action.payload.name,
        rsvpTime: new Date().toLocaleString(),
      };
      return {
        ...state,
        guests: [newGuest, ...state.guests],
        rsvpSubmitted: true
      };
    case 'RESET_RSVP':
      return {
        ...state,
        rsvpSubmitted: false,
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Provider
const LOCAL_STORAGE_KEY = 'showup_app_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'HYDRATE_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Don't persist the temporary rsvpSubmitted flag across sessions
      const stateToSave = { ...state, rsvpSubmitted: false };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

// Custom hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
