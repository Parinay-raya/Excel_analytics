import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ExitToApp, Dashboard as DashboardIcon, People, Analytics } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';
import UploadHistory from '../components/UploadHistory';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0
  });
  const [selectedUserUploads, setSelectedUserUploads] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_CONFIG.getUrl('/users/all')}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const fetchedUsers = response.data;
        setUsers(fetchedUsers);
        setStats({
          totalUsers: fetchedUsers.length,
          totalAdmins: fetchedUsers.filter(user => user.role === 'admin').length,
          totalRegularUsers: fetchedUsers.filter(user => user.role === 'user').length
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserRole = (role) => {
    return role === 'admin' ? (
      <Chip label="Admin" color="error" size="small" />
    ) : (
      <Chip label="User" color="primary" size="small" />
    );
  };

  // Admin: Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_CONFIG.getUrl(`/users/${userId}`)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId && u.id !== userId));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  // Admin: View user upload history
  const handleViewUploads = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_CONFIG.getUrl(`/files?userId=${userId}`)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUserUploads(res.data.files || []);
      setViewingUser(users.find(u => u._id === userId || u.id === userId));
    } catch (err) {
      setSelectedUserUploads([]);
      setViewingUser(null);
      alert('Failed to fetch user uploads.');
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/files/${uploadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (viewingUser) handleViewUploads(viewingUser._id);
    } catch (err) {
      alert('Failed to delete file.');
    }
  };

  const handleDownloadUpload = async (uploadId, format) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/files/${uploadId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const contentDisposition = res.headers['content-disposition'];
      let fileName = 'downloaded_file';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  const handleViewData = (uploadId) => {
    alert('File preview not implemented for admin.');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard - Excel Analytics
          </Typography>
          <button className="btn btn-outline-light" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExitToApp style={{ marginRight: 4 }} /> Logout
          </button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Admin Dashboard
        </Typography>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <div className="card text-white bg-primary mb-3" style={{ minWidth: 200 }}>
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text" style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalUsers}</p>
            </div>
          </div>
          <div className="card text-white bg-danger mb-3" style={{ minWidth: 200 }}>
            <div className="card-body">
              <h5 className="card-title">Admins</h5>
              <p className="card-text" style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalAdmins}</p>
            </div>
          </div>
          <div className="card text-white bg-success mb-3" style={{ minWidth: 200 }}>
            <div className="card-body">
              <h5 className="card-title">Regular Users</h5>
              <p className="card-text" style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalRegularUsers}</p>
            </div>
          </div>
        </Box>

        {/* Users Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getUserRole(user.role)}</td>
                      <td>{user.createdAt}</td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewUploads(user._id)}>
                          View Uploads
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Show selected user's uploads in a modal or section */}
        {viewingUser && (
          <Dialog open={!!viewingUser} onClose={() => setViewingUser(null)} maxWidth="md" fullWidth>
            <DialogTitle>{viewingUser.name}'s Upload History</DialogTitle>
            <DialogContent>
              <UploadHistory
                uploads={selectedUserUploads || []}
                onViewData={handleViewData}
                onDeleteUpload={null}
                onRefresh={() => handleViewUploads(viewingUser._id)}
                onDownload={handleDownloadUpload}
              />
            </DialogContent>
            <DialogActions>
              <button className="btn btn-secondary" onClick={() => setViewingUser(null)}>Close</button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
