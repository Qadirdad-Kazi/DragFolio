import React, { createContext, useContext, ReactNode } from 'react';
import { PortfolioTheme } from '@/types';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

interface ThemeContextType {
  theme: PortfolioTheme;
  updateTheme: (theme: Partial<PortfolioTheme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: PortfolioTheme;
  onThemeChange?: (theme: PortfolioTheme) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme,
  onThemeChange 
}) => {
  const [theme, setTheme] = React.useState<PortfolioTheme>(initialTheme);

  // Update theme when initialTheme changes (from parent component)
  React.useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  const updateTheme = (newTheme: Partial<PortfolioTheme>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setTheme(updatedTheme);
    if (onThemeChange) {
      onThemeChange(updatedTheme);
    }
  };

  // Create MUI theme based on our custom theme
  const muiTheme = createTheme({
    palette: {
      mode: theme.mode,
      primary: {
        main: theme.primaryColor,
      },
      secondary: {
        main: theme.secondaryColor,
      },
      text: {
        primary: theme.headingColor || (theme.mode === 'dark' ? '#ffffff' : '#000000'),
        secondary: theme.paragraphColor || (theme.mode === 'dark' ? '#cccccc' : '#333333'),
      },
      background: {
        default: theme.mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: theme.mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: theme.fontFamily,
      fontSize: parseInt(theme.fontSize, 10),
      h1: {
        fontFamily: theme.headingFontFamily || theme.fontFamily,
        fontWeight: theme.headingFontWeight || 'bold',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      h2: {
        fontFamily: theme.headingFontFamily || theme.fontFamily,
        fontWeight: theme.headingFontWeight || 'bold',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      h3: {
        fontFamily: theme.headingFontFamily || theme.fontFamily,
        fontWeight: theme.headingFontWeight || 'bold',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      h4: {
        fontFamily: theme.headingFontFamily || theme.fontFamily,
        fontWeight: theme.headingFontWeight || 'bold',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      h5: {
        fontFamily: theme.headingFontFamily || theme.fontFamily,
        fontWeight: theme.headingFontWeight || 'bold',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      h6: {
        fontFamily: theme.headingFontFamily || theme.fontFamily,
        fontWeight: theme.headingFontWeight || 'bold',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      body1: {
        lineHeight: theme.lineHeight || '1.5',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
      body2: {
        lineHeight: theme.lineHeight || '1.5',
        letterSpacing: theme.letterSpacing || '0',
        textTransform: theme.textTransform || 'none' as any,
      },
    },
    shape: {
      borderRadius: parseInt(theme.borderRadius || '4', 10),
    },
    spacing: theme.spacing === 'compact' ? 4 : theme.spacing === 'spacious' ? 12 : 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: (theme.textTransform || 'none') as 'none' | 'capitalize' | 'uppercase' | 'lowercase',
            fontFamily: theme.fontFamily,
            borderRadius: theme.borderRadius || '4px',
          },
          contained: {
            backgroundColor: theme.primaryColor,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: theme.primaryColor,
              opacity: 0.9,
            },
          },
          outlined: {
            borderColor: theme.primaryColor,
            color: theme.primaryColor,
            '&:hover': {
              borderColor: theme.primaryColor,
              backgroundColor: `${theme.primaryColor}10`,
            },
          },
          text: {
            color: theme.primaryColor,
            '&:hover': {
              backgroundColor: `${theme.primaryColor}10`,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: theme.linkColor || theme.primaryColor,
            textDecoration: 'underline',
            '&:hover': {
              opacity: 0.8,
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontSize: theme.fontSize,
            fontFamily: theme.fontFamily,
            backgroundColor: theme.mode === 'dark' ? '#121212' : '#f5f5f5',
            color: theme.mode === 'dark' ? '#ffffff' : '#121212',
          },
          '.portfolio-content': {
            color: theme.mode === 'dark' ? '#ffffff' : '#121212',
            backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
          '.portfolio-section': {
            borderRadius: theme.borderRadius,
            transition: 'all 0.3s ease',
          },
          // Apply primary color to various elements
          '.text-primary': {
            color: theme.primaryColor + ' !important',
          },
          '.bg-primary': {
            backgroundColor: theme.primaryColor + ' !important',
          },
          '.border-primary': {
            borderColor: theme.primaryColor + ' !important',
          },
          // Apply secondary color to various elements
          '.text-secondary': {
            color: theme.secondaryColor + ' !important',
          },
          '.bg-secondary': {
            backgroundColor: theme.secondaryColor + ' !important',
          },
          '.border-secondary': {
            borderColor: theme.secondaryColor + ' !important',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
