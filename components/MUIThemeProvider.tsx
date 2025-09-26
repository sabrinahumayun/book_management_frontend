'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';

interface MUIThemeProviderProps {
  children: ReactNode;
}

function MUIThemeProviderInner({ children }: MUIThemeProviderProps) {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  return (
    <CustomThemeProvider>
      <MUIThemeProviderInner>
        {children}
      </MUIThemeProviderInner>
    </CustomThemeProvider>
  );
}
