import { configureStore, createSlice } from '@reduxjs/toolkit';

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    categories: ['Personal', 'Work', 'Ideas', 'Tasks'],
    tags: []
  },
  reducers: {
    addNote: (state, action) => {
      state.notes.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    addCategory: (state, action) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    addTag: (state, action) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    }
  }
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    searchQuery: '',
    selectedCategory: 'all',
    darkMode: false
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { 
  addNote, 
  updateNote, 
  deleteNote, 
  addCategory, 
  addTag 
} = notesSlice.actions;

export const { 
  setSearchQuery, 
  setSelectedCategory, 
  toggleDarkMode 
} = uiSlice.actions;

const store = configureStore({
  reducer: {
    notes: notesSlice.reducer,
    ui: uiSlice.reducer
  }
});

export default store; 