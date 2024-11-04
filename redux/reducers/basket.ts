import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from "@/services/useApi";
import {AddBasketDto, BasketDto, GetMenuResult, UpdateBasketDto} from "@/services/digimal";

interface IBasketState {
    basket: BasketDto
}
export const getBasket = createAsyncThunk<BasketDto>('basket/get',async ()=>{
    const {data} = await api.BasketApi.apiServicesAppBasketGetBasketGet()
    const {result}: any = data as BasketDto
    return result
})
export const addBasket = createAsyncThunk('basket/get',async (data:AddBasketDto)=>{
    await api.BasketApi.apiServicesAppBasketAddBasketItemPost(data)
    getBasket()
})
export const updateBasketItem = createAsyncThunk('basket/get',async (data:UpdateBasketDto)=>{
    await api.BasketApi.apiServicesAppBasketUpdateBasketItemCountPut(data)
    getBasket()
})
export const deleteBasketItem = createAsyncThunk('basket/get',async (id:number)=>{
    await api.BasketApi.apiServicesAppBasketDeleteBasketItemDelete(id)
    getBasket()
})
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
                state.basket = action.payload
            })
    }
});
export default basket.reducer;