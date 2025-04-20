import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Stack,
  Menu,
  MenuItem,
  Fade
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { deleteNote, setSearchQuery, setSelectedCategory } from '../store.js';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Settings from './Settings';

const MotionGrid = motion(Grid);

const getCategoryColor = (category) => {
  const colorMap = {
    'Personal': '#4caf50',
    'Work': '#2196f3',
    'Ideas': '#ff9800',
    'Tasks': '#f44336',
    'Learning': '#9c27b0',
    'Projects': '#3f51b5'
  };
  return colorMap[category] || '#757575';
};

const NoteListItem = ({ note, onDelete, onClick }) => {
  const theme = useTheme();
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        width: '100%',
        minHeight: '100px',
        background: theme.palette.mode === 'dark'
          ? 'rgba(45, 45, 45, 0.7)'
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
        mb: 1.5,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2]
        }
      }}
      onClick={() => onClick(note.id)}
    >
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1
        }}>
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.95rem',
              color: theme.palette.text.primary,
              lineHeight: 1.2,
              flex: 1,
              mr: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {note.title || 'Untitled'}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            <Chip
              label={note.category}
              size="small"
              sx={{
                height: '18px',
                fontSize: '0.7rem',
                backgroundColor: `${getCategoryColor(note.category)}15`,
                color: getCategoryColor(note.category),
                border: 'none',
                fontWeight: 500
              }}
            />
          </Stack>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            color: theme.palette.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            mb: 1,
            height: '1.4em'
          }}
        >
          {note.content.split(' ').slice(0, 4).join(' ') + (note.content.split(' ').length > 4 ? '...' : '')}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography
            variant="caption"
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: '0.7rem'
            }}
          >
            {new Date(note.updatedAt).toLocaleDateString()}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            sx={{ 
              padding: 0.3,
              color: theme.palette.text.secondary,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                color: theme.palette.error.main
              }
            }}
          >
            <DeleteIcon sx={{ fontSize: '0.9rem' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

const NoteCard = ({ note, onDelete, onClick, index }) => {
  const theme = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <MotionGrid
      item
      xs={12}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '800px',
          height: '150px',
          maxHeight: '150px',
          minHeight: '150px',
          display: 'flex',
          flexDirection: 'row',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.08)',
          borderRadius: 2,
          mb: 2,
          overflow: 'hidden',
          flex: '0 0 auto',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4]
          }
        }}
        onClick={() => onClick(note.id)}
      >
        <CardContent 
          sx={{ 
            width: '100%',
            maxWidth: '100%',
            p: 2.5,
            '&:last-child': { pb: 2.5 },
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            alignItems: 'flex-start',
            height: '100%',
            overflow: 'hidden',
            flex: '0 0 auto'
          }}
        >
          <Box 
            sx={{ 
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Typography 
              variant="h6"
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}
            >
              {note.title || 'Untitled'}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5em',
                height: '3em',
                fontSize: '0.9rem',
                color: theme.palette.text.secondary,
                mb: 'auto'
              }}
            >
              {note.content}
            </Typography>

            <Typography
              variant="caption"
              sx={{ 
                fontSize: '0.75rem',
                color: theme.palette.text.secondary,
                mt: 'auto'
              }}
            >
              {new Date(note.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'flex-end',
              minWidth: 'fit-content'
            }}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                label={note.category}
                size="small"
                variant="outlined"
                sx={{
                  height: 24,
                  borderColor: getCategoryColor(note.category),
                  color: getCategoryColor(note.category)
                }}
              />
              {note.subject && (
                <Chip
                  label={note.subject}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 24,
                    borderColor: '#9c27b0',
                    color: '#9c27b0'
                  }}
                />
              )}
            </Stack>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              sx={{ 
                opacity: 0,
                transition: 'opacity 0.2s',
                '.MuiCard-root:hover &': {
                  opacity: 1
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </MotionGrid>
  );
};

const NotesList = ({ compact }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const allNotes = useSelector((state) => state.notes.notes);
  const categories = useSelector((state) => state.notes.categories);
  const searchQuery = useSelector((state) => state.ui.searchQuery);
  const selectedCategory = useSelector((state) => state.ui.selectedCategory);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const filteredNotes = allNotes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      note.category === selectedCategory;
    
    const matchesArchiveStatus = showArchived ? note.archived : !note.archived;
    
    return matchesSearch && matchesCategory && matchesArchiveStatus;
  });

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleArchiveToggle = () => {
    setShowArchived(!showArchived);
    handleFilterClose();
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const handleDeleteNote = (noteId) => {
    dispatch(deleteNote(noteId));
  };
  
  const handleNewNote = () => {
    navigate('/new');
  };
  
  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 1) 0%, rgba(30, 30, 30, 1) 100%)'
            : 'linear-gradient(135deg, rgba(245, 245, 245, 1) 0%, rgba(255, 255, 255, 1) 100%)',
          overflow: 'hidden'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            p: 0
          }} 
          disableGutters
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: isMobile ? 1.5 : 2,
              mx: isMobile ? 1 : 3,
              mt: 2,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.25) 0%, rgba(40, 40, 40, 0.25) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(250, 250, 250, 0.25) 100%)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(255, 255, 255, 0.15)',
              borderRadius: isMobile ? 3 : 4,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 12px 48px 0 rgba(0, 0, 0, 0.4)'
                : '0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 12px 48px 0 rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: 2,
              zIndex: 1200,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 12px 48px 0 rgba(0, 0, 0, 0.4), 0 16px 64px 0 rgba(0, 0, 0, 0.5)'
                  : '0 12px 48px 0 rgba(0, 0, 0, 0.15), 0 16px 64px 0 rgba(0, 0, 0, 0.15)',
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.3) 0%, rgba(40, 40, 40, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(250, 250, 250, 0.3) 100%)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: isMobile ? 1 : 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  component={motion.h4}
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: isMobile ? 'center' : 'left',
                    letterSpacing: '0.5px'
                  }}
                >
                  My Notes
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Filter">
                  <IconButton
                    onClick={handleFilterClick}
                    sx={{ 
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.05)',
                      backdropFilter: 'blur(5px)',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.08)',
                      }
                    }}
                  >
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add New Note">
                  <IconButton
                    onClick={handleNewNote}
                    sx={{ 
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.05)',
                      backdropFilter: 'blur(5px)',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.08)',
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  sx={{ 
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(5px)',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleArchiveToggle}>
                <ListItemText 
                  primary="Show Archived Notes" 
                  secondary={showArchived ? '(Currently showing archived notes)' : ''}
                />
              </MenuItem>
            </Menu>
            
            <Box sx={{ mb: isMobile ? 1 : 2 }}>
              <TextField
                fullWidth
                size={isMobile ? "small" : "medium"}
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                    '&.Mui-focused': {
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 0 0 2px rgba(33, 150, 243, 0.5)'
                        : '0 0 0 2px rgba(33, 150, 243, 0.25)',
                    }
                  }
                }}
              />
            </Box>

            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: 2,
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Chip
                label="All"
                onClick={() => dispatch(setSelectedCategory('all'))}
                sx={{
                  background: selectedCategory === 'all'
                    ? theme.palette.primary.main
                    : 'transparent',
                  color: selectedCategory === 'all'
                    ? '#fff'
                    : 'text.primary',
                  borderColor: theme.palette.primary.main,
                  border: '1px solid',
                  '&:hover': {
                    background: `${theme.palette.primary.main}20`,
                  }
                }}
              />
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => dispatch(setSelectedCategory(category))}
                  sx={{
                    background: selectedCategory === category
                      ? getCategoryColor(category)
                      : 'transparent',
                    color: selectedCategory === category
                      ? '#fff'
                      : 'text.primary',
                    borderColor: getCategoryColor(category),
                    border: '1px solid',
                    '&:hover': {
                      background: `${getCategoryColor(category)}20`,
                    }
                  }}
                />
              ))}
            </Stack>
            
            {filteredNotes.length > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mt: 0.5,
                  textAlign: isMobile ? 'center' : 'left',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontStyle: 'italic',
                  opacity: 0.8
                }}
              >
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
              </Typography>
            )}
          </Paper>
          
          <Box 
            sx={{ 
              flex: 1,
              overflowY: 'auto',
              pt: 2,
              px: isMobile ? 1 : 3,
              pb: isMobile ? 8 : 3,
              '::-webkit-scrollbar': {
                display: 'none'
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {filteredNotes.length === 0 ? (
              <Box 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '50vh',
                  p: 3,
                  gap: 2
                }}
              >
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  color="text.secondary" 
                  sx={{ 
                    textAlign: 'center', 
                    fontStyle: 'italic',
                    maxWidth: isMobile ? '100%' : '70%',
                    opacity: 0.8
                  }}
                >
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No notes match your search criteria' 
                    : 'No notes yet'}
                </Typography>
                {!searchQuery && selectedCategory === 'all' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleNewNote}
                    sx={{
                      mt: 1,
                      borderRadius: 3,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Add Note
                  </Button>
                )}
              </Box>
            ) : (
              isMobile ? (
                <Box sx={{ width: '100%' }}>
                  {Object.entries(
                    filteredNotes.reduce((acc, note) => {
                      const category = note.category || 'Uncategorized';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(note);
                      return acc;
                    }, {})
                  ).map(([category, notes]) => (
                    <Box 
                      key={category}
                      component={motion.div}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      sx={{ mb: 3 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 2,
                          mb: 1.5
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getCategoryColor(category)
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: theme => theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.7)'
                          }}
                        >
                          {category}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            ml: 'auto',
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                        </Typography>
                      </Box>

                      <Stack spacing={1.5} sx={{ px: 2 }}>
                        {notes.map((note) => (
                          <NoteListItem
                            key={note.id}
                            note={note}
                            onClick={handleNoteClick}
                            onDelete={handleDeleteNote}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Grid 
                  container 
                  spacing={3}
                  sx={{
                    p: 3,
                    '& .MuiGrid-item': {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%'
                    }
                  }}
                >
                  {Object.entries(
                    filteredNotes.reduce((acc, note) => {
                      const category = note.category || 'Uncategorized';
                      const subject = note.subject || 'General';
                      
                      if (!acc[category]) {
                        acc[category] = {};
                      }
                      if (!acc[category][subject]) {
                        acc[category][subject] = [];
                      }
                      acc[category][subject].push(note);
                      return acc;
                    }, {})
                  ).map(([category, subjects]) => (
                    <Grid item xs={12} key={category}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 3, 
                          mt: 3,
                          fontWeight: 600,
                          color: getCategoryColor(category),
                          borderBottom: `2px solid ${getCategoryColor(category)}20`,
                          pb: 1
                        }}
                      >
                        {category}
                      </Typography>
                      
                      {Object.entries(subjects).map(([subject, notes]) => (
                        <Box key={`${category}-${subject}`} sx={{ mb: 4 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 2,
                              fontWeight: 500,
                              color: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.7)'
                                : 'rgba(0, 0, 0, 0.7)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: getCategoryColor(category)
                              }} 
                            />
                            {subject}
                          </Typography>
                          
                          <Grid container spacing={2}>
                            {notes.map((note, index) => (
                              <Grid item xs={12} key={note.id}>
                                <NoteCard
                                  note={note}
                                  onClick={handleNoteClick}
                                  onDelete={handleDeleteNote}
                                  index={index}
                                  compact={compact}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              )
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotesList;