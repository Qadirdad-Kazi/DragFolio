import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SectionType } from "@/types";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get default title for a section based on its type
 */
export function getDefaultTitle(type: SectionType): string {
  switch (type) {
    case 'about':
      return 'About Me';
    case 'projects':
      return 'My Projects';
    case 'skills':
      return 'Skills & Expertise';
    case 'resume':
      return 'Experience & Education';
    case 'testimonials':
      return 'Testimonials';
    case 'blog':
      return 'Blog & Articles';
    case 'contact':
      return 'Contact Me';
    default:
      return 'New Section';
  }
}

/**
 * Get default content for a section based on its type
 */
export function getDefaultContent(type: SectionType): any {
  switch (type) {
    case 'about':
      return {
        headline: 'Web Developer & Designer',
        bio: 'I am a passionate web developer with experience in creating responsive and user-friendly websites.',
        image: ''
      };
    case 'projects':
      return {
        projects: []
      };
    case 'skills':
      return {
        skills: [
          { id: '1', name: 'HTML/CSS', level: 90 },
          { id: '2', name: 'JavaScript', level: 85 },
          { id: '3', name: 'React', level: 80 }
        ]
      };
    case 'resume':
      return {
        experience: [],
        education: []
      };
    case 'testimonials':
      return {
        testimonials: []
      };
    case 'blog':
      return {
        posts: []
      };
    case 'contact':
      return {
        email: '',
        phone: '',
        location: '',
        website: '',
        message: 'Feel free to reach out to me for collaborations or opportunities.',
        socialLinks: []
      };
    default:
      return {};
  }
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
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
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Reorder an array of items
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch (error) {
    return false;
  }
}
