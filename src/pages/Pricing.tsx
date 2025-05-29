
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PricingCards from '@/components/subscription/PricingCards';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSelectPlan = async (plan: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId: plan.id,
          userType: user.subscription?.type || 'individual'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">TypeMagic Guard</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure your digital identity with advanced biometric authentication. 
            Choose the plan that fits your needs.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <PricingCards
            userType={user?.subscription?.type || 'individual'}
            currentPlanId={user?.subscription?.tier}
            onSelectPlan={handleSelectPlan}
            loading={loading}
          />
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Need a custom solution? {' '}
            <a href="mailto:sales@typemagicguard.com" className="text-primary hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
