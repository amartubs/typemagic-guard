
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface SupportTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const SupportTicketList = ({ onCreateTicket, onViewTicket }: {
  onCreateTicket: () => void;
  onViewTicket: (ticketId: string) => void;
}) => {
  const { user } = useAuth();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'waiting_customer': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'secondary';
      default: return 'default';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading tickets...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Tickets
            </CardTitle>
            <CardDescription>
              View and manage your support requests
            </CardDescription>
          </div>
          <Button onClick={onCreateTicket}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tickets && tickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.category.replace('_', ' ')}</TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewTicket(ticket.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No support tickets yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first support ticket to get help from our team
            </p>
            <Button onClick={onCreateTicket}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Ticket
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportTicketList;
