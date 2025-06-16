
import { supabase } from '@/integrations/supabase/client';

interface ChatSession {
  id: string;
  user_id: string;
  status: string;
}

interface ChatMessage {
  session_id: string;
  user_id: string;
  message: string;
}

class ChatAgentSimulator {
  private static instance: ChatAgentSimulator;
  private activeSimulations = new Set<string>();

  static getInstance(): ChatAgentSimulator {
    if (!ChatAgentSimulator.instance) {
      ChatAgentSimulator.instance = new ChatAgentSimulator();
    }
    return ChatAgentSimulator.instance;
  }

  async startAgentSimulation(sessionId: string): Promise<void> {
    if (this.activeSimulations.has(sessionId)) {
      return;
    }

    this.activeSimulations.add(sessionId);

    // Wait 2-5 seconds before agent "joins"
    const joinDelay = Math.random() * 3000 + 2000;
    
    setTimeout(async () => {
      await this.updateSessionStatus(sessionId, 'active');
      await this.sendAgentMessage(sessionId, 'system', 'Hello! I\'m here to help you. How can I assist you today?');
      
      // Start listening for user messages
      this.listenForUserMessages(sessionId);
    }, joinDelay);
  }

  private async updateSessionStatus(sessionId: string, status: string): Promise<void> {
    try {
      await supabase
        .from('live_chat_sessions')
        .update({ status })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  }

  private async sendAgentMessage(sessionId: string, userId: string, message: string): Promise<void> {
    try {
      await supabase
        .from('live_chat_messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          message,
        });
    } catch (error) {
      console.error('Error sending agent message:', error);
    }
  }

  private async listenForUserMessages(sessionId: string): Promise<void> {
    // Subscribe to new messages in this session
    const channel = supabase
      .channel(`chat-session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          const message = payload.new as ChatMessage;
          
          // Don't respond to agent messages
          if (message.user_id === 'system') {
            return;
          }

          // Generate appropriate response after a delay
          const responseDelay = Math.random() * 3000 + 1000;
          setTimeout(async () => {
            const response = this.generateAgentResponse(message.message);
            await this.sendAgentMessage(sessionId, 'system', response);
          }, responseDelay);
        }
      )
      .subscribe();

    // Clean up after 30 minutes
    setTimeout(() => {
      supabase.removeChannel(channel);
      this.activeSimulations.delete(sessionId);
    }, 30 * 60 * 1000);
  }

  private generateAgentResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    // Billing related
    if (message.includes('billing') || message.includes('payment') || message.includes('subscription')) {
      return 'I can help you with billing questions. You can manage your subscription in the Settings page. Is there a specific billing issue I can assist with?';
    }

    // Technical issues
    if (message.includes('error') || message.includes('bug') || message.includes('problem') || message.includes('issue')) {
      return 'I understand you\'re experiencing a technical issue. Can you provide more details about what you were doing when the problem occurred? This will help me assist you better.';
    }

    // Account related
    if (message.includes('account') || message.includes('profile') || message.includes('settings')) {
      return 'For account-related questions, you can update your profile and settings in the user dashboard. What specific account changes are you looking to make?';
    }

    // Features and how-to
    if (message.includes('how') || message.includes('feature') || message.includes('use')) {
      return 'I\'d be happy to explain how our features work. You might also find our Knowledge Base helpful for detailed guides. What specific feature would you like to know more about?';
    }

    // Security related
    if (message.includes('security') || message.includes('biometric') || message.includes('authentication')) {
      return 'Security is very important to us. You can adjust your security settings in the Settings page. For specific security concerns, I can help guide you through the options available.';
    }

    // General greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return 'Hello! I\'m here to help you with any questions about our platform. You can ask me about features, billing, technical issues, or account settings. What would you like to know?';
    }

    // Default responses
    const defaultResponses = [
      'Thank you for that information. Could you provide a bit more detail so I can better assist you?',
      'I want to make sure I understand your question correctly. Could you elaborate on what you\'re trying to accomplish?',
      'That\'s a great question. Let me help you with that. Can you tell me more about your specific situation?',
      'I\'m here to help! To provide the best assistance, could you give me some additional context?',
      'Thanks for reaching out. To better assist you, could you describe the issue in more detail?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  stopSimulation(sessionId: string): void {
    this.activeSimulations.delete(sessionId);
  }
}

export const chatAgentSimulator = ChatAgentSimulator.getInstance();
