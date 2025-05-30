import { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  message?: string;
  socialLinks: SocialLink[];
}

interface ContactSectionProps {
  section: PortfolioSection;
  isSelected: boolean;
  onSelect: () => void;
  updateSection: (updates: Partial<PortfolioSection>) => void;
}

export default function ContactSection({
  section,
  isSelected,
  onSelect,
  updateSection
}: ContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const content = section.content || { email: '', phone: '', location: '', website: '', message: '', socialLinks: [] };
  // Ensure socialLinks is always an array to prevent errors
  if (!content.socialLinks) {
    content.socialLinks = [];
  }
  const contactInfo: ContactInfo = content;

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Update contact info
  const updateContactInfo = (updates: Partial<ContactInfo>) => {
    updateSection({
      content: {
        ...content,
        ...updates
      }
    });
  };

  // Add a new social link
  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'github',
      url: ''
    };
    
    updateContactInfo({
      socialLinks: [...contactInfo.socialLinks, newLink]
    });
  };

  // Update a social link
  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    updateContactInfo({
      socialLinks: contactInfo.socialLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    });
  };

  // Remove a social link
  const removeSocialLink = (id: string) => {
    updateContactInfo({
      socialLinks: contactInfo.socialLinks.filter(link => link.id !== id)
    });
  };

  // Get social icon based on platform
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return <Globe size={20} />;
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
            <Button variant="ghost" size="sm" onClick={addSocialLink}>
              <Plus size={16} className="mr-2" />
              Add Social Link
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleEditing}>
              <Edit size={16} className="mr-2" />
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  value={contactInfo.email || ''}
                  onChange={(e) => updateContactInfo({ email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={contactInfo.phone || ''}
                  onChange={(e) => updateContactInfo({ phone: e.target.value })}
                  placeholder="+1 (123) 456-7890"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-location">Location</Label>
                <Input
                  id="contact-location"
                  value={contactInfo.location || ''}
                  onChange={(e) => updateContactInfo({ location: e.target.value })}
                  placeholder="City, Country"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-website">Website</Label>
                <Input
                  id="contact-website"
                  value={contactInfo.website || ''}
                  onChange={(e) => updateContactInfo({ website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contact-message">Contact Message</Label>
              <Textarea
                id="contact-message"
                value={contactInfo.message || ''}
                onChange={(e) => updateContactInfo({ message: e.target.value })}
                placeholder="Feel free to reach out to me for collaborations or opportunities."
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Social Links</h4>
              {contactInfo.socialLinks.length === 0 ? (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-gray-500 mb-2">No social links added yet</p>
                  <Button variant="outline" size="sm" onClick={addSocialLink}>
                    <Plus size={16} className="mr-2" />
                    Add Social Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactInfo.socialLinks.map(link => (
                    <div key={link.id} className="flex items-center space-x-3">
                      <Select
                        value={link.platform}
                        onValueChange={(value: string) => updateSocialLink(link.id, { platform: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://platform.com/username"
                        className="flex-1"
                      />
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSocialLink(link.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`${section.layout === 'two-columns' ? 'grid grid-cols-2 gap-6' : 'space-y-6'}`}>
            <div>
              {(contactInfo.message || (!contactInfo.email && !contactInfo.phone && !contactInfo.location && !contactInfo.website)) && (
                <div className="mb-6">
                  {contactInfo.message ? (
                    <p className="text-gray-600">{contactInfo.message}</p>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Click Edit to add your contact information</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                {contactInfo.email && (
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <a href={`mailto:${contactInfo.email}`} className="text-gray-800 hover:text-primary">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {contactInfo.phone && (
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <a href={`tel:${contactInfo.phone}`} className="text-gray-800 hover:text-primary">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {contactInfo.location && (
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="text-gray-800">{contactInfo.location}</div>
                    </div>
                  </div>
                )}
                
                {contactInfo.website && (
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Globe size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <a 
                        href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-primary"
                      >
                        {contactInfo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {contactInfo.socialLinks.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Connect With Me</h4>
                <div className="flex flex-wrap gap-3">
                  {contactInfo.socialLinks.map(link => (
                    <a
                      key={link.id}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
