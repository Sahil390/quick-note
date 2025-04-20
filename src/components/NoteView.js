import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Container,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { deleteNote, setFullscreen, resetFullscreen } from '../store';

const NoteView = ({ noteId, onEditClick, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFullscreen = useSelector(state => state.ui.isFullscreen);

  const note = useSelector(state => 
    state.notes.notes.find(n => n.id === noteId)
  );

  useEffect(() => {
    // Reset on mount
    dispatch(resetFullscreen());
    
    // Reset on unmount
    return () => {
      dispatch(resetFullscreen());
    };
  }, [dispatch]);

  if (!note) {
    navigate('/');
    return null;
  }

  const handleDelete = () => {
    dispatch(deleteNote(note.id));
    navigate('/');
  };

  const handleToggleFullscreen = () => {
    dispatch(setFullscreen(!isFullscreen));
  };

  const handleBack = () => {
    dispatch(resetFullscreen());
    navigate('/');
  };

  return (
    <Container maxWidth={isFullscreen ? 'lg' : 'xl'} sx={{ height: '100vh', py: 2 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        elevation={0}
        sx={{
          height: '100%',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: isMobile ? 2 : 3,
            borderBottom: '1px solid',
            borderColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Stack direction="row" spacing={1}>
              {note.category && (
                <Chip 
                  label={note.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {note.subject && (
                <Chip
                  label={note.subject}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Note">
              <IconButton onClick={onEditClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            {!isMobile && (
              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton onClick={handleToggleFullscreen}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete Note">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: isMobile ? 2 : 3, flex: 1, overflowY: 'auto' }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            {note.title}
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              color: theme.palette.text.secondary
            }}
          >
            {note.content}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 4,
              color: theme.palette.text.secondary,
              fontStyle: 'italic'
            }}
          >
            Last updated: {new Date(note.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default NoteView;