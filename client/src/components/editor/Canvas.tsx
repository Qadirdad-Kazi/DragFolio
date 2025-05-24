import { useMemo } from "react";
import { useDrop } from "react-dnd";
import { Block, BlockType } from "@/types/block";
import AboutBlock from "@/components/blocks/AboutBlock";
import ProjectsBlock from "@/components/blocks/ProjectsBlock";
import SkillsBlock from "@/components/blocks/SkillsBlock";
import ContactBlock from "@/components/blocks/ContactBlock";
import ImageBlock from "@/components/blocks/ImageBlock";
import TextBlock from "@/components/blocks/TextBlock";
import SocialLinksBlock from "@/components/blocks/SocialLinksBlock";
import ExperienceBlock from "@/components/blocks/ExperienceBlock";
import ResumeBlock from "@/components/blocks/ResumeBlock";
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Stack,
  Container
} from "@mui/material";
import {
  Edit as PencilIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Delete as TrashIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface PortfolioContent {
  blocks: Block[];
}

interface CanvasProps {
  content: PortfolioContent;
  selectedBlock: Block | null;
  setSelectedBlock: (block: Block | null) => void;
  deviceView: "mobile" | "tablet" | "desktop";
  onUpdateBlock: (block: Block) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
}

export default function Canvas({
  content,
  selectedBlock,
  setSelectedBlock,
  deviceView,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}: CanvasProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "BLOCK",
    drop: () => ({ name: "Canvas" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Determine canvas width based on device view
  const canvasWidth = useMemo(() => {
    switch (deviceView) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
      default:
        return "1024px";
    }
  }, [deviceView]);

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlock?.id === block.id;
    
    const blockProps = {
      key: block.id,
      data: block,
      isSelected,
      onSelect: () => setSelectedBlock(block),
      onUpdate: onUpdateBlock,
    };
    
    switch (block.type) {
      case "about":
        return <AboutBlock {...blockProps} />;
      case "projects":
        return <ProjectsBlock {...blockProps} />;
      case "skills":
        return <SkillsBlock {...blockProps} />;
      case "contact":
        return <ContactBlock {...blockProps} />;
      case "image":
        return <ImageBlock {...blockProps} />;
      case "text":
        return <TextBlock {...blockProps} />;
      case "social":
        return <SocialLinksBlock {...blockProps} />;
      case "experience":
        return <ExperienceBlock {...blockProps} />;
      case "resume":
        return <ResumeBlock {...blockProps} />;
      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <Box 
      ref={drop} 
      sx={{ 
        p: 3, 
        height: '100%',
        backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}
    >
      <Paper 
        sx={{ 
          width: canvasWidth, 
          mx: 'auto',
          minHeight: '800px', 
          position: 'relative',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 1,
          border: 1,
          borderColor: 'divider'
        }}
      >
        {content.blocks.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center', 
            p: 4 
          }}>
            <SettingsIcon sx={{ width: 64, height: 64, color: 'action.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              No content yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Drag and drop blocks from the left sidebar to start building your portfolio.
            </Typography>
          </Box>
        ) : (
          <Box>
            {content.blocks.map((block, index) => (
              <Box key={block.id} sx={{ position: 'relative' }}>
                {renderBlock(block)}
                
                {/* Block controls - only visible when block is selected */}
                {selectedBlock?.id === block.id && (
                  <motion.div 
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 4
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index > 0 && (
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                        onClick={() => onMoveBlock(block.id, "up")}
                      >
                        <ArrowUpIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    {index < content.blocks.length - 1 && (
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                        onClick={() => onMoveBlock(block.id, "down")}
                      >
                        <ArrowDownIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                    <IconButton
                      size="small"
                      sx={{ bgcolor: 'background.paper', color: 'error.main' }}
                      onClick={() => onDeleteBlock(block.id)}
                    >
                      <TrashIcon fontSize="small" />
                    </IconButton>
                  </motion.div>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
