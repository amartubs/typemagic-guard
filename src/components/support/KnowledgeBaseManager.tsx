
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  view_count: number;
  helpful_votes: number;
  unhelpful_votes: number;
  created_at: string;
  updated_at: string;
}

const KnowledgeBaseManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    status: 'draft'
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['kb-admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeBaseArticle[];
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: typeof formData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .insert({
          title: articleData.title,
          content: articleData.content,
          category: articleData.category,
          tags: articleData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: articleData.status,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-admin-articles'] });
      toast({
        title: "Article Created",
        description: "Knowledge base article has been created successfully.",
      });
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, ...articleData }: typeof formData & { id: string }) => {
      const { error } = await supabase
        .from('knowledge_base_articles')
        .update({
          title: articleData.title,
          content: articleData.content,
          category: articleData.category,
          tags: articleData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: articleData.status,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-admin-articles'] });
      toast({
        title: "Article Updated",
        description: "Knowledge base article has been updated successfully.",
      });
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_base_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-admin-articles'] });
      toast({
        title: "Article Deleted",
        description: "Knowledge base article has been deleted successfully.",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      tags: '',
      status: 'draft'
    });
    setSelectedArticle(null);
  };

  const handleEdit = (article: KnowledgeBaseArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags?.join(', ') || '',
      status: article.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArticle) {
      updateArticleMutation.mutate({ ...formData, id: selectedArticle.id });
    } else {
      createArticleMutation.mutate(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading knowledge base articles...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Knowledge Base Management
              </CardTitle>
              <CardDescription>
                Create and manage knowledge base articles
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedArticle ? 'Edit Article' : 'Create New Article'}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedArticle ? 'Update the article details below.' : 'Fill in the details to create a new knowledge base article.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="getting_started">Getting Started</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="features">Features</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createArticleMutation.isPending || updateArticleMutation.isPending}
                    >
                      {selectedArticle ? 'Update' : 'Create'} Article
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {articles && articles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.category.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.view_count}</TableCell>
                    <TableCell>
                      <span className="text-green-600">+{article.helpful_votes}</span>
                      {' / '}
                      <span className="text-red-600">-{article.unhelpful_votes}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(article.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteArticleMutation.mutate(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first knowledge base article to help users
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseManager;
