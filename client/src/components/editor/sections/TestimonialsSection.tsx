import { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, Quote, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  image?: string;
}

interface TestimonialsSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function TestimonialsSection({
  section,
  isSelected,
  onSelect,
  updateSection,
  onMoveUp,
  onMoveDown
}: TestimonialsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const content = section.content || { testimonials: [] };
  const testimonials: Testimonial[] = content.testimonials || [];

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditingTestimonial(null);
  };

  // Add a new testimonial
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      quote: 'Add a testimonial from a client or colleague.',
      author: 'Client Name',
      title: 'Job Title',
      company: 'Company Name',
      image: ''
    };

    updateSection({
      content: {
        ...content,
        testimonials: [...testimonials, newTestimonial]
      }
    });

    setEditingTestimonial(newTestimonial);
  };

  // Update a testimonial
  const updateTestimonial = (updatedTestimonial: Testimonial) => {
    updateSection({
      content: {
        ...content,
        testimonials: testimonials.map(t =>
          t.id === updatedTestimonial.id ? updatedTestimonial : t
        )
      }
    });
  };

  // Remove a testimonial
  const removeTestimonial = (testimonialId: string) => {
    updateSection({
      content: {
        ...content,
        testimonials: testimonials.filter(t => t.id !== testimonialId)
      }
    });

    if (editingTestimonial?.id === testimonialId) {
      setEditingTestimonial(null);
    }
  };

  return (
    <Card
      className={`portfolio-section ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <div className="portfolio-section-header p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
      </div>

      {isSelected && (
        <div className="absolute top-4 -right-16 flex flex-col gap-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={onMoveUp}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Move Up"
          >
            <ArrowUp size={18} className="text-gray-600 dark:text-gray-300" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={onMoveDown}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Move Down"
          >
            <ArrowDown size={18} className="text-gray-600 dark:text-gray-300" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={toggleEditing}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isEditing ? "Finish Editing" : "Edit Section"}
          >
            {isEditing ? <Check size={18} className="text-green-600" /> : <Edit size={18} className="text-gray-600 dark:text-gray-300" />}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={addTestimonial}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Add Testimonial"
          >
            <Plus size={18} className="text-blue-600" />
          </Button>
        </div>
      )}

      <CardContent>
        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No testimonials added yet</p>
            {isSelected && (
              <Button variant="outline" onClick={addTestimonial}>
                <Plus size={16} className="mr-2" />
                Add Your First Testimonial
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid ${section.layout === 'two-columns' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className={`bg-gray-50 rounded-lg p-6 ${editingTestimonial?.id === testimonial.id ? 'ring-2 ring-primary' : ''
                  }`}
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Edit Testimonial</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTestimonial(testimonial.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor={`testimonial-quote-${testimonial.id}`} className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Quote</Label>
                      <Textarea
                        id={`testimonial-quote-${testimonial.id}`}
                        value={testimonial.quote}
                        onChange={(e) => updateTestimonial({ ...testimonial, quote: e.target.value })}
                        rows={3}
                        className="mt-1 border-gray-300 dark:border-gray-700"
                        placeholder="Enter the testimonial text..."
                      />
                      <p className="text-xs text-gray-500 mt-1">What did the person say about you?</p>
                    </div>

                    <div>
                      <Label htmlFor={`testimonial-author-${testimonial.id}`} className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Author Name</Label>
                      <Input
                        id={`testimonial-author-${testimonial.id}`}
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial({ ...testimonial, author: e.target.value })}
                        className="mt-1 border-gray-300 dark:border-gray-700"
                        placeholder="e.g. John Doe"
                      />
                      <p className="text-xs text-gray-500 mt-1">Name of the person who gave the testimonial</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`testimonial-title-${testimonial.id}`} className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Job Title</Label>
                        <Input
                          id={`testimonial-title-${testimonial.id}`}
                          value={testimonial.title}
                          onChange={(e) => updateTestimonial({ ...testimonial, title: e.target.value })}
                          className="mt-1 border-gray-300 dark:border-gray-700"
                          placeholder="e.g. CEO"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`testimonial-company-${testimonial.id}`} className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Company</Label>
                        <Input
                          id={`testimonial-company-${testimonial.id}`}
                          value={testimonial.company}
                          onChange={(e) => updateTestimonial({ ...testimonial, company: e.target.value })}
                          className="mt-1 border-gray-300 dark:border-gray-700"
                          placeholder="e.g. Tech Corp"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`testimonial-image-${testimonial.id}`} className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image URL</Label>
                      <Input
                        id={`testimonial-image-${testimonial.id}`}
                        value={testimonial.image || ''}
                        onChange={(e) => updateTestimonial({ ...testimonial, image: e.target.value })}
                        placeholder="https://example.com/photo.jpg"
                        className="mt-1 border-gray-300 dark:border-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">URL of the author's photo (optional)</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <Quote size={24} className="text-primary mb-4" />
                    <blockquote className="text-gray-700 mb-4 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center mt-auto">
                      {testimonial.image && (
                        <div className="mr-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={testimonial.image}
                              alt={testimonial.author}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{testimonial.author}</div>
                        <div className="text-sm text-gray-500">
                          {testimonial.title}{testimonial.company ? `, ${testimonial.company}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
