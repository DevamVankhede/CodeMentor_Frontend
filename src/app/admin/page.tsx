'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Users, Code2, BookOpen, Activity, Shield, BarChart3,
  Eye, Edit, Trash2, Plus, RefreshCw, Search, Filter,
  Download, Mail, Ban, UserCheck, X, Save, AlertCircle
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  level: number;
  xpPoints: number;
  bugsFixed: number;
  gamesWon: number;
  currentStreak: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    level: 1,
    xpPoints: 0,
    bugsFixed: 0,
    gamesWon: 0,
    currentStreak: 0,
  });

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user && !user.isAdmin) {
      setError('Access denied. Admin privileges required.');
    }
  }, [user, isAuthenticated]);

  // Fetch admin data
  const fetchAdminData = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to access admin panel');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        setRecentActivity(statsData.recentActivity || []);
      } else if (statsRes.status === 401) {
        setError('Unauthorized. Please log in with an admin account.');
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      } else if (usersRes.status === 401) {
        setError('Unauthorized. Please log in with an admin account.');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch admin data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  // Create user
  const handleCreateUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to create users');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.isAdmin,
        }),
      });

      if (response.ok) {
        setSuccess('User created successfully!');
        setShowCreateModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          isAdmin: false,
          level: 1,
          xpPoints: 0,
          bugsFixed: 0,
          gamesWon: 0,
          currentStreak: 0,
        });
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to update users');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatePayload: any = {
        name: formData.name,
        email: formData.email,
        isAdmin: formData.isAdmin,
        level: formData.level,
        xpPoints: formData.xpPoints,
        bugsFixed: formData.bugsFixed,
        gamesWon: formData.gamesWon,
        currentStreak: formData.currentStreak,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          ...updatePayload,
        }),
      });

      if (response.ok) {
        setSuccess('User updated successfully!');
        setShowEditModal(false);
        setSelectedUser(null);
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to delete users');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('User deleted successfully!');
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      isAdmin: user.isAdmin,
      level: user.level,
      xpPoints: user.xpPoints,
      bugsFixed: user.bugsFixed,
      gamesWon: user.gamesWon,
      currentStreak: user.currentStreak,
    });
    setShowEditModal(true);
  };

  // Filter users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show access denied if not admin
  if (isAuthenticated && user && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h2>
              <p className="text-text-secondary mb-4">You need admin privileges to access this page.</p>
              <Button onClick={() => window.location.href = '/'}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Please Log In</h2>
              <p className="text-text-secondary mb-4">You need to be logged in as an admin to access this page.</p>
              <Button onClick={() => window.location.href = '/'}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">Manage users, content, and settings</p>
          </div>
          <div className="flex gap-2">
            <Button
              leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
              onClick={fetchAdminData}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-4 h-4 text-green-400" />
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'content', label: 'Content', icon: Code2 },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              leftIcon={<tab.icon className="w-4 h-4" />}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Loading admin data...</p>
              </div>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm">Total Users</p>
                          <p className="text-3xl font-bold text-text-primary">{stats.totalUsers || 0}</p>
                          <p className="text-xs text-green-400 mt-1">{stats.activeUsers || 0} active</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm">Active Users</p>
                          <p className="text-3xl font-bold text-text-primary">{stats.activeUsers || 0}</p>
                          <p className="text-xs text-text-tertiary mt-1">Last 30 days</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm">Games Played</p>
                          <p className="text-3xl font-bold text-text-primary">{stats.totalGamesPlayed || 0}</p>
                          <p className="text-xs text-text-tertiary mt-1">All time</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Code2 className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm">Collaborations</p>
                          <p className="text-3xl font-bold text-text-primary">{stats.totalCollaborations || 0}</p>
                          <p className="text-xs text-text-tertiary mt-1">Total sessions</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity: any) => (
                          <div key={activity.id} className="flex items-center gap-4 p-3 bg-surface-secondary rounded-lg hover:bg-surface-secondary/80 transition-colors duration-200">
                            <div className={`w-2 h-2 rounded-full ${activity.type === 'user_signup' ? 'bg-green-500' :
                              activity.type === 'code_created' ? 'bg-blue-500' :
                                'bg-purple-500'
                              }`}></div>
                            <div className="flex-1">
                              <p className="text-text-primary font-medium">{activity.description}</p>
                              <p className="text-text-secondary text-sm">by {activity.user}</p>
                            </div>
                            <p className="text-text-tertiary text-sm">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-secondary text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-secondary">No data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">User Management</h2>
              <div className="flex gap-2">
                <Button
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      isAdmin: false,
                      level: 1,
                      xpPoints: 0,
                      bugsFixed: 0,
                      gamesWon: 0,
                      currentStreak: 0,
                    });
                    setShowCreateModal(true);
                  }}
                >
                  Add User
                </Button>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-secondary">
                      <tr>
                        <th className="text-left p-4 text-text-secondary font-medium">User</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Level</th>
                        <th className="text-left p-4 text-text-secondary font-medium">XP</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Bugs Fixed</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Games Won</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Streak</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Last Login</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center">
                            <RefreshCw className="w-6 h-6 text-primary-500 animate-spin mx-auto mb-2" />
                            <p className="text-text-secondary">Loading users...</p>
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center">
                            <p className="text-text-secondary">No users found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t border-border-primary hover:bg-surface-secondary/50 transition-colors duration-200">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-text-primary">{user.name}</p>
                                  <p className="text-sm text-text-secondary">{user.email}</p>
                                  {user.isAdmin && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                      Admin
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-text-primary font-medium">{user.level}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-text-primary">{user.xpPoints.toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-text-secondary">{user.bugsFixed}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-text-secondary">{user.gamesWon}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-text-secondary">{user.currentStreak} days</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isEmailVerified
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {user.isEmailVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td className="p-4 text-text-secondary text-sm">
                              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <button
                                  className="p-2 text-text-tertiary hover:text-blue-500 hover:bg-surface-secondary rounded transition-colors duration-200"
                                  title="Edit"
                                  onClick={() => openEditModal(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 text-text-tertiary hover:text-red-500 hover:bg-surface-secondary rounded transition-colors duration-200"
                                  title="Delete"
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Content Management</h3>
            <p className="text-text-secondary">Manage code samples and templates</p>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Create New User</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-surface-secondary rounded transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isAdmin" className="text-sm text-text-secondary">
                    Admin privileges
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateUser}
                    disabled={loading}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="flex-1"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Edit User</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 hover:bg-surface-secondary rounded transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password or leave blank"
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsAdmin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="editIsAdmin" className="text-sm text-text-secondary">
                    Admin privileges
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Level</label>
                    <input
                      type="number"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">XP Points</label>
                    <input
                      type="number"
                      value={formData.xpPoints}
                      onChange={(e) => setFormData({ ...formData, xpPoints: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Bugs Fixed</label>
                    <input
                      type="number"
                      value={formData.bugsFixed}
                      onChange={(e) => setFormData({ ...formData, bugsFixed: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Games Won</label>
                    <input
                      type="number"
                      value={formData.gamesWon}
                      onChange={(e) => setFormData({ ...formData, gamesWon: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Current Streak</label>
                    <input
                      type="number"
                      value={formData.currentStreak}
                      onChange={(e) => setFormData({ ...formData, currentStreak: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleUpdateUser}
                    disabled={loading}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="flex-1"
                  >
                    {loading ? 'Updating...' : 'Update User'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
