import {ProductApi, MenuApi, BasketApi, AddressApi, FactorApi} from './digimal/api'
import {TokenAuthApi} from './main/api'
import axios from "axios";
import Cookies from "js-cookie";
class UseApi {
    constructor() {
        axios.interceptors.request.use(function (config) {
            // config.headers['authorization'] = 'Bearer ' + Cookies.get('auth')
            // config.headers['UniqueId'] = Cookies.get('uniqueId')
            return config
        })
        axios.interceptors.response.use(function (response) {
            if (response.data?.result?.isSuccessful === false && response.data?.result?.message) {
                // toast.error(response.data.result.message, {
                //   autoClose: 5000,
                //   rtl:true
                // })
            } else if (response.data?.result?.isSuccessful === true && response.data?.result?.message) {
                // toast.success(response.data.result.message, {
                //   autoClose: 5000,
                //   rtl:true
                // })
            }
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
    }
    ProductApi = new ProductApi()
    MenuApi = new MenuApi()
    TokenAuthApi = new TokenAuthApi()
    BasketApi = new BasketApi()
    AddressApi = new AddressApi()
    FactorApi = new FactorApi()
}

const api = new UseApi()
export default api
