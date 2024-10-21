import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './reducers/menu';

const rootReducer = combineReducers({
    menu: counterReducer,
});

export default rootReducer;