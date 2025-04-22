import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Stack,
  useTheme,
  Container,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
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
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Update the ContentViewer component to handle cleanup
const ContentViewer = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Update content when it changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <Box
      sx={{
        '& .ProseMirror': {
          '& h1': {
            fontSize: '2rem',
            fontWeight: 600,
            mb: 2,
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 600,
            mb: 2,
          },
          '& p': {
            mb: 2,
            lineHeight: 1.8,
          },
          '& ul, & ol': {
            pl: 3,
            mb: 2,
          },
          '& blockquote': {
            borderLeft: 3,
            borderColor: 'primary.main',
            pl: 2,
            ml: 0,
            color: 'text.secondary',
            my: 2,
          },
          '& pre': {
            backgroundColor: 'action.hover',
            p: 2,
            borderRadius: 1,
            mb: 2,
            overflow: 'auto',
          },
          '& code': {
            fontFamily: 'monospace',
            backgroundColor: 'action.hover',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
          },
          '& strong': {
            fontWeight: 600,
          },
        },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

// Update the main NoteView component to handle note changes
const NoteView = ({ noteId, onEditClick, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFullscreen = useSelector(state => state.ui.isFullscreen);
  const contentRef = useRef(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteNote(note.id));
    setDeleteDialogOpen(false);
    navigate('/');
  };

  const handleToggleFullscreen = () => {
    dispatch(setFullscreen(!isFullscreen));
  };

  const handleBack = () => {
    dispatch(resetFullscreen());
    navigate('/');
  };

  // Add key prop to force remount of ContentViewer
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
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            alignItems: 'center'
          }}>
            <Tooltip title="Edit Note">
              <IconButton 
                onClick={onEditClick}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                }}
              >
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
              <IconButton 
                onClick={handleDelete}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content */}
        <Box 
          ref={contentRef}
          sx={{ p: isMobile ? 2 : 3, flex: 1, overflowY: 'auto' }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(0, 0, 0, 0.95)'
            }}
          >
            {note.title}
          </Typography>
          
          {/* Add key prop to force remount */}
          <ContentViewer 
            key={note.id} 
            content={note.content} 
          />

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 4,
              color: 'text.secondary',
              fontStyle: 'italic',
              opacity: 0.8
            }}
          >
            Last updated: {new Date(note.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle id="delete-dialog-title">
          Delete Note
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NoteView;