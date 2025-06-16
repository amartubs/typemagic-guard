
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerSupport from '@/components/support/CustomerSupport';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

const Support = () => {
  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <CustomerSupport />
      </div>
    </ProtectedLayout>
  );
};

export default Support;
