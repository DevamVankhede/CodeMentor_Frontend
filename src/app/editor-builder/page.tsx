'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import CustomEditorBuilder from '@/components/editor/CustomEditorBuilder';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function EditorBuilderPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary">
        <Navigation />
        <CustomEditorBuilder />
      </div>
    </ProtectedRoute>
  );
}