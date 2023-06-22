import React from 'react';
import AuthPage from './AuthPage';
import Home from './Home';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';


function App(): JSX.Element {
  const userInfos = useSelector((state: {
    userInfos: any;user:string, id:string
}) => state.userInfos.userInfos);
  return (
    <Box className="App FullPageBox">
      { (userInfos.user&&userInfos.id)?<Home />: <AuthPage />}
    </Box>
  );
}

export default App;
