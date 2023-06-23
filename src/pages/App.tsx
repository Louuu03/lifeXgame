import React, { useEffect } from 'react';
import AuthPage from './AuthPage';
import Home from './Home';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfos } from '../redux/reducers/userSlice';

function App(): JSX.Element {
  const dispatch = useDispatch();
  const userInfos = useSelector(
    (state: {
      userInfos: {
        userInfos: {
          user: string;
          id: string;
        };
      };
    }) => state.userInfos.userInfos,
  );

  //check local storage if the user is logged in 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch(setUserInfos(user));
    }
  }, []);
  return (
    <Box className="App FullPageBox">
      {userInfos.user && userInfos.id ? <Home /> : <AuthPage />}
    </Box>
  );
}

export default App;
