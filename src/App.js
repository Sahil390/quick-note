import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import NoteView from './components/NoteView';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store.js';
import { useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Create a wrapper component to access Redux state
const AppContent = () => {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const themeMode = useSelector((state) => state.ui.themeMode);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width:600px)');

  // Determine the actual theme mode based on user preference
  const actualDarkMode = themeMode === 'system' ? prefersDarkMode : darkMode;

  const theme = createTheme({
    palette: {
      mode: actualDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppLayout isMobile={isMobile} />
      </Router>
    </ThemeProvider>
  );
};

// Separate component that uses the theme
const AppLayout = ({ isMobile }) => {
  const location = useLocation();
  const isEditing = location.pathname.includes('/note/') || location.pathname === '/new';
  const isFullscreen = useSelector(state => state.ui.isFullscreen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditClick = (noteId) => {
    navigate(`/edit/${noteId}`);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box 
        component={motion.div}
        animate={{
          width: isEditing && !isMobile ? (isFullscreen ? '0%' : '50%') : '100%',
          x: (isEditing && isMobile) || (isEditing && isFullscreen) ? '-100%' : 0,
          transition: { duration: 0.3 }
        }}
        sx={{ 
          height: '100%',
          overflow: 'auto',
          position: (isMobile || isFullscreen) ? 'absolute' : 'relative',
          width: '100%'
        }}
      >
        <NotesList compact={isEditing && !isMobile && !isFullscreen} />
      </Box>

      <AnimatePresence>
        {isEditing && (
          <Box
            component={motion.div}
            initial={{ 
              width: 0, 
              opacity: 0,
              x: isMobile ? '100%' : 0
            }}
            animate={{ 
              width: isMobile || isFullscreen ? '100%' : '50%',
              opacity: 1,
              x: 0,
              transition: { duration: 0.3 }
            }}
            exit={{ 
              width: 0,
              opacity: 0,
              x: isMobile ? '100%' : 0,
              transition: { duration: 0.3 }
            }}
            sx={{
              height: '100%',
              position: 'fixed',
              right: 0,
              top: 0,
              overflow: 'hidden',
              borderLeft: theme => !isMobile && !isFullscreen && `1px solid ${theme.palette.divider}`,
              backgroundColor: theme => theme.palette.background.paper,
              zIndex: 1200
            }}
          >
            <Routes>
              <Route 
                path="/note/:id" 
                element={
                  <NoteContainer 
                    isMobile={isMobile}
                  />
                } 
              />
              <Route 
                path="/new" 
                element={
                  <NoteEditor 
                    isMobile={isMobile}
                  />
                } 
              />
            </Routes>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

// Create a wrapper component to handle the note view/edit mode
const NoteContainer = ({ isMobile }) => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <NoteEditor 
        noteId={id} 
        onSave={() => setIsEditing(false)} 
        isMobile={isMobile}
      />
    );
  }

  return (
    <NoteView 
      noteId={id} 
      onEditClick={() => setIsEditing(true)} 
      isMobile={isMobile}
    />
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
