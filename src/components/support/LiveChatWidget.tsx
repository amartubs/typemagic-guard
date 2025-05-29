
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  status: string;
  started_at: string;
}

const LiveChatWidget = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useQuery({
    queryKey: ['chat-messages', currentSession?.id],
    queryFn: async () => {
      if (!currentSession) return [];

      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!currentSession,
    refetchInterval: 2000, // Poll for new messages every 2 seconds
  });

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('live_chat_sessions')
        .insert({
          user_id: user.id,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;
      return data as ChatSession;
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      toast({
        title: "Chat Started",
        description: "You've been added to the support queue. An agent will be with you shortly.",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user || !currentSession) throw new Error('No active session');

      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user.id,
          message: messageText,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) return null;

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Support</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {currentSession?.status === 'waiting' && (
            <p className="text-sm text-muted-foreground">
              Waiting for an agent...
            </p>
          )}
          {currentSession?.status === 'active' && (
            <p className="text-sm text-green-600">
              Connected to support agent
            </p>
          )}
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {!currentSession ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Start Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with our support team for immediate assistance
                    </p>
                    <Button 
                      onClick={() => startSessionMutation.mutate()}
                      disabled={startSessionMutation.isPending}
                    >
                      {startSessionMutation.isPending ? 'Starting...' : 'Start Chat'}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-lg max-w-[80%] ${
                          msg.user_id === user.id
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!message.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default LiveChatWidget;
