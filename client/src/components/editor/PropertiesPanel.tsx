import { useState } from 'react';
import { Block } from '../../types/block';
import { getBlockLabels } from '../../lib/blockTypes';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface PropertiesPanelProps {
  selectedBlock: Block;
  onUpdateBlock: (content: any) => void;
}

export default function PropertiesPanel({ selectedBlock, onUpdateBlock }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState(0); // 0 for content, 1 for style
  const blockLabel = getBlockLabels(selectedBlock.type);
  
  // Function to update a specific content field
  const updateContent = (field: string, value: any) => {
    const updatedContent = {
      ...selectedBlock.content,
      [field]: value
    };
    onUpdateBlock(updatedContent);
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Render content fields based on block type
  const renderContentFields = () => {
    switch (selectedBlock.type) {
      case "about":
        return (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Section Title</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.title || "About Me"} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Bio</Typography>
              <TextField 
                fullWidth
                multiline
                rows={4}
                size="small"
                value={selectedBlock.content.content || selectedBlock.content.bio || ""} 
                onChange={(e) => updateContent("content", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Profile Image URL</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.imageUrl || ""} 
                onChange={(e) => updateContent("imageUrl", e.target.value)}
                placeholder="https://example.com/profile.jpg"
              />
              {selectedBlock.content.imageUrl && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={selectedBlock.content.imageUrl} 
                    alt="Profile Preview" 
                    style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        );
        
      case "projects":
        return (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Section Title</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.title || "Projects"} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Description</Typography>
              <TextField 
                fullWidth
                multiline
                rows={2}
                size="small"
                value={selectedBlock.content.description || ""} 
                onChange={(e) => updateContent("description", e.target.value)}
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Projects</Typography>
              <Stack spacing={2}>
                {selectedBlock.content.projects?.map((project: any, index: number) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <TextField 
                        fullWidth
                        size="small"
                        label="Project Title"
                        value={project.title} 
                        onChange={(e) => {
                          const updatedProjects = [...selectedBlock.content.projects];
                          updatedProjects[index] = { ...project, title: e.target.value };
                          updateContent("projects", updatedProjects);
                        }}
                        placeholder="Project title"
                      />
                      <TextField 
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        label="Project Description"
                        value={project.description} 
                        onChange={(e) => {
                          const updatedProjects = [...selectedBlock.content.projects];
                          updatedProjects[index] = { ...project, description: e.target.value };
                          updateContent("projects", updatedProjects);
                        }}
                        placeholder="Project description"
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            const updatedProjects = [...selectedBlock.content.projects];
                            updatedProjects.splice(index, 1);
                            updateContent("projects", updatedProjects);
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
                
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const updatedProjects = [...(selectedBlock.content.projects || [])];
                    updatedProjects.push({ title: "New Project", description: "Project description" });
                    updateContent("projects", updatedProjects);
                  }}
                >
                  Add Project
                </Button>
              </Stack>
            </Box>
          </Stack>
        );
      
      case "skills":
        return (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Section Title</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.title || "Skills"} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Skills</Typography>
              <Stack spacing={1}>
                {selectedBlock.content.skills?.map((skill: string, index: number) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                      fullWidth
                      size="small"
                      value={skill} 
                      onChange={(e) => {
                        const updatedSkills = [...selectedBlock.content.skills];
                        updatedSkills[index] = e.target.value;
                        updateContent("skills", updatedSkills);
                      }}
                    />
                    <IconButton 
                      color="error"
                      size="small"
                      onClick={() => {
                        const updatedSkills = [...selectedBlock.content.skills];
                        updatedSkills.splice(index, 1);
                        updateContent("skills", updatedSkills);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const updatedSkills = [...(selectedBlock.content.skills || [])];
                    updatedSkills.push("New Skill");
                    updateContent("skills", updatedSkills);
                  }}
                >
                  Add Skill
                </Button>
              </Stack>
            </Box>
          </Stack>
        );
      
      case "contact":
        return (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Section Title</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.title || "Contact"} 
                onChange={(e) => updateContent("title", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Message</Typography>
              <TextField 
                fullWidth
                multiline
                rows={3}
                size="small"
                value={selectedBlock.content.message || ""} 
                onChange={(e) => updateContent("message", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Email</Typography>
              <TextField 
                fullWidth
                type="email"
                size="small"
                value={selectedBlock.content.email || ""} 
                onChange={(e) => updateContent("email", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Location</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.location || ""} 
                onChange={(e) => updateContent("location", e.target.value)}
              />
            </Box>
          </Stack>
        );
      
      case "text":
        return (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Text Content</Typography>
              <TextField 
                fullWidth
                multiline
                rows={6}
                size="small"
                value={selectedBlock.content.content || ""} 
                onChange={(e) => updateContent("content", e.target.value)}
              />
            </Box>
          </Stack>
        );
      
      case "image":
        return (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Image URL</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.src || ""} 
                onChange={(e) => updateContent("src", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Alt Text</Typography>
              <TextField 
                fullWidth
                size="small"
                value={selectedBlock.content.alt || ""} 
                onChange={(e) => updateContent("alt", e.target.value)}
              />
            </Box>
            {selectedBlock.content.src && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <img 
                  src={selectedBlock.content.src} 
                  alt={selectedBlock.content.alt || "Preview"} 
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                />
              </Box>
            )}
          </Stack>
        );
      
      default:
        return (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">No editable properties for this block type.</Typography>
          </Box>
        );
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>{blockLabel} Properties</Typography>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Content" />
          <Tab label="Style" />
        </Tabs>
      </Box>
      
      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 0 ? (
          renderContentFields()
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">Style properties coming soon!</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
