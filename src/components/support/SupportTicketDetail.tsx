
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface SupportTicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

interface TicketMessage {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  is_internal: boolean;
}

interface TicketData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const SupportTicketDetail = ({ ticketId, onBack }: SupportTicketDetailProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ['support-ticket', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) throw error;
      return data as TicketData;
    },
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['support-ticket-messages', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TicketMessage[];
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          message,
          is_internal: false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket-messages'] });
      setNewMessage('');
      toast({
        title: "Message Sent",
        description: "Your message has been added to the ticket.",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket'] });
      toast({
        title: "Status Updated",
        description: "Ticket status has been updated.",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    addMessageMutation.mutate(newMessage);
  };

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

  if (ticketLoading || messagesLoading) {
    return <div className="text-center py-8">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="text-center py-8">Ticket not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{ticket.title}</h2>
          <p className="text-muted-foreground">Ticket #{ticket.id.slice(-8)}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getStatusColor(ticket.status)}>
            {ticket.status.replace('_', ' ')}
          </Badge>
          <Badge variant={getPriorityColor(ticket.priority)}>
            {ticket.priority}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ticket Details
          </CardTitle>
          <CardDescription>
            Created: {new Date(ticket.created_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{ticket.description}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="font-semibold">Category: </span>
                <span className="text-muted-foreground">{ticket.category.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="font-semibold">Last Updated: </span>
                <span className="text-muted-foreground">{new Date(ticket.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {ticket.status !== 'closed' && (
        <div className="flex gap-2">
          {ticket.status === 'open' && (
            <Button 
              variant="outline" 
              onClick={() => updateStatusMutation.mutate('in_progress')}
              disabled={updateStatusMutation.isPending}
            >
              Mark In Progress
            </Button>
          )}
          {(ticket.status === 'in_progress' || ticket.status === 'waiting_customer') && (
            <Button 
              variant="outline" 
              onClick={() => updateStatusMutation.mutate('resolved')}
              disabled={updateStatusMutation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Resolved
            </Button>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">
                    {message.is_internal ? 'Support Agent' : 'You'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{message.message}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No messages yet.</p>
          )}

          {ticket.status !== 'closed' && (
            <form onSubmit={handleSendMessage} className="mt-6 space-y-4">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a message to this ticket..."
                rows={4}
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || addMessageMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketDetail;
