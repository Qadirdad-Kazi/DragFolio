import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress
} from "@mui/material";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category?: string;
}

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
  isLoading?: boolean;
}

export default function TemplateCard({ template, onSelect, isLoading }: TemplateCardProps) {
  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
          borderColor: 'primary.main'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={template.thumbnail}
          alt={`${template.name} template`}
          sx={{ 
            aspectRatio: '4/3',
            objectFit: 'cover'
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
            bgcolor: 'rgba(0,0,0,0)',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.05)'
            }
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1
              },
              '.MuiBox-root:hover &': {
                opacity: 1
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
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {template.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {template.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          fullWidth
          onClick={onSelect}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : "Select Template"}
        </Button>
      </CardActions>
    </Card>
  );
}
