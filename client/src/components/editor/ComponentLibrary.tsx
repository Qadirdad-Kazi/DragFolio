import React from 'react';
import { Block } from '../../shared/schema';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LayoutGrid } from 'lucide-react';
import DraggableItem from './DraggableItem';
import { BLOCK_TYPES } from '../../lib/blockTypes';

interface ComponentLibraryProps {
  onAddBlock: (block: Block) => void;
}

interface TemplatePreview {
  id: string;
  name: string;
  thumbnail: string;
}

// Example templates
const templates: TemplatePreview[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=169&q=80"
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    thumbnail: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=169&q=80"
  },
  {
    id: "creative-grid",
    name: "Creative Grid",
    thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=169&q=80"
  }
];

export default function ComponentLibrary({ onAddBlock }: ComponentLibraryProps) {
  return (
    <div className="component-library">
      <Tabs defaultValue="blocks">
        <TabsList className="tab-list">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="templates-tab">
          <h2 className="section-title">TEMPLATES</h2>
          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-thumbnail">
                  <img 
                    src={template.thumbnail} 
                    alt={`${template.name} template`} 
                    className="thumbnail-image" 
                  />
                </div>
                <p className="template-name">{template.name}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="blocks" className="blocks-tab">
          <h2 className="section-title">BLOCKS</h2>
          <div className="blocks-list">
            {BLOCK_TYPES.map(blockType => (
              <DraggableItem
                key={blockType.type}
                type={blockType.type}
                label={blockType.label}
                icon={blockType.icon}
                onAddBlock={onAddBlock}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
