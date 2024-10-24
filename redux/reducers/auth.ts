import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface IAuthState {
    token: string | null | undefined
}

const initialState: IAuthState = {
    token: null
};
export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<string>) {
            state.token = action.payload;
            Cookies.set('token', action.payload, { expires: 7 });
        },
        logout(state) {
            state.token = null;
            Cookies.remove('token');
        },
        checkToken(state){
            state.token = Cookies.get('token') as string
        }
    },
});
export const { login, logout, checkToken } = auth.actions;
export default auth.reducer;