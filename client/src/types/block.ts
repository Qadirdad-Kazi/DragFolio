// Define block types
export type BlockType = 'about' | 'projects' | 'skills' | 'contact' | 'text' | 'image' | 'resume' | 'testimonials' | 'blog' | 'services' | 'gallery';

// Define block interface
export interface Block {
  id: string;
  type: BlockType;
  content: any;
  position: number;
  styles: {
    layout: string;
    padding: number;
    margin: number;
    unit: string;
  };
  settings: {
    animation: string;
    showOnMobile: boolean;
    enableHoverEffects: boolean;
    [key: string]: any;
  };
}
