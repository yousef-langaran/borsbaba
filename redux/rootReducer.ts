import { combineReducers } from '@reduxjs/toolkit';
import menu from './reducers/menu';
import auth from './reducers/auth';
import basket from './reducers/basket';

const rootReducer = combineReducers({
    menu: menu,
    auth: auth,
    basket: basket
});

export default rootReducer;