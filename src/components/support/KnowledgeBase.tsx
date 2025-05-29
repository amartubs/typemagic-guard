
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface Article {
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge-base-articles', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_base_articles')
        .select('*')
        .eq('status', 'published')
        .order('view_count', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ articleId, isHelpful }: { articleId: string; isHelpful: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      // First, try to insert the vote
      const { error: insertError } = await supabase
        .from('knowledge_base_votes')
        .insert({
          article_id: articleId,
          user_id: user.id,
          is_helpful: isHelpful,
        });

      if (insertError) {
        // If insert fails due to duplicate, update the existing vote
        const { error: updateError } = await supabase
          .from('knowledge_base_votes')
          .update({ is_helpful: isHelpful })
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

      // Update the article vote counts
      const field = isHelpful ? 'helpful_votes' : 'unhelpful_votes';
      const { error: articleError } = await supabase.rpc('increment', {
        table_name: 'knowledge_base_articles',
        row_id: articleId,
        field_name: field,
      });

      if (articleError) {
        // Fallback to manual increment
        const { data: currentArticle } = await supabase
          .from('knowledge_base_articles')
          .select(field)
          .eq('id', articleId)
          .single();

        if (currentArticle) {
          await supabase
            .from('knowledge_base_articles')
            .update({ [field]: currentArticle[field] + 1 })
            .eq('id', articleId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base-articles'] });
    },
  });

  const categories = ['all', 'general', 'technical', 'billing', 'getting-started', 'troubleshooting'];

  if (selectedArticle) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedArticle(null)}>
              ← Back to Articles
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {selectedArticle.view_count} views
              </div>
            </div>
          </div>
          <CardTitle>{selectedArticle.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedArticle.category}</Badge>
            {selectedArticle.tags?.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
          </div>
          
          {user && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">Was this article helpful?</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => voteMutation.mutate({ articleId: selectedArticle.id, isHelpful: true })}
                  disabled={voteMutation.isPending}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Yes ({selectedArticle.helpful_votes})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => voteMutation.mutate({ articleId: selectedArticle.id, isHelpful: false })}
                  disabled={voteMutation.isPending}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  No ({selectedArticle.unhelpful_votes})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Find answers to common questions and learn how to use our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : articles && articles.length > 0 ? (
            <div className="grid gap-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{article.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {article.view_count}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      {article.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {article.helpful_votes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        {article.unhelpful_votes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBase;
