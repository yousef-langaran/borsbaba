import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from "@/services/useApi";
import {GetMenuResult} from "@/services/digimal";

interface IMenuState {
    items: GetMenuResult[] | []
}
export const fetchMenu = createAsyncThunk<GetMenuResult[]>('menu/get',async ()=>{
    const {data} = await api.MenuApi.apiServicesAppMenuGetAllGet()
    const {result}: any = data as GetMenuResult[]
    return result
})
const initialState: IMenuState = {
    items: [],
};
export const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchMenu.fulfilled, (state,action: PayloadAction<GetMenuResult[]>) =>{
                state.items = action.payload
            })
    }
});
export default menu.reducer;