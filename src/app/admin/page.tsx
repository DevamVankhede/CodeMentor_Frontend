'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Users, Code2, BookOpen, Activity, Shield, BarChart3,
  Eye, Edit, Trash2, Plus, RefreshCw, Search, Filter,
  Download, Mail, Ban, UserCheck
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin credentials (in production, this should be handled by backend)
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      localStorage.setItem('admin_session', 'true');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // Fetch admin data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        setRecentActivity(statsData.recentActivity || []);
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for existing admin session
  React.useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Fetch data when admin logs in
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [isAdminLoggedIn]);

  // Show login form if not admin logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Admin Login</h2>
                <p className="text-text-secondary">Enter your admin credentials to continue</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    required
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{loginError}</p>
                  </div>
                )}

                <Button type="submit" fullWidth className="py-3">
                  Sign In
                </Button>
              </form>

              <div className="mt-6 p-4 bg-surface-secondary rounded-lg">
                <p className="text-xs text-text-tertiary text-center mb-2">Demo Credentials:</p>
                <p className="text-sm text-text-secondary text-center">
                  Username: <span className="font-mono text-primary-500">admin</span>
                </p>
                <p className="text-sm text-text-secondary text-center">
                  Password: <span className="font-mono text-primary-500">admin123</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // After admin login, show the dashboard
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
              variant="outline"
              leftIcon={<Shield className="w-4 h-4" />}
              onClick={() => {
                setIsAdminLoggedIn(false);
                localStorage.removeItem('admin_session');
              }}
            >
              Admin Logout
            </Button>
            <Button
              leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
              onClick={fetchAdminData}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

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
                          <p className="text-3xl font-bold text-text-primary">{stats.totalUsers}</p>
                          <p className="text-xs text-green-400 mt-1">+{stats.newUsersToday} today</p>
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
                          <p className="text-3xl font-bold text-text-primary">{stats.activeUsers}</p>
                          <p className="text-xs text-text-tertiary mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active</p>
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
                          <p className="text-3xl font-bold text-text-primary">{stats.totalGamesPlayed}</p>
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
                          <p className="text-3xl font-bold text-text-primary">{stats.totalCollaborations}</p>
                          <p className="text-xs text-text-tertiary mt-1">Active sessions</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-text-secondary text-sm">System Status</p>
                      </div>
                      <p className="text-xl font-bold text-text-primary capitalize">{stats.systemHealth}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <p className="text-text-secondary text-sm mb-2">Server Uptime</p>
                      <p className="text-xl font-bold text-text-primary">{stats.serverUptime}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <p className="text-text-secondary text-sm mb-2">Database Size</p>
                      <p className="text-xl font-bold text-text-primary">{stats.databaseSize}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
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
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
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
                <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
                <Button leftIcon={<Plus className="w-4 h-4" />}>Add User</Button>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
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
                        <th className="text-left p-4 text-text-secondary font-medium">Games</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Last Active</th>
                        <th className="text-left p-4 text-text-secondary font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u =>
                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((user) => (
                        <tr key={user.id} className="border-t border-border-primary hover:bg-surface-secondary/50 transition-colors duration-200">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-text-primary">{user.name}</p>
                                <p className="text-sm text-text-secondary">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-text-primary font-medium">{user.level}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-text-primary">{user.xp?.toLocaleString() || 0}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-text-secondary">{user.gamesPlayed || 0}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              user.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 text-text-secondary text-sm">
                            {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <button className="p-2 text-text-tertiary hover:text-primary-500 hover:bg-surface-secondary rounded transition-colors duration-200" title="View">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-text-tertiary hover:text-blue-500 hover:bg-surface-secondary rounded transition-colors duration-200" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-text-tertiary hover:text-green-500 hover:bg-surface-secondary rounded transition-colors duration-200" title="Email">
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-text-tertiary hover:text-red-500 hover:bg-surface-secondary rounded transition-colors duration-200"
                                title={user.status === 'banned' ? 'Unban' : 'Ban'}
                                onClick={() => {
                                  if (confirm(`${user.status === 'banned' ? 'Unban' : 'Ban'} ${user.name}?`)) {
                                    setUsers(users.map(u =>
                                      u.id === user.id ? { ...u, status: u.status === 'banned' ? 'active' as const : 'banned' as const } : u
                                    ));
                                  }
                                }}
                              >
                                {user.status === 'banned' ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
    </div>
  );
}
