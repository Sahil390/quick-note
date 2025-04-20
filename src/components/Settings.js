import React, { useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  Close as CloseIcon,
  Computer as ComputerIcon,
  Brightness4 as Brightness4Icon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, setThemeMode } from '../store.js';

const Settings = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  
  const darkMode = useSelector((state) => state.ui.darkMode);
  const themeMode = useSelector((state) => state.ui.themeMode);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Apply system theme when themeMode is 'system'
  useEffect(() => {
    if (themeMode === 'system' && darkMode !== prefersDarkMode) {
      dispatch(setDarkMode(prefersDarkMode));
    }
  }, [themeMode, prefersDarkMode, darkMode, dispatch]);

  const handleDarkModeToggle = () => {
    dispatch(setDarkMode(!darkMode));
  };

  const handleThemeModeChange = (event) => {
    dispatch(setThemeMode(event.target.value));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h6" component="div" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SettingsIcon />
          Settings
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        <ListItem>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Theme Settings" 
            secondary="Customize your app appearance"
          />
        </ListItem>
        
        <Box sx={{ px: 2, py: 1 }}>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
            <FormLabel component="legend">Theme Mode</FormLabel>
            <RadioGroup
              value={themeMode}
              onChange={handleThemeModeChange}
            >
              <FormControlLabel 
                value="manual" 
                control={<Radio size="small" />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Brightness4Icon fontSize="small" />
                    <Typography variant="body2">Manual</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="system" 
                control={<Radio size="small" />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ComputerIcon fontSize="small" />
                    <Typography variant="body2">System</Typography>
                  </Box>
                } 
              />
            </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleDarkModeToggle}
                color="primary"
                disabled={themeMode === 'system'}
              />
            }
            label="Dark Mode"
          />
          {themeMode === 'system' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Using system preference: {prefersDarkMode ? 'Dark' : 'Light'}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Add more settings sections here */}
      </List>
    </Drawer>
  );
};

export default Settings;