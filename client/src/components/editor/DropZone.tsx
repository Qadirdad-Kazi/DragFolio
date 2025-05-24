import { useDrop } from "react-dnd";
import { Box, SxProps, Theme } from "@mui/material";
import { BlockType } from "../../types/block";

interface DropZoneProps {
  onDrop: (type: BlockType) => void;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

export default function DropZone({ onDrop, sx = {}, children }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "BLOCK",
    drop: (item: { type: BlockType }) => {
      onDrop(item.type);
      return { name: "Canvas" };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <Box
      ref={drop}
      sx={{
        ...(isActive && {
          border: '2px dashed',
          borderColor: 'primary.main',
          bgcolor: 'primary.light',
          opacity: 0.1
        }),
        transition: 'all 0.2s ease',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}
