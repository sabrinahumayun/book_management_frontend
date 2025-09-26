'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';

interface DarkModeToggleProps {
  size?: 'small' | 'medium' | 'large';
  sx?: any;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ size = 'medium', sx }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleDarkMode}
        size={size}
        sx={{
          color: 'text.primary',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'scale(1.1)',
          },
          ...sx,
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
