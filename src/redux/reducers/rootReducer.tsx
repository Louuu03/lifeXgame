// src/redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const rootReducer = combineReducers({
    userInfos: userReducer,
});

export default rootReducer;
