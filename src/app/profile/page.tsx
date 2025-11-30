'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
    User, Mail, Calendar, Award, Trophy, Star, Target, TrendingUp,
    Edit2, Save, X, Github, Linkedin, Twitter, Globe
} from 'lucide-react';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        github: user?.github || '',
        linkedin: user?.linkedin || '',
        twitter: user?.twitter || '',
    });

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-[#0a0118]">
                <Navigation />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <Card className="max-w-md">
                        <CardContent className="text-center py-12">
                            <User className="w-20 h-20 text-primary-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-text-primary mb-3">Sign In Required</h2>
                            <p className="text-text-secondary mb-6">Please sign in to view your profile</p>
                            <Button onClick={() => window.location.href = '/'}>Sign In</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        // TODO: Implement API call to save profile
        console.log('Saving profile:', formData);
        setIsEditing(false);
    };

    const stats = [
        { label: 'Level', value: user.level, icon: Award, color: 'text-purple-400' },
        { label: 'Total XP', value: user.xp, icon: Star, color: 'text-yellow-400' },
        { label: 'Challenges', value: user.challengesCompleted || 0, icon: Target, color: 'text-blue-400' },
        { label: 'Rank', value: user.rank || 'N/A', icon: Trophy, color: 'text-green-400' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0118]">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <Card className="mb-8">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="text-3xl font-bold text-text-primary bg-surface-secondary rounded px-3 py-2 mb-2 w-full"
                                    />
                                ) : (
                                    <h1 className="text-3xl font-bold text-text-primary mb-2">{user.name}</h1>
                                )}
                                <div className="flex items-center gap-2 text-text-secondary mb-3">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                                            Save
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsEditing(false)} leftIcon={<X className="w-4 h-4" />}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} leftIcon={<Edit2 className="w-4 h-4" />}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    className="w-full bg-surface-secondary text-text-primary rounded-lg p-3 min-h-[100px] resize-none"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat) => (
                                <Card key={stat.label}>
                                    <CardContent className="p-6 text-center">
                                        <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                                        <p className="text-text-tertiary text-sm mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary-500" />
                                    Recent Activity
                                </h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-surface-secondary rounded-lg">
                                            <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                                                <Trophy className="w-5 h-5 text-primary-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-text-primary font-medium">Completed Challenge</p>
                                                <p className="text-text-tertiary text-sm">2 hours ago</p>
                                            </div>
                                            <span className="text-yellow-400 font-semibold">+50 XP</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Social Links */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-text-primary mb-4">Social Links</h3>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Github className="w-5 h-5 text-text-secondary" />
                                            <input
                                                type="text"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                placeholder="GitHub username"
                                                className="flex-1 bg-surface-secondary text-text-primary rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Linkedin className="w-5 h-5 text-text-secondary" />
                                            <input
                                                type="text"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                placeholder="LinkedIn username"
                                                className="flex-1 bg-surface-secondary text-text-primary rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Twitter className="w-5 h-5 text-text-secondary" />
                                            <input
                                                type="text"
                                                value={formData.twitter}
                                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                                placeholder="Twitter username"
                                                className="flex-1 bg-surface-secondary text-text-primary rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-text-secondary" />
                                            <input
                                                type="text"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="Website URL"
                                                className="flex-1 bg-surface-secondary text-text-primary rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.github && (
                                            <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                                                <Github className="w-5 h-5" />
                                                <span>{formData.github}</span>
                                            </a>
                                        )}
                                        {!formData.github && !formData.linkedin && !formData.twitter && !formData.website && (
                                            <p className="text-text-tertiary text-sm">No social links added yet</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-text-primary mb-4">Achievements</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="aspect-square bg-surface-secondary rounded-lg flex items-center justify-center">
                                            <Award className="w-8 h-8 text-primary-500" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
