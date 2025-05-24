import React, { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Image as ImageIcon } from 'lucide-react';

interface AboutSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
}

export default function AboutSection({
  section,
  isSelected,
  onSelect,
  updateSection
}: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const content = section.content || { headline: '', bio: '', image: '' };

  // Handle headline change
  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSection({
      content: {
        ...content,
        headline: e.target.value
      }
    });
  };

  // Handle bio change
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSection({
      content: {
        ...content,
        bio: e.target.value
      }
    });
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSection({
      content: {
        ...content,
        image: e.target.value
      }
    });
  };

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Card
      className={`portfolio-section ${isSelected ? 'ring-2 ring-primary' : ''} ${
        section.layout === 'full' ? 'w-full' : section.layout === 'half' ? 'w-1/2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="portfolio-section-header">
        <h3 className="text-xl font-semibold">{section.title}</h3>
        {isSelected && (
          <Button variant="ghost" size="sm" onClick={toggleEditing}>
            <Edit size={16} className="mr-2" />
            {isEditing ? 'Done' : 'Edit'}
          </Button>
        )}
      </div>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <Input
                value={content.headline}
                onChange={handleHeadlineChange}
                placeholder="Your professional headline"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                value={content.bio}
                onChange={handleBioChange}
                placeholder="Write a short bio about yourself"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Profile Image URL</label>
              <Input
                value={content.image}
                onChange={handleImageChange}
                placeholder="https://example.com/your-image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL to your profile image. You can use services like Imgur or Cloudinary to host your images.
              </p>
            </div>
          </div>
        ) : (
          <div className={`flex ${section.layout === 'two-columns' ? 'flex-row' : 'flex-col'} gap-6`}>
            {content.image && (
              <div className={`${section.layout === 'two-columns' ? 'w-1/3' : 'w-full max-w-xs mx-auto'}`}>
                <div className="aspect-square rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {content.image ? (
                    <img
                      src={content.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  ) : (
                    <ImageIcon size={48} className="text-gray-400" />
                  )}
                </div>
              </div>
            )}
            
            <div className={`${section.layout === 'two-columns' && content.image ? 'w-2/3' : 'w-full'}`}>
              {content.headline && (
                <h4 className="text-xl font-medium mb-2">{content.headline}</h4>
              )}
              
              {content.bio && (
                <p className="text-gray-600 whitespace-pre-line">{content.bio}</p>
              )}
              
              {!content.headline && !content.bio && !isEditing && (
                <div className="text-center py-8 text-gray-500">
                  <p>Click Edit to add your information</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
