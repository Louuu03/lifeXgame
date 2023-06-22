import '../styles/AuthPage.scss';
import Lang from '../languages';
import firebaseConfig from '../firebaseConfig';
import { setUserInfos } from '../redux/reducers/userSlice';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Box,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';
import  { useDispatch } from 'react-redux';

/**type */
type Infos = {
  user: string;
  email: string;
  password: string;
};

/** Props */
function InputProps(index: number) {
  return {
    id: `tab-${index}`,
    className: 'InputArea',
  };
}

/** The authentication page for user */
function AuthPage(): JSX.Element {
  /** Stores current selected tab value.
   * 0: Log In | 1: Sign In  */
  const [tab, setTab] = useState<number>(0);
  /** Stores whether show password or not */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  /** Stores whether the toast opens or not, and success or not. *
   * 0: closed | 1: success | 2:failed */
  const [toast, setToast] = useState<number>(0);

  const dispatch = useDispatch();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Infos>();

  /** Function to handle tab changes*/
  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {
    setTab(newValue);
  };
  /** Function to handle password visibility */
  const handlePasswordVisibility = (
    event: React.SyntheticEvent<Element, Event>,
  ) => {
    setShowPassword(!showPassword);
  };
  /** Function to close toast */
  const handleToastClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    setToast(0);
  };
  /** Function to handle submission */
  const onSubmit: SubmitHandler<Infos> = (data: Infos) => {
    tab === 0
      ? signInWithEmailAndPassword(auth, data.email, data.password)
          .then((userCredential) => {
            console.log(userCredential);
            getDoc(doc(db, 'BasicInfo', userCredential.user.uid))
              .then((res) => {setToast(1);
                dispatch(setUserInfos({user:res.data()?.Name||null, id:userCredential.user.uid}));
              })
              .catch(() => setToast(2));
          })
          .catch((error) => {
            setToast(2);
          })
      : createUserWithEmailAndPassword(auth, data.email, data.password)
          .then((userCredential) => {
            setDoc(doc(db, 'BasicInfo', userCredential.user.uid), {
              user: data.user,
            })
              .then(() => {
                setToast(1);
                dispatch(setUserInfos({user:data.user, id:userCredential.user.uid}));
              })
              .catch((error) => setToast(2));
            // ...
          })
          .catch((error) => {
            setToast(2);
          });
  };

  return (
    <Box className="AuthPage FullPageBox">
      <Box className="Title">
        <img
          className="Icon"
          src={require('../assets/Image/Icon.png')}
          alt="Icon"
        />
        <h1>Life X Game</h1>
      </Box>
      <Box className="InputField">
        <Box className="TabBar">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>
        <Box className="InputComponents">
          {tab === 1 ? (
            <TextField
              required
              error={!!errors.user}
              helperText={errors.user?.message}
              label="Name"
              {...InputProps(3)}
              type="text"
              {...register('user', {
                required: Lang.errorMsg.required.eng,
                minLength: {
                  value: 2,
                  message:
                    Lang.errorMsg.minWord.eng[0] +
                    '2' +
                    Lang.errorMsg.minWord.eng[1],
                },
              })}
            />
          ) : null}
          <TextField
            required
            error={!!errors.email}
            helperText={errors.email?.message}
            label="Email Account"
            {...InputProps(0)}
            type="email"
            {...register('email', { required: Lang.errorMsg.required.eng })}
          />
          <TextField
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            label="Password"
            {...InputProps(1)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: Lang.errorMsg.required.eng,
              minLength: {
                value: 8,
                message:
                  Lang.errorMsg.minWord.eng[0] +
                  '8' +
                  Lang.errorMsg.minWord.eng[1],
              },
            })}
          />
        </Box>
        <Box>
          <Button className="SubmitBtn" onClick={handleSubmit(onSubmit)}>
            {tab === 0
              ? Lang.authentication.logIn.eng
              : Lang.authentication.signIn.eng}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={toast !== 0}
        autoHideDuration={1500}
        onClose={handleToastClose}
      >
        <Alert
          severity={toast === 1 ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {toast === 1 &&
            (tab === 0
              ? Lang.authentication.logInSuccess.eng
              : Lang.authentication.signInSuccess.eng)}
          {toast === 2 &&
            (tab === 0
              ? Lang.authentication.logInFailure.eng
              : Lang.authentication.signInFailuire.eng)}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AuthPage;
