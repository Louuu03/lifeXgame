import '../styles/HomePage.scss';

import React from 'react';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

function HomePage(): JSX.Element {
  return (
    <Box className="HomePage FullPageBox">
      <AppBar className="Bar" position="fixed" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton aria-label="open drawer"></IconButton>
          <Fab className="AddIcon" aria-label="add">
            <AddIcon />
          </Fab>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default HomePage;
