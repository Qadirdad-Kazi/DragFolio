import { useState } from 'react';
import { PortfolioSection } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram, Youtube, Check, ArrowUp, ArrowDown } from 'lucide-react';
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
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function ContactSection({
  section,
  isSelected,
  onSelect,
  updateSection,
  onMoveUp,
  onMoveDown
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
            onClick={addSocialLink}
            className="h-10 w-10 rounded-full shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Add Social Link"
          >
            <Plus size={18} className="text-blue-600" />
          </Button>
        </div>
      )}

      <CardContent>
        {isEditing ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contact-email" className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</Label>
                <div className="flex items-center mt-1">
                  <Mail size={18} className="mr-2 text-gray-500" />
                  <Input
                    id="contact-email"
                    value={contactInfo.email || ''}
                    onChange={(e) => updateContactInfo({ email: e.target.value })}
                    className="border-gray-300 dark:border-gray-700"
                    placeholder="you@example.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Primary contact email</p>
              </div>

              <div>
                <Label htmlFor="contact-phone" className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone Number</Label>
                <div className="flex items-center mt-1">
                  <Phone size={18} className="mr-2 text-gray-500" />
                  <Input
                    id="contact-phone"
                    value={contactInfo.phone || ''}
                    onChange={(e) => updateContactInfo({ phone: e.target.value })}
                    className="border-gray-300 dark:border-gray-700"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Optional contact number</p>
              </div>

              <div>
                <Label htmlFor="contact-location" className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Location</Label>
                <div className="flex items-center mt-1">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  <Input
                    id="contact-location"
                    value={contactInfo.location || ''}
                    onChange={(e) => updateContactInfo({ location: e.target.value })}
                    className="border-gray-300 dark:border-gray-700"
                    placeholder="City, Country"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Your current location</p>
              </div>

              <div>
                <Label htmlFor="contact-website" className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Website</Label>
                <div className="flex items-center mt-1">
                  <Globe size={18} className="mr-2 text-gray-500" />
                  <Input
                    id="contact-website"
                    value={contactInfo.website || ''}
                    onChange={(e) => updateContactInfo({ website: e.target.value })}
                    className="border-gray-300 dark:border-gray-700"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Personal website or portfolio link</p>
              </div>
            </div>

            <div>
              <Label htmlFor="contact-message" className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Custom Message</Label>
              <Textarea
                id="contact-message"
                value={contactInfo.message || ''}
                onChange={(e) => updateContactInfo({ message: e.target.value })}
                rows={3}
                className="mt-1 border-gray-300 dark:border-gray-700"
                placeholder="Feel free to reach out for collaborations or just a friendly hello!"
              />
              <p className="text-xs text-gray-500 mt-1">A welcoming message for visitors</p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 block">Social Profiles</Label>
              <div className="space-y-3">
                {contactInfo.socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-32">
                      <Select
                        value={link.platform}
                        onValueChange={(value) => updateSocialLink(link.id, { platform: value })}
                      >
                        <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                      placeholder="Profile URL"
                      className="h-9 border-gray-300 dark:border-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(link.id)}
                      className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSocialLink}
                  className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Plus size={14} className="mr-1" /> Add Social Profile
                </Button>
              </div>
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
