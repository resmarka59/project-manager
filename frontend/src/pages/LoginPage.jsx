import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, TextField, Button, Typography, Box, Alert, Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log("Submitting:", isLogin ? "Login" : "Register", formData);

        if (!isLogin) {
            if (formData.password.length < 6) {
                return setError("Password is too weak! It must be at least 6 characters.");
            }

            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (!specialCharRegex.test(formData.password)) {
                return setError("Weak password! Please include a special character (e.g. @, #, $).");
            }
        }

        try {
            if (isLogin) {

                const res = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password

                });
                localStorage.setItem('token', res.data.token);
                window.location.href = '/dashboard';
            } else {
                await api.post('/auth/register', formData);

                toast.success('Registration Successful! Please login.');
                setIsLogin(true);

                setFormData({ fullName: '', email: '', password: '' });
            }
        } catch (err) {
            console.error("Auth Error:", err);


            if (!isLogin) {

                setError("This email is already in use. Will you log in instead?");
            } else {
                // Login failed
                setError('Authentication failed. Please check your credentials.');
            }
        }
    };


    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover fieldset': { borderColor: '#6366f1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
            '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px #1e293b inset',
                WebkitTextFillColor: '#fff',
                caretColor: '#fff',
                borderRadius: 'inherit'
            }
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: '#0f172a',
            backgroundImage: 'radial-gradient(at 50% 0%, #1e293b 0%, #0f172a 70%)'
        }}>
            <Container component="main" maxWidth="xs">
                <Paper elevation={24} sx={{
                    p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4,
                    bgcolor: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Avatar sx={{ m: 1, bgcolor: '#6366f1', width: 56, height: 56, mb: 2, boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}>
                        <LockOutlinedIcon fontSize="large" />
                    </Avatar>

                    <Typography component="h1" variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                        {isLogin ? 'Enter your credentials to access your workspace.' : 'Create your enterprise account.'}
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        {!isLogin && (
                            <TextField
                                margin="normal" required fullWidth label="Full Name" name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                InputLabelProps={{ style: { color: '#94a3b8' } }}
                                InputProps={{ style: { color: '#fff' } }}
                                sx={inputStyles}
                            />
                        )}
                        <TextField
                            margin="normal" required fullWidth label="Email Address" name="email" type="email"
                            value={formData.email}
                            onChange={handleChange}
                            InputLabelProps={{ style: { color: '#94a3b8' } }}
                            InputProps={{ style: { color: '#fff' } }}
                            sx={inputStyles}
                        />
                        <TextField
                            margin="normal" required fullWidth label="Password" name="password" type="password"
                            value={formData.password}
                            onChange={handleChange}
                            InputLabelProps={{ style: { color: '#94a3b8' } }}
                            InputProps={{ style: { color: '#fff' } }}
                            sx={inputStyles}
                        />

                        <Button type="submit" fullWidth variant="contained" size="large"
                                sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>

                        <Button fullWidth onClick={() => { setIsLogin(!isLogin); setError(''); }} sx={{ color: '#94a3b8' }}>
                            {isLogin ? "No account? Sign Up" : "Have an account? Sign In"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;