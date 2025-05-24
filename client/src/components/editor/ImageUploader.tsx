import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { uploadApi } from '@/services/api';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  currentImage,
  onImageUpload,
  label = 'Image',
  className = ''
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    // Create a preview URL for immediate feedback
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Upload the image to the server
      const response = await uploadApi.uploadImage(file);
      
      // Use the real URL returned from the server
      onImageUpload(response.imageUrl);
      
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(objectUrl);
      
      // Set the preview to the actual URL from the server
      setPreviewUrl(response.imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image. Please try again.');
      
      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);
      
      // Clear the preview if there was an error
      if (!currentImage) {
        setPreviewUrl(null);
      } else {
        setPreviewUrl(currentImage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Clear the selected image
  const handleClearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload('');
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
      )}

      <Stack spacing={2} alignItems="center">
        {/* Image preview area */}
        {previewUrl ? (
          <Box sx={{ position: 'relative', width: '100%', mb: 1 }}>
            <Paper 
              variant="outlined" 
              sx={{ 
                aspectRatio: '16/9', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover'
              }}
            >
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </Paper>
            <IconButton
              size="small"
              onClick={handleClearImage}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
              }}
              aria-label="Remove image"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Paper 
            variant="outlined" 
            onClick={handleButtonClick}
            sx={{ 
              width: '100%', 
              aspectRatio: '16/9',
              border: '2px dashed',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
              mb: 1
            }}
          >
            <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary" align="center">
              Click to upload an image
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              JPEG, PNG, GIF or WEBP (max 5MB)
            </Typography>
          </Paper>
        )}

        {/* Error message */}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {/* Upload button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label="Upload image"
          />
          
          <Button
            variant={previewUrl ? "outlined" : "contained"}
            onClick={handleButtonClick}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={16} /> : <UploadIcon />}
          >
            {isUploading ? 'Uploading...' : (previewUrl ? 'Change Image' : 'Upload Image')}
          </Button>
          
          {previewUrl && (
            <Button
              variant="outlined"
              onClick={handleClearImage}
              disabled={isUploading}
              startIcon={<CloseIcon />}
            >
              Remove
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
