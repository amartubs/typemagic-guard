
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileManagement from '@/components/profile/ProfileManagement';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TypeMagic Guard</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="max-w-3xl mx-auto">
          <ProfileManagement />
        </div>
      </main>
    </div>
  );
};

export default Profile;
