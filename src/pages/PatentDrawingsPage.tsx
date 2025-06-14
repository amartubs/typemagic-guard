
import React from 'react';
import PatentDrawings from '@/components/patent/PatentDrawings';

const PatentDrawingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <PatentDrawings />
      </div>
    </div>
  );
};

export default PatentDrawingsPage;
