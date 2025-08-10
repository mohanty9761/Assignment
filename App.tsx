import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import FormBuilder from "./routes/create";
import Preview from "./routes/preview";
import MyForms from "./routes/myforms";

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Form Builder App
          </Typography>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<FormBuilder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
