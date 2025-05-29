
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  view_count: number;
  helpful_votes: number;
  unhelpful_votes: number;
  created_at: string;
}

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge-base-articles', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_base_articles')
        .select('*')
        .eq('status', 'published')
        .order('view_count', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as KnowledgeBaseArticle[];
    },
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'getting_started', label: 'Getting Started' },
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical' },
    { value: 'account', label: 'Account' },
    { value: 'features', label: 'Features' },
  ];

  const handleVote = async (articleId: string, isHelpful: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('knowledge_base_votes')
        .upsert({
          article_id: articleId,
          user_id: user.id,
          is_helpful: isHelpful,
        });

      if (error) throw error;
      
      // Get current article data and increment the vote count
      const { data: currentArticle, error: fetchError } = await supabase
        .from('knowledge_base_articles')
        .select('helpful_votes, unhelpful_votes')
        .eq('id', articleId)
        .single();

      if (fetchError) throw fetchError;

      const field = isHelpful ? 'helpful_votes' : 'unhelpful_votes';
      const newCount = (currentArticle[field] || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('knowledge_base_articles')
        .update({ [field]: newCount })
        .eq('id', articleId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const incrementViewCount = async (articleId: string) => {
    try {
      // Get current view count and increment it
      const { data: currentArticle, error: fetchError } = await supabase
        .from('knowledge_base_articles')
        .select('view_count')
        .eq('id', articleId)
        .single();

      if (fetchError) throw fetchError;

      const newViewCount = (currentArticle.view_count || 0) + 1;
      
      const { error } = await supabase
        .from('knowledge_base_articles')
        .update({ view_count: newViewCount })
        .eq('id', articleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading knowledge base...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Find answers to frequently asked questions and helpful guides
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader
                  onClick={() => incrementViewCount(article.id)}
                  className="pb-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {article.content.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{article.category.replace('_', ' ')}</Badge>
                  </div>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.view_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {article.helpful_votes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        {article.unhelpful_votes}
                      </span>
                    </div>
                    
                    {user && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(article.id, true);
                          }}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(article.id, false);
                          }}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Knowledge base articles will appear here once published'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBase;
