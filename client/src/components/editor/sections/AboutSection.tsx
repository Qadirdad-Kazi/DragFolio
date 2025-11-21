import React, { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Image as ImageIcon, GripVertical, Move } from 'lucide-react';
import { Box } from '@mui/material';

interface AboutSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
  templateCategory?: string;
}

export default function AboutSection({
  section,
  isSelected,
  onSelect,
  updateSection,
  templateCategory = 'professional' // Default template category
}: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Ensure all content properties are always strings to prevent controlled/uncontrolled input warnings
  const content = {
    headline: section.content?.headline || '',
    bio: section.content?.bio || '',
    image: section.content?.image || ''
  };

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

  // Apply drag handle styles when in editing mode
  const getDragHandleStyles = () => {
    return isEditing ? {
      cursor: 'grab',
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '4px',
      borderRadius: '4px',
      backgroundColor: 'rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
      '&:active': {
        cursor: 'grabbing',
        backgroundColor: 'rgba(0,0,0,0.15)',
      }
    } : { display: 'none' };
  };

  // Get template-specific styles
  const getTemplateStyles = () => {
    switch(templateCategory) {
      case 'creative':
        return 'bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 border-l-4 border-purple-400';
      case 'minimal':
        return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800';
      case 'corporate':
        return 'bg-blue-50 dark:bg-gray-900 border-b-4 border-blue-500';
      case 'tech':
        return 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 border-t-2 border-cyan-400';
      case 'professional':
      default:
        return 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800';
    }
  };

  return (
    <Card
      className={`portfolio-section relative ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'shadow-md hover:shadow-lg transition-shadow duration-300'} ${
        section.layout === 'full' ? 'w-full' : section.layout === 'half' ? 'w-1/2' : ''
      } ${getTemplateStyles()}`}
      onClick={onSelect}
    >
      {isEditing && (
        <Box sx={getDragHandleStyles()}>
          <GripVertical size={18} />
        </Box>
      )}
      <div className="portfolio-section-header flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          {isEditing && <Move size={16} className="mr-2 text-gray-400" />}
          {section.title}
        </h3>
        {isSelected && (
          <Button variant="ghost" size="sm" onClick={toggleEditing} className="ml-auto transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Edit size={16} className="mr-2" />
            {isEditing ? 'Done' : 'Edit'}
          </Button>
        )}
      </div>
      
      <CardContent className="p-5">
        {isEditing ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="transition-all duration-200 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Headline</label>
              <Input
                value={content.headline}
                onChange={handleHeadlineChange}
                placeholder="Your professional headline"
                className="border-gray-300 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">A short tagline that describes your professional identity</p>
            </div>
            
            <div className="transition-all duration-200 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Bio</label>
              <Textarea
                value={content.bio}
                onChange={handleBioChange}
                placeholder="Write a short bio about yourself"
                rows={4}
                className="border-gray-300 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Tell visitors about yourself, your skills, and your experience</p>
            </div>
            
            <div className="transition-all duration-200 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Profile Image URL</label>
              <div className="flex">
                <Input
                  value={content.image}
                  onChange={handleImageChange}
                  placeholder="https://example.com/your-image.jpg"
                  className="border-gray-300 dark:border-gray-700 flex-grow"
                />
                <Button variant="secondary" className="ml-2 whitespace-nowrap">
                  <ImageIcon size={16} className="mr-2" />
                  Browse...
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL to your profile image. You can use services like Imgur or Cloudinary to host your images.
              </p>
              
              {content.image && (
                <div className="mt-3 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-white dark:border-gray-700 shadow-sm">
                    <img
                      src={content.image}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`flex ${section.layout === 'two-columns' ? 'flex-row' : 'flex-col'} gap-8 items-center`}>
            {content.image && (
              <div className={`${section.layout === 'two-columns' ? 'w-1/3' : 'w-full max-w-xs mx-auto'} transition-all duration-300`}>
                <div className="aspect-square rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                  {content.image ? (
                    <img
                      src={content.image}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
            
            <div className={`${section.layout === 'two-columns' && content.image ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
              {content.headline && (
                <h4 className="text-2xl font-medium mb-3 text-gray-800 dark:text-gray-100">{content.headline}</h4>
              )}
              
              {content.bio && (
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed text-lg">{content.bio}</p>
              )}
              
              {!content.headline && !content.bio && !isEditing && (
                <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <ImageIcon size={36} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Your about section is empty</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Click Edit to add your information</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
