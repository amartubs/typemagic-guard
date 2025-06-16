
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BookOpen, MessageCircle, HelpCircle, Settings } from 'lucide-react';
import SupportTicketList from './SupportTicketList';
import SupportTicketDetail from './SupportTicketDetail';
import CreateTicketForm from './CreateTicketForm';
import KnowledgeBase from './KnowledgeBase';
import KnowledgeBaseManager from './KnowledgeBaseManager';
import LiveChatWidget from './LiveChatWidget';
import { useAuth } from '@/contexts/auth';

const CustomerSupport = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'list' | 'create' | 'view'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tickets');

  const handleCreateTicket = () => {
    setActiveView('create');
  };

  const handleViewTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveView('view');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedTicketId(null);
  };

  // Check if user is admin (in a real app, this would be from user roles)
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Customer Support</h2>
          <p className="text-muted-foreground mt-2">
            Get help when you need it with our comprehensive support system
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            {activeView === 'list' && (
              <SupportTicketList
                onCreateTicket={handleCreateTicket}
                onViewTicket={handleViewTicket}
              />
            )}
            {activeView === 'create' && (
              <CreateTicketForm onBack={handleBackToList} />
            )}
            {activeView === 'view' && selectedTicketId && (
              <SupportTicketDetail
                ticketId={selectedTicketId}
                onBack={handleBackToList}
              />
            )}
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <KnowledgeBase />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <KnowledgeBaseManager />
            </TabsContent>
          )}
        </Tabs>

        {/* Support tier information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support Tiers
            </CardTitle>
            <CardDescription>
              Your support level depends on your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">Free Tier</h3>
                <ul className="text-sm space-y-1">
                  <li>• Knowledge base access</li>
                  <li>• Community support</li>
                  <li>• Email support (48h response)</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">Professional</h3>
                <ul className="text-sm space-y-1">
                  <li>• Priority email support (24h)</li>
                  <li>• Live chat support</li>
                  <li>• Phone support (business hours)</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-purple-600 mb-2">Enterprise</h3>
                <ul className="text-sm space-y-1">
                  <li>• Dedicated account manager</li>
                  <li>• 24/7 priority support</li>
                  <li>• Custom SLA agreements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </>
  );
};

export default CustomerSupport;
