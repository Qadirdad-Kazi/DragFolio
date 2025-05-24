import { useDrag } from "react-dnd";
import { Block, BlockType } from "../../types/block";
import { nanoid } from "nanoid";
import { getDefaultBlockContent } from "../../lib/blockTypes";
import { Paper, Box, Typography } from "@mui/material";

interface DraggableItemProps {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  onAddBlock: (block: Block) => void;
}

export default function DraggableItem({ type, label, icon, onAddBlock }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BLOCK",
    item: { type },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ name: string }>();
      if (item && dropResult && dropResult.name === "Canvas") {
        // Create a new block with default content
        const newBlock: Block = {
          id: nanoid(),
          type,
          content: getDefaultBlockContent(type),
          position: 0, // Will be updated by the editor component
          styles: {
            layout: "row",
            padding: 24,
            margin: 0,
            unit: "px",
          },
          settings: {
            animation: "none",
            showOnMobile: true,
            enableHoverEffects: true,
          },
        };
        
        onAddBlock(newBlock);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      handlerId: monitor.getHandlerId() as string | null,
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <Paper
      ref={drag}
      elevation={isDragging ? 3 : 1}
      sx={{
        p: 1.5,
        border: 1,
        borderColor: isDragging ? 'primary.main' : 'divider',
        bgcolor: isDragging ? 'primary.light' : 'background.paper',
        display: 'flex',
        alignItems: 'center',
        cursor: 'grab',
        opacity,
        '&:hover': {
          borderColor: 'primary.main'
        },
        transition: 'all 0.2s ease'
      }}
      onClick={() => {
        // Also support click to add (for mobile users)
        const newBlock: Block = {
          id: nanoid(),
          type,
          content: getDefaultBlockContent(type),
          position: 0, // Will be updated by the editor component
          styles: {
            layout: "row",
            padding: 24,
            margin: 0,
            unit: "px",
          },
          settings: {
            animation: "none",
            showOnMobile: true,
            enableHoverEffects: true,
          },
        };
        
        onAddBlock(newBlock);
      }}
    >
      <Box sx={{ color: 'text.secondary', mr: 1.5 }}>{icon}</Box>
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );
}
