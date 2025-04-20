import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  IconButton,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Note as NoteIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { deleteNote, setSearchQuery, setSelectedCategory, toggleDarkMode } from '../store.js';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);
  const categories = useSelector((state) => state.notes.categories);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const selectedCategory = useSelector((state) => state.ui.selectedCategory);

  const handleNewNote = () => {
    navigate('/new');
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    dispatch(deleteNote(noteId));
    navigate('/');
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleCategoryChange = (event) => {
    dispatch(setSelectedCategory(event.target.value));
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Quick Note
        </Typography>
        <IconButton color="primary" onClick={handleNewNote}>
          <AddIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search notes..."
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          onChange={handleSearchChange}
        />
      </Box>
      
      <Box sx={{ p: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={handleDarkModeToggle}
              icon={<DarkModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label="Dark Mode"
        />
      </Box>
      
      <Divider />
      
      <List sx={{ overflow: 'auto' }}>
        {notes.map((note) => (
          <ListItem
            key={note.id}
            disablePadding
            secondaryAction={
              <IconButton edge="end" onClick={(e) => handleDeleteNote(e, note.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => handleNoteClick(note.id)}>
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
              <ListItemText
                primary={note.title}
                secondary={
                  <>
                    {note.category}
                    <br />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </>
                }
                primaryTypographyProps={{
                  noWrap: true,
                  style: { maxWidth: '150px' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;