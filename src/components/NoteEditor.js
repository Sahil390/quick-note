import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Paper,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Tooltip,
  Container,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addNote, updateNote, addTag, setFullscreen, resetFullscreen, addSubject, removeSubject } from '../store.js';
import { motion, AnimatePresence } from 'framer-motion'; // Update this line to include AnimatePresence
import RichTextEditor from './RichTextEditor';

const MotionChip = motion(Chip);

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);
  const categories = useSelector((state) => state.notes.categories);
  const subjects = useSelector((state) => state.notes.subjects);
  const isFullscreen = useSelector((state) => state.ui.isFullscreen);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [subject, setSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    dispatch(resetFullscreen());
    
    if (id && id !== 'new') {
      const note = notes.find((n) => n.id === id);
      if (note) {
        setTitle(note.title || '');
        setContent(note.content || ''); // Make sure to handle empty content
        setCategory(note.category || 'Personal');
        setTags(note.tags || []);
        setSubject(note.subject || '');
      }
    } else {
      // Reset form for new notes
      setTitle('');
      setContent('');
      setCategory('Personal');
      setTags([]);
      setSubject('');
    }
  }, [id, notes, dispatch]);

  useEffect(() => {
    // Reset on mount
    dispatch(resetFullscreen());
    
    // Reset on unmount
    return () => {
      dispatch(resetFullscreen());
    };
  }, [dispatch]);

  const handleSave = async () => {
    setIsSaving(true);
    const noteData = {
      title,
      content: content || '', // Ensure content is never undefined
      category,
      tags,
      subject,
      updatedAt: new Date().toISOString()
    };

    if (id && id !== 'new') {
      dispatch(updateNote({ id, ...noteData }));
    } else {
      dispatch(addNote(noteData));
    }

    setTimeout(() => {
      setIsSaving(false);
      navigate('/');
    }, 500);
  };

  const handleBack = () => {
    // Reset fullscreen state before navigating away
    dispatch(resetFullscreen());
    navigate('/');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      dispatch(addTag(newTag.trim()));
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleFullscreenToggle = () => {
    dispatch(setFullscreen(!isFullscreen));
  };

  const handleAddNewSubject = () => {
    if (newSubject.trim()) {
      dispatch(addSubject(newSubject.trim()));
      setSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    dispatch(removeSubject(subjectToRemove));
    if (subject === subjectToRemove) {
      setSubject('');
    }
  };

  return (
    <Container 
      maxWidth={isFullscreen ? 'lg' : 'xl'} 
      sx={{ 
        height: '100vh', 
        py: 2,
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300
        })
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 30,
            duration: 0.2
          }
        }}
        elevation={0}
        sx={{
          height: '100%',
          background: theme => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: theme => theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: theme => theme.transitions.create(
            ['border-radius', 'background', 'transform', 'box-shadow'],
            { duration: theme.transitions.duration.shorter }
          )
        }}
      >
        <AppBar 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              duration: 0.2
            }
          }}
          position="static" 
          color="default" 
          elevation={1}
          sx={{
            background: theme => theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid',
            borderColor: theme => theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
            transition: theme => theme.transitions.create(
              ['background-color', 'border-color'],
              { duration: theme.transitions.duration.shorter }
            )
          }}
        >
          <Toolbar>
            <Tooltip title="Back to notes">
              <IconButton 
                edge="start" 
                onClick={handleBack} 
                sx={{ 
                  mr: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography 
              variant="h6" 
              component={motion.div}
              initial={{ x: -10, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  duration: 0.2
                }
              }}
              sx={{ flexGrow: 1 }}
            >
              {id === 'new' ? 'New Note' : 'Edit Note'}
            </Typography>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={handleFullscreenToggle}
                sx={{ mr: 1 }}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Save note">
              <IconButton 
                color="primary" 
                onClick={handleSave}
                disabled={isSaving}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box 
          sx={{ 
            p: 3, 
            flexGrow: 1, 
            overflow: 'auto',
            height: isFullscreen ? 'calc(100vh - 64px)' : '100%'  // 64px is AppBar height
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiInput-root': {
                fontSize: '2rem',
                fontWeight: 600
              }
            }}
          />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subject}
                label="Subject"
                onChange={(e) => setSubject(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {subjects.map((sub) => (
                  <MenuItem 
                    key={sub} 
                    value={sub}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {sub}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSubject(sub);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%', p: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add new subject"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNewSubject();
                        }
                      }}
                      fullWidth
                    />
                    <IconButton
                      size="small"
                      onClick={handleAddNewSubject}
                      disabled={!newSubject.trim()}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <AnimatePresence>
                {tags.map((tag) => (
                  <MotionChip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        duration: 0.15
                      }
                    }}
                    exit={{ 
                      scale: 0, 
                      opacity: 0,
                      transition: {
                        duration: 0.15
                      }
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: {
                        duration: 0.15
                      }
                    }}
                    sx={{ 
                      borderRadius: 1,
                      '& .MuiChip-label': {
                        fontWeight: 500
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            </Stack>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
              <Tooltip title="Add tag">
                <IconButton 
                  size="small" 
                  onClick={handleAddTag} 
                  disabled={!newTag.trim()}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <RichTextEditor 
              content={content}
              onChange={setContent}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NoteEditor;