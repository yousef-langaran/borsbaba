import { combineReducers } from '@reduxjs/toolkit';
import menu from './reducers/menu';
import auth from './reducers/auth';

const rootReducer = combineReducers({
    menu: menu,
    auth: auth,
});

export default rootReducer;