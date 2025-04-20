import { createSlice, configureStore } from '@reduxjs/toolkit';

// Add these helper functions at the top of the file
const generateRandomColor = () => {
  const colors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#FF9800', // Orange
    '#F44336', // Red
    '#3F51B5', // Indigo
    '#009688', // Teal
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#E91E63', // Pink
    '#673AB7', // Deep Purple
    '#00BCD4'  // Cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('notesState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Update the initial state to include subject colors
const initialState = {
  notes: [],
  categories: ['Personal', 'Work', 'Ideas', 'Tasks'],
  subjects: [], // Subject names array
  subjectColors: {}, // Map of subject names to colors
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: loadState()?.notes || initialState,
  reducers: {
    addNote: (state, action) => {
      state.notes.push({
        id: Date.now().toString(),
        title: action.payload.title || 'Untitled',
        content: action.payload.content || '',
        category: action.payload.category || 'Personal',
        subject: action.payload.subject || '',
        tags: action.payload.tags || [],
        updatedAt: action.payload.updatedAt || new Date().toISOString(),
        archived: false
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
    addTag: (state, action) => {
      if (!state.tags) state.tags = [];
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    },
    addSubject: (state, action) => {
      if (!state.subjects.includes(action.payload)) {
        state.subjects.push(action.payload);
        // Add a random color for the new subject
        if (!state.subjectColors) state.subjectColors = {};
        state.subjectColors[action.payload] = generateRandomColor();
      }
    },
    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(subject => subject !== action.payload);
      // Remove the color for the deleted subject
      if (state.subjectColors) {
        delete state.subjectColors[action.payload];
      }
      // Also remove this subject from all notes that use it
      state.notes = state.notes.map(note => ({
        ...note,
        subject: note.subject === action.payload ? '' : note.subject
      }));
    }
  }
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: loadState()?.ui || {
    darkMode: false,
    themeMode: 'system',
    searchQuery: '',
    selectedCategory: 'all',
    isFullscreen: false
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload;
    },
    resetFullscreen: (state) => {
      state.isFullscreen = false;
    }
  }
});

export const { addNote, updateNote, deleteNote, addTag, addSubject, removeSubject } = notesSlice.actions;
export const { 
  setDarkMode, 
  setThemeMode, 
  setSearchQuery, 
  setSelectedCategory,
  setFullscreen,
  resetFullscreen
} = uiSlice.actions;

// Add a selector to get subject color
export const getSubjectColor = (state, subject) => {
  return state.notes.subjectColors?.[subject] || '#757575'; // Default color if not found
};

const store = configureStore({
  reducer: {
    notes: notesSlice.reducer,
    ui: uiSlice.reducer
  }
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem('notesState', JSON.stringify(state));
  } catch (err) {
    console.error('Could not save state:', err);
  }
});

export default store;