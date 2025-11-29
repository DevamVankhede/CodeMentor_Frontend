'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
    Settings as SettingsIcon, User, Bell, Shield, Palette, Globe,
    Mail, Lock, Eye, EyeOff, Save, Trash2, Moon, Sun
} from 'lucide-react';

export default function SettingsPage() {
    const { user, isAuthenticated } = useAuth();
    const { actualTheme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('account');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        challenges: true,
        achievements: true,
        updates: false,
    });

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-[#0a0118]">
                <Navigation />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <Card className="max-w-md">
                        <CardContent className="text-center py-12">
                            <SettingsIcon className="w-20 h-20 text-primary-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-text-primary mb-3">Sign In Required</h2>
                            <p className="text-text-secondary mb-6">Please sign in to access settings</p>
                            <Button onClick={() => window.location.href = '/'}>Sign In</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'privacy', label: 'Privacy', icon: Lock },
    ];

    const handleSave = () => {
        console.log('Saving settings:', formData);
        // TODO: Implement API call
    };

    return (
        <div className="min-h-screen bg-[#0a0118]">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-white/60">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-4">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-primary-500/20 text-primary-500'
                                                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                                                }`}
                                        >
                                            <tab.icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'account' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-6">Account Settings</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-text-secondary text-sm font-medium mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-surface-secondary text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-text-secondary text-sm font-medium mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-surface-secondary text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-6">Security Settings</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-text-secondary text-sm font-medium mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.currentPassword}
                                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                    className="w-full bg-surface-secondary text-text-primary rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-text-secondary text-sm font-medium mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                className="w-full bg-surface-secondary text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-text-secondary text-sm font-medium mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-surface-secondary text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button onClick={handleSave} leftIcon={<Lock className="w-4 h-4" />}>
                                                Update Password
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-6">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {Object.entries(notifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                                                <div>
                                                    <p className="text-text-primary font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                    <p className="text-text-tertiary text-sm">Receive {key} notifications</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-surface-tertiary'
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : ''
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6">
                                        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                                            Save Preferences
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'appearance' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-6">Appearance Settings</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-text-secondary text-sm font-medium mb-4">
                                                Theme
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={actualTheme === 'dark' ? undefined : toggleTheme}
                                                    className={`p-6 rounded-lg border-2 transition-all ${actualTheme === 'dark'
                                                        ? 'border-primary-500 bg-primary-500/10'
                                                        : 'border-border hover:border-primary-500/50'
                                                        }`}
                                                >
                                                    <Moon className="w-8 h-8 text-text-primary mx-auto mb-2" />
                                                    <p className="text-text-primary font-medium">Dark</p>
                                                </button>
                                                <button
                                                    onClick={actualTheme === 'light' ? undefined : toggleTheme}
                                                    className={`p-6 rounded-lg border-2 transition-all ${actualTheme === 'light'
                                                        ? 'border-primary-500 bg-primary-500/10'
                                                        : 'border-border hover:border-primary-500/50'
                                                        }`}
                                                >
                                                    <Sun className="w-8 h-8 text-text-primary mx-auto mb-2" />
                                                    <p className="text-text-primary font-medium">Light</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'privacy' && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-6">Privacy Settings</h2>

                                    <div className="space-y-6">
                                        <div className="p-4 bg-surface-secondary rounded-lg">
                                            <h3 className="text-text-primary font-medium mb-2">Profile Visibility</h3>
                                            <p className="text-text-tertiary text-sm mb-4">Control who can see your profile</p>
                                            <select className="w-full bg-surface-tertiary text-text-primary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                                <option>Public</option>
                                                <option>Friends Only</option>
                                                <option>Private</option>
                                            </select>
                                        </div>

                                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                            <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                                            <p className="text-text-tertiary text-sm mb-4">Permanently delete your account and all data</p>
                                            <Button variant="outline" className="text-red-400 border-red-400 hover:bg-red-500/10" leftIcon={<Trash2 className="w-4 h-4" />}>
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
