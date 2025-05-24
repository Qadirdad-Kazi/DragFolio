import React, { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, Calendar, ArrowUpRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  image?: string;
  tags: string[];
}

interface BlogSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
}

export default function BlogSection({
  section,
  isSelected,
  onSelect,
  updateSection
}: BlogSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const content = section.content || { posts: [] };
  const posts: BlogPost[] = content.posts || [];

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditingPost(null);
  };

  // Add a new blog post
  const addPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Blog Post',
      summary: 'A brief summary of your blog post.',
      date: new Date().toISOString().split('T')[0],
      url: '',
      image: '',
      tags: []
    };
    
    updateSection({
      content: {
        ...content,
        posts: [...posts, newPost]
      }
    });
    
    setEditingPost(newPost);
  };

  // Update a blog post
  const updatePost = (updatedPost: BlogPost) => {
    updateSection({
      content: {
        ...content,
        posts: posts.map(p => 
          p.id === updatedPost.id ? updatedPost : p
        )
      }
    });
  };

  // Remove a blog post
  const removePost = (postId: string) => {
    updateSection({
      content: {
        ...content,
        posts: posts.filter(p => p.id !== postId)
      }
    });
    
    if (editingPost?.id === postId) {
      setEditingPost(null);
    }
  };

  // Handle tags input
  const handleTagsChange = (tags: string, postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      updatePost({
        ...post,
        tags: tagArray
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card
      className={`portfolio-section ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <div className="portfolio-section-header">
        <h3 className="text-xl font-semibold">{section.title}</h3>
        {isSelected && (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={addPost}>
              <Plus size={16} className="mr-2" />
              Add Blog Post
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleEditing}>
              <Edit size={16} className="mr-2" />
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No blog posts added yet</p>
            {isSelected && (
              <Button variant="outline" onClick={addPost}>
                <Plus size={16} className="mr-2" />
                Add Your First Blog Post
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid ${section.layout === 'two-columns' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {posts.map(post => (
              <div 
                key={post.id} 
                className={`border rounded-lg overflow-hidden ${
                  editingPost?.id === post.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                {isEditing ? (
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Edit Blog Post</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removePost(post.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                    
                    <div>
                      <Label htmlFor={`post-title-${post.id}`}>Title</Label>
                      <Input
                        id={`post-title-${post.id}`}
                        value={post.title}
                        onChange={(e) => updatePost({ ...post, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`post-summary-${post.id}`}>Summary</Label>
                      <Textarea
                        id={`post-summary-${post.id}`}
                        value={post.summary}
                        onChange={(e) => updatePost({ ...post, summary: e.target.value })}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`post-date-${post.id}`}>Publication Date</Label>
                      <Input
                        id={`post-date-${post.id}`}
                        type="date"
                        value={post.date}
                        onChange={(e) => updatePost({ ...post, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`post-url-${post.id}`}>Blog URL</Label>
                      <Input
                        id={`post-url-${post.id}`}
                        value={post.url}
                        onChange={(e) => updatePost({ ...post, url: e.target.value })}
                        placeholder="https://example.com/blog-post"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`post-image-${post.id}`}>Featured Image URL</Label>
                      <Input
                        id={`post-image-${post.id}`}
                        value={post.image || ''}
                        onChange={(e) => updatePost({ ...post, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`post-tags-${post.id}`}>Tags</Label>
                      <Input
                        id={`post-tags-${post.id}`}
                        value={post.tags.join(', ')}
                        onChange={(e) => handleTagsChange(e.target.value, post.id)}
                        placeholder="React, Web Development, Design"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated list of tags</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {post.image && (
                      <div className="aspect-video w-full bg-gray-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Blog+Image';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-medium mb-2">{post.title}</h4>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{post.summary}</p>
                      
                      {post.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Read Article
                          <ArrowUpRight size={14} className="ml-1" />
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
