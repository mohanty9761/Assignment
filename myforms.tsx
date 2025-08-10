// src/pages/MyForms.tsx
import React, { useEffect, useState } from "react";
import { ListItem,Typography,Box,List,Paper,Divider, ListItemText, ListItemButton } from "@mui/material";
//import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SavedForm {
  id: string;
  name: string;
  createdAt: string;
  schema: any;
}

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<SavedForm[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    setForms(storedForms);
  }, []);

  const handleFormClick = (formId: string) => {
    navigate(`/preview/${formId}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Forms
      </Typography>

      {forms.length === 0 ? (
        <Typography color="text.secondary">No forms saved yet.</Typography>
      ) : (
        <Paper elevation={3}>
          <List>
            {forms.map((form, index) => (
              <React.Fragment key={form.id}>
                <ListItem disablePadding>
  <ListItemButton
    onClick={() => handleFormClick(form.id)}
    sx={{
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    }}
  >
    <ListItemText
      primary={form.name}
      secondary={`Created: ${new Date(form.createdAt).toLocaleString()}`}
    />
  </ListItemButton>
</ListItem>
                {index < forms.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default MyForms;
