import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from "@/services/useApi";
import {AddBasketDto, BasketDto, GetMenuResult, UpdateBasketDto} from "@/services/digimal";
import {useDispatch} from "react-redux";

interface IBasketState {
    basket: BasketDto
}
export const getBasket = createAsyncThunk<BasketDto>('basket/get',async ()=>{
    const {data} = await api.BasketApi.apiServicesAppBasketGetBasketGet()
    const {result}: any = data as BasketDto
    return result
})
export const addBasket = createAsyncThunk('basket/add', async (data: AddBasketDto, thunkAPI) => {
    await api.BasketApi.apiServicesAppBasketAddBasketItemPost(data);
    return thunkAPI.dispatch(getBasket()); // بازگشت نتیجه به عنوان Promise
});

export const updateBasketItem = createAsyncThunk('basket/update', async (data: UpdateBasketDto, thunkAPI) => {
    await api.BasketApi.apiServicesAppBasketUpdateBasketItemCountPut(data);
    return thunkAPI.dispatch(getBasket());
});

export const deleteBasketItem = createAsyncThunk('basket/delete', async (id: number, thunkAPI) => {
    await api.BasketApi.apiServicesAppBasketDeleteBasketItemDelete(id);
    return thunkAPI.dispatch(getBasket());
});
const initialState: IBasketState = {
    basket: {},
};
export const basket = createSlice({
    name: 'basket',
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder
            .addCase(getBasket.fulfilled, (state,action: PayloadAction<BasketDto>) =>{
                console.log(action.payload)
                state.basket = action.payload
            })
    }
});
export default basket.reducer;