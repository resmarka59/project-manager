import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    Typography, Button, Grid, Card, CardContent, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Avatar, LinearProgress, Paper, InputAdornment,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from '@mui/material';
import {
    Add, Search, Logout, FolderOpen, Assignment,
    CheckCircle, WarningAmber, ArrowForward, CalendarToday
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';


const PAGE_WIDTH = '1000px';

const DashboardPage = () => {
    const [projects, setProjects] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pRes, dRes] = await Promise.allSettled([
                api.get('/projects'),
                api.get('/tasks/due-soon')
            ]);
            if (pRes.status === 'fulfilled') setProjects(pRes.value.data);
            if (dRes.status === 'fulfilled') setDeadlines(dRes.value.data);
        } catch {
            console.error('Data load failed');
        }
    };

    const handleCreate = async () => {
        if (!newProject.title.trim()) return toast.warning('Title is required!');
        try {
            await api.post('/projects', newProject);
            toast.success('Project Created!');
            setOpen(false);
            setNewProject({ title: '', description: '' });
            loadData();
        } catch {
            toast.error('Error creating project');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const totalProjects = projects.length;
    const totalTasks = projects.reduce((a, p) => a + (p.totalTasks || 0), 0);
    const completedTasks = projects.reduce((a, p) => a + (p.completedTasks || 0), 0);

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#0f172a',
            backgroundImage: 'radial-gradient(at 50% 0%, #1e293b 0%, #0f172a 70%)'
        }}>

            {/*  navigation BAR  */}
            <Paper elevation={0} sx={{
                width: '100%',
                py: 2,
                bgcolor: 'rgba(15,23,42,.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,.1)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: PAGE_WIDTH,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#6366f1',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 800
                        }}>H</Box>
                        <Typography sx={{ color: '#fff', fontWeight: 800 }}>
                            Project<span style={{ color: '#6366f1' }}>Tracker</span>
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleLogout}
                        variant="outlined"
                        startIcon={<Logout />}
                        sx={{
                            color: '#ef4444',
                            borderColor: 'rgba(239,68,68,.3)',
                            '&:hover': { bgcolor: 'rgba(239,68,68,.1)' }
                        }}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Paper>

            {/* THE MAIN CONTENT */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 5, pb: 8 }}>
                <Box sx={{ width: '100%', maxWidth: PAGE_WIDTH, px: 3 }}>

                    {/* 1. STATS ROW */}
                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
                        <StatCard icon={<FolderOpen fontSize="large" />} label="Total Projects" value={totalProjects} color="#6366f1" />
                        <StatCard icon={<Assignment fontSize="large" />} label="Pending Tasks" value={totalTasks - completedTasks} color="#f59e0b" />
                        <StatCard icon={<CheckCircle fontSize="large" />} label="Completed" value={completedTasks} color="#10b981" />
                    </Grid>

                    {/* 2. ACTIVE PROJECTS */}
                    <Box sx={{ mb: 8 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ color: '#fff', fontWeight: 800 }} variant="h5">Active Projects</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setOpen(true)}
                                sx={{ bgcolor: '#6366f1', px: 3 }}
                            >
                                New Project
                            </Button>
                        </Box>

                        <TextField
                            fullWidth
                            placeholder="Search projects..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                                sx: { bgcolor: '#1e293b', borderRadius: 2, color: 'white' }
                            }}
                            sx={{ mb: 4, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }}
                        />

                        <Grid container spacing={3}>
                            {projects
                                .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((p) => (
                                    <Grid item xs={12} md={4} key={p.id}>
                                        <motion.div whileHover={{ y: -5 }}>
                                            <Card
                                                onClick={() => navigate(`/project/${p.id}`)}
                                                sx={{
                                                    bgcolor: '#1e293b',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    height: '100%'
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: 2 }}>
                                                            {p.title.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700 }}>
                                                            {Math.round(p.progressPercentage || 0)}%
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
                                                        {p.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2, height: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {p.description || "No description"}
                                                    </Typography>
                                                    <LinearProgress
                                                        value={p.progressPercentage || 0}
                                                        variant="determinate"
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 4,
                                                            bgcolor: 'rgba(255,255,255,0.1)',
                                                            '& .MuiLinearProgress-bar': { bgcolor: p.progressPercentage === 100 ? '#10b981' : '#6366f1' }
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                        </Grid>
                    </Box>

                    {/*UPCOMING DEADLINES*/}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography sx={{ color: '#fff', fontWeight: 800 }} variant="h5">Upcoming Deadlines</Typography>
                            <Box sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                                NEXT 7 DAYS
                            </Box>
                        </Box>

                        <Paper sx={{ bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            {deadlines.length === 0 ? (
                                <Box sx={{ p: 6, textAlign: 'center', color: '#94a3b8' }}>
                                    <CheckCircle sx={{ fontSize: 48, mb: 2, color: '#10b981' }} />
                                    <Typography variant="h6">All caught up!</Typography>
                                    <Typography>No urgent tasks for the week.</Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.3)' }}>
                                            <TableRow>
                                                <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>TASK</TableCell>
                                                <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>PROJECT</TableCell>
                                                <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>DUE DATE</TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {deadlines.map((task) => (
                                                <TableRow key={task.id} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                                    <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2.5, fontWeight: 600 }}>
                                                        {task.title}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <FolderOpen sx={{ fontSize: 16, color: '#6366f1' }} />
                                                            {task.project ? task.project.title : '...'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#f59e0b', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2.5, fontWeight: 600 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CalendarToday sx={{ fontSize: 16 }} />
                                                            {task.dueDate}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right', py: 2.5 }}>
                                                        <IconButton
                                                            onClick={() => {
                                                                if (task.project?.id) navigate(`/project/${task.project.id}`);
                                                                else toast.error("Project details missing");
                                                            }}
                                                            sx={{ color: '#64748b', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                                        >
                                                            <ArrowForward fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Box>

                </Box>
            </Box>


            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 2 } }}>
                <DialogTitle>New Project</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField
                            label="Title" fullWidth value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            InputLabelProps={{ style: { color: '#94a3b8' } }}
                            InputProps={{ sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                        />
                        <TextField
                            label="Description" fullWidth multiline rows={3} value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            InputLabelProps={{ style: { color: '#94a3b8' } }}
                            InputProps={{ sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained" sx={{ bgcolor: '#6366f1' }}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// -- STAT CARD
const StatCard = ({ icon, label, value, color }) => (
    <Grid item xs={12} sm="auto">
        <Card
            sx={{
                width: 260,
                border: '1px solid rgba(255,255,255,0.05)',
                bgcolor: '#1e293b',
                borderRadius: 3
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    textAlign: 'center'
                }}
            >
                <Box
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${color}20`,
                        color
                    }}
                >
                    {icon}
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
                    {value}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: 1
                    }}
                >
                    {label}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
);

export default DashboardPage;