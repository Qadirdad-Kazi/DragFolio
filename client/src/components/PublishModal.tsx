import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  InputAdornment,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Divider
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioName: string;
  portfolioSlug: string;
  isPublic: boolean;
  onPublish: (data: { slug: string; isPublic: boolean }) => void;
  isPending: boolean;
}

export default function PublishModal({
  isOpen,
  onClose,
  portfolioName,
  portfolioSlug,
  isPublic,
  onPublish,
  isPending,
}: PublishModalProps) {
  const [slug, setSlug] = useState(portfolioSlug);
  const [publishOption, setPublishOption] = useState<"subdomain" | "export">("subdomain");
  const [makePublic, setMakePublic] = useState(isPublic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish({
      slug,
      isPublic: makePublic,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={isPending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Publish Portfolio</Typography>
        <IconButton onClick={onClose} disabled={isPending} size="small" edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined">
              <FormLabel htmlFor="slug" sx={{ mb: 1 }}>Portfolio URL</FormLabel>
              <TextField
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="text.secondary" variant="body2">
                        portfolioapp.com/
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                size="small"
              />
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1 }}>Publish Options</FormLabel>
              <RadioGroup
                value={publishOption}
                onChange={(e) => setPublishOption(e.target.value as "subdomain" | "export")}
              >
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderColor: publishOption === "subdomain" ? 'primary.main' : 'divider',
                    bgcolor: publishOption === "subdomain" ? 'primary.light' : 'background.paper',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <FormControlLabel
                    value="subdomain"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1">Custom Subdomain</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Publish to {slug}.portfolioapp.com
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>

                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderColor: publishOption === "export" ? 'primary.main' : 'divider',
                    bgcolor: publishOption === "export" ? 'primary.light' : 'background.paper',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <FormControlLabel
                    value="export"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1">Export as HTML</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Download as a zip file to host anywhere
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={makePublic}
                  onChange={(e) => setMakePublic(e.target.checked)}
                />
              }
              label="Make portfolio public in our gallery"
            />
          </Box>
        </DialogContent>

        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose}
            disabled={isPending}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : null}
          >
            {isPending ? "Publishing..." : "Publish Now"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
