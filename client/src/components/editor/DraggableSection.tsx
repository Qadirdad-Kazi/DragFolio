import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { PortfolioSection } from '@/types';
import { GripVertical } from 'lucide-react';

// Define the item type for DnD
export const SECTION_ITEM_TYPE = 'SECTION';

// Define the drag item structure
interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableSectionProps {
  section: PortfolioSection;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  isSelected,
  onSelect,
  onRemove,
  moveSection,
  children
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Set up drop functionality
  const [{ handlerId }, drop] = useDrop({
    accept: SECTION_ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSection(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Set up drag functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: SECTION_ITEM_TYPE,
    item: () => {
      return { id: section.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Initialize drag and drop refs
  drag(drop(ref));

  // Apply styles for dragging state
  const opacity = isDragging ? 0.4 : 1;

  return (
    <div 
      ref={ref} 
      style={{ opacity }} 
      className={`draggable-section relative mb-2 ${isSelected ? 'ring-2 ring-primary' : 'border border-gray-200'} rounded-md overflow-hidden`}
      onClick={onSelect}
      data-handler-id={handlerId}
    >
      <div className="drag-handle absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-move bg-gray-100 hover:bg-gray-200 transition-colors">
        <GripVertical size={16} className="text-gray-500" />
      </div>
      
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
};

export default DraggableSection;
