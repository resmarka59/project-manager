import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Box, Typography, Button, TextField, LinearProgress, Chip, IconButton, Container, Paper, Dialog,
    DialogTitle, DialogContent, DialogActions, DialogContentText, Stack, Divider
} from '@mui/material';
import {
    Add, ArrowBack, Delete, CheckCircle, RadioButtonUnchecked,
    Edit, WarningAmber, CalendarToday, Assignment
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // --- STATE FOR MODALS ---
    const [openEditProject, setOpenEditProject] = useState(false);
    const [openDeleteProject, setOpenDeleteProject] = useState(false);
    const [openDeleteTask, setOpenDeleteTask] = useState(false);

    // Temp storage
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const pRes = await api.get(`/projects/${id}`);
            const tRes = await api.get(`/tasks/project/${id}`);
            setProject(pRes.data);
            setEditData({ title: pRes.data.title, description: pRes.data.description });
            setTasks(tRes.data);
        } catch (err) {
            console.error("Failed to load project details", err);
            toast.error("Could not load project.");
        }
    };

    // --- PROJECT ACTIONS ---
    const handleUpdateProject = async () => {
        try {
            await api.put(`/projects/${id}`, editData);
            setProject({ ...project, ...editData });
            setOpenEditProject(false);
            toast.success("Project updated successfully!");
        } catch (err) {
            toast.error("Failed to update project.");
        }
    };

    const handleDeleteProject = async () => {
        try {
            await api.delete(`/projects/${id}`);
            toast.success("Project deleted.");
            navigate('/dashboard');
        } catch (err) {
            toast.error("Failed to delete project.");
        }
    };

    // --- TASK ACTIONS ---
    const handleAddTask = async (e) => {
        if(e) e.preventDefault(); // Prevent page refresh if form submitted
        if (!newTaskTitle.trim()) return toast.warning("Please enter a task name.");

        try {
            console.log("Adding task:", newTaskTitle);
            const res = await api.post(`/tasks/project/${id}`, {
                title: newTaskTitle,
                dueDate: new Date().toISOString().split('T')[0], // Default: Today
                status: 'PENDING'
            });
            setTasks([...tasks, res.data]);
            setNewTaskTitle('');
            toast.success("Task added!");
        } catch (err) {
            console.error("Add Task Error:", err);
            toast.error("Error adding task.");
        }
    };

    const confirmDeleteTask = (taskId) => {
        setTaskToDelete(taskId);
        setOpenDeleteTask(true);
    };

    const executeDeleteTask = async () => {
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            setOpenDeleteTask(false);
            toast.success("Task deleted.");
        } catch (err) {
            toast.error("Error deleting task.");
        }
    };

    const toggleTask = async (task) => {
        try {
            const res = await api.patch(`/tasks/${task.id}/complete`);
            setTasks(tasks.map(t => (t.id === task.id ? res.data : t)));
        } catch (err) {
            console.error("Error updating task");
        }
    };

    if (!project) return <LinearProgress sx={{ bgcolor: '#0f172a' }} />;

    const progress = tasks.length > 0
        ? (tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100
        : 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', p: 4 }}>
            <Container maxWidth="md">

                {/* BACK BUTTON */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ color: '#94a3b8', mb: 3, '&:hover': { color: '#fff' } }}
                >
                    Back to Dashboard
                </Button>

                {/* PROJECT HEADER */}
                <Paper sx={{
                    p: 4, mb: 4, borderRadius: 4,
                    bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                                {project.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                                {project.description}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => setOpenEditProject(true)} sx={{ color: '#6366f1', mr: 1 }}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => setOpenDeleteProject(true)} sx={{ color: '#ef4444' }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                flexGrow: 1, height: 8, borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': { bgcolor: '#10b981' }
                            }}
                        />
                        <Typography sx={{ color: '#10b981', fontWeight: 700 }}>{Math.round(progress)}%</Typography>
                    </Box>
                </Paper>

                {/* ADD TASK SECTION (MATCHING STYLE) */}
                <Paper component="form" onSubmit={handleAddTask} sx={{
                    display: 'flex', alignItems: 'center', p: 2, mb: 4,
                    bgcolor: '#1e293b', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <TextField
                        fullWidth
                        placeholder="Type a new task and press Enter..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: { color: 'white', fontSize: '1rem', px: 2 }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ bgcolor: '#6366f1', px: 3, borderRadius: 2, boxShadow: '0 0 10px rgba(99,102,241,0.3)' }}
                    >
                        <Add /> Add
                    </Button>
                </Paper>

                {/* TASK LIST (MATCHING DASHBOARD STYLE) */}
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Tasks ({tasks.length})</Typography>

                <Paper sx={{ bgcolor: '#1e293b', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    {tasks.length === 0 ? (
                        <Box sx={{ p: 6, textAlign: 'center', color: '#94a3b8' }}>
                            <Assignment sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                            <Typography>No tasks yet. Add one above!</Typography>
                        </Box>
                    ) : (
                        <Stack divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}>
                            {tasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s',
                                        bgcolor: task.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                                    }}
                                >
                                    {/* Left: Checkbox + Title */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                                        <IconButton onClick={() => toggleTask(task)} sx={{ color: task.status === 'COMPLETED' ? '#10b981' : '#64748b' }}>
                                            {task.status === 'COMPLETED' ? <CheckCircle /> : <RadioButtonUnchecked />}
                                        </IconButton>
                                        <Typography sx={{
                                            color: task.status === 'COMPLETED' ? '#64748b' : '#fff',
                                            textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                                            fontWeight: 500,
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                        }}>
                                            {task.title}
                                        </Typography>
                                    </Box>

                                    {/* Right: Date + Delete */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {task.status === 'PENDING' && (
                                            <Typography sx={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CalendarToday sx={{ fontSize: 14 }} /> {task.dueDate}
                                            </Typography>
                                        )}
                                        <IconButton
                                            onClick={() => confirmDeleteTask(task.id)}
                                            size="small"
                                            sx={{ color: '#ef4444', opacity: 0.5, '&:hover': { opacity: 1, bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Paper>

                {/* --- DIALOG: EDIT PROJECT --- */}
                <Dialog open={openEditProject} onClose={() => setOpenEditProject(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                            <TextField label="Title" fullWidth value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} InputLabelProps={{ style: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
                            <TextField label="Description" fullWidth multiline rows={3} value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} InputLabelProps={{ style: { color: '#94a3b8' } }} InputProps={{ sx: { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenEditProject(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                        <Button onClick={handleUpdateProject} variant="contained" sx={{ bgcolor: '#6366f1' }}>Save Changes</Button>
                    </DialogActions>
                </Dialog>

                {/* --- DIALOG: DELETE PROJECT --- */}
                <Dialog open={openDeleteProject} onClose={() => setOpenDeleteProject(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
                        <WarningAmber /> Delete Project?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#94a3b8' }}>
                            Are you sure you want to delete <b>"{project.title}"</b>? This action cannot be undone and will remove all tasks inside it.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenDeleteProject(false)} sx={{ color: '#fff' }}>Cancel</Button>
                        <Button onClick={handleDeleteProject} variant="contained" color="error">Delete Permanently</Button>
                    </DialogActions>
                </Dialog>

                {/* --- DIALOG: DELETE TASK --- */}
                <Dialog open={openDeleteTask} onClose={() => setOpenDeleteTask(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3 } }}>
                    <DialogTitle>Delete Task?</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#94a3b8' }}>
                            Are you sure you want to remove this task?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenDeleteTask(false)} sx={{ color: '#fff' }}>Cancel</Button>
                        <Button onClick={executeDeleteTask} variant="contained" color="error">Delete</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </Box>
    );
};

export default ProjectDetailsPage;