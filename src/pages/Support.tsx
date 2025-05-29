
import React from 'react';
import CustomerSupport from '@/components/support/CustomerSupport';
import Header from '@/components/layout/Header';

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CustomerSupport />
      </main>
    </div>
  );
};

export default Support;
