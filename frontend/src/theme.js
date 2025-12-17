import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#10b981',
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b',
        },
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: { fontWeight: 800, letterSpacing: '-0.02em' },
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600, borderRadius: '8px' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0f172a',
                    backgroundImage: 'radial-gradient(at 50% 0%, #1e293b 0%, #0f172a 70%)',
                    minHeight: '100vh',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                }
            }
        }
    },
});

export default theme;