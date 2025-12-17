import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* gray background */}
            <ToastContainer position="top-right" autoClose={3000} />
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/project/:id"
                        element={isAuthenticated ? <ProjectDetailsPage /> : <Navigate to="/login" />}
                    />
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;