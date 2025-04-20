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
          width: isMobile ? '100%' : 320,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderLeft: '1px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box sx={{ 
        p: 2.5,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.08)',
      }}>
        <Typography variant="h6" component="div" sx={{ 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: theme.palette.text.primary,
        }}>
          <SettingsIcon sx={{ fontSize: 20 }} />
          Settings
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <List sx={{ p: 2 }}>
        <ListItem sx={{ 
          px: 2,
          py: 1.5,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.03)',
          borderRadius: 2,
          mb: 2
        }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DarkModeIcon sx={{ 
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.7)'
            }} />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Theme Settings
              </Typography>
            }
            secondary={
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Customize your app appearance
              </Typography>
            }
          />
        </ListItem>
        
        <Box sx={{ px: 2, py: 1 }}>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
            <FormLabel component="legend" sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              mb: 1.5,
              color: theme.palette.text.primary
            }}>
              Theme Mode
            </FormLabel>
            <RadioGroup
              value={themeMode}
              onChange={handleThemeModeChange}
            >
              <FormControlLabel 
                value="manual" 
                control={
                  <Radio 
                    size="small"
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                } 
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    py: 0.5
                  }}>
                    <Brightness4Icon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">Manual</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="system" 
                control={
                  <Radio 
                    size="small"
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                } 
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    py: 0.5
                  }}>
                    <ComputerIcon sx={{ fontSize: 18 }} />
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
                disabled={themeMode === 'system'}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.primary.main
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Dark Mode
              </Typography>
            }
          />
          
          {themeMode === 'system' && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                mt: 1,
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              Using system preference: {prefersDarkMode ? 'Dark' : 'Light'}
            </Typography>
          )}
        </Box>

        <Divider sx={{ 
          my: 3,
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.08)'
        }} />
      </List>
    </Drawer>
  );
};

export default Settings;