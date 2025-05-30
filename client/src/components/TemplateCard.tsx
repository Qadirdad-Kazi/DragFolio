import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  Tooltip,
  Divider,
  IconButton
} from "@mui/material";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category?: string;
  tags?: string[];
  sections?: { type: string }[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  popularity?: number;
}

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
  isLoading?: boolean;
  onPreview?: () => void;
  categoryColors?: Record<string, string>;
}

export default function TemplateCard({ template, onSelect, isLoading, onPreview, categoryColors }: TemplateCardProps) {
  // Default category colors if not provided
  const defaultCategoryColors: Record<string, string> = {
    developer: '#2196F3',
    designer: '#9C27B0',
    student: '#4CAF50',
    freelancer: '#FF9800',
    photographer: '#E91E63',
    writer: '#3F51B5',
    artist: '#795548',
    musician: '#009688',
    teacher: '#673AB7',
    entrepreneur: '#FF5722'
  };
  
  const colors = categoryColors || defaultCategoryColors;
  const categoryColor = template.category ? colors[template.category] || '#757575' : '#757575';
  
  // Difficulty colors
  const difficultyColors = {
    beginner: '#4CAF50',
    intermediate: '#FF9800',
    advanced: '#F44336'
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ height: '100%', display: 'flex' }}
    >
      <Card 
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 2,
          position: 'relative',
          '&:hover': {
            boxShadow: 6,
            '& .MuiCardMedia-root': {
              transform: 'scale(1.05)'
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            backgroundColor: categoryColor,
            zIndex: 1
          }
        }}
      >
      <Box sx={{ position: 'relative' }}>
        {template.category && (
          <Chip
            label={template.category.charAt(0).toUpperCase() + template.category.slice(1)}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
              backgroundColor: categoryColor,
              color: 'white',
              fontWeight: 'bold',
              boxShadow: 2
            }}
          />
        )}
        
        {template.difficulty && (
          <Tooltip title={`Difficulty: ${template.difficulty}`}>
            <Chip
              label={template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 2,
                backgroundColor: difficultyColors[template.difficulty],
                color: 'white',
                fontWeight: 'bold',
                boxShadow: 2
              }}
            />
          </Tooltip>
        )}
        
        <CardMedia
          component="img"
          image={template.thumbnail}
          alt={`${template.name} template`}
          sx={{ 
            aspectRatio: '16/9',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            height: 180,
            width: '100%'
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 'bold',
                boxShadow: 3,
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Use Template"}
            </Button>
            
            {onPreview && (
              <IconButton
                color="secondary"
                sx={{
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
              >
                <VisibilityIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        
        {template.popularity && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {template.popularity}+ users
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {template.name}
          </Typography>
          
          <Tooltip title="More information">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '2.5em'
          }}
        >
          {template.description}
        </Typography>
        
        {template.tags && template.tags.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {template.tags.slice(0, 3).map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    borderColor: 'primary.light',
                    color: 'primary.main'
                  }} 
                />
              ))}
              {template.tags.length > 3 && (
                <Chip 
                  label={`+${template.tags.length - 3}`} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    bgcolor: 'grey.100'
                  }} 
                />
              )}
            </Box>
          </Box>
        )}
        
        {template.sections && template.sections.length > 0 && (
          <Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Included sections:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {template.sections.slice(0, 4).map((section, index) => (
                <Chip 
                  key={index} 
                  label={section.type.charAt(0).toUpperCase() + section.type.slice(1)} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }} 
                />
              ))}
              {template.sections.length > 4 && (
                <Chip 
                  label={`+${template.sections.length - 4}`} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    bgcolor: 'grey.100'
                  }} 
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth
          onClick={onSelect}
          disabled={isLoading}
          sx={{
            borderRadius: '20px',
            py: 1,
            fontWeight: 'bold',
            boxShadow: 1,
            background: `linear-gradient(90deg, ${categoryColor || '#1976d2'} 0%, ${categoryColor ? categoryColor + '99' : '#42a5f5'} 100%)`,
            '&:hover': {
              boxShadow: 3,
              background: `linear-gradient(90deg, ${categoryColor || '#1976d2'} 30%, ${categoryColor ? categoryColor + '99' : '#42a5f5'} 100%)`
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Use This Template
            </motion.span>
          )}
        </Button>
      </CardActions>
    </Card>
    </motion.div>
  );
}
