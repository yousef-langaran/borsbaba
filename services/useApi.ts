import {ProductApi, MenuApi, BasketApi, AddressApi, FactorApi} from './digimal/api'
import {PageBuilderApi} from './admin/api'
import {TokenAuthApi} from './main/api'
import axios from "axios";
import Cookies from "js-cookie";
class UseApi {
    constructor() {
        if (!Cookies.get('UniqueId')) {
            const UID = Math.floor(Math.random() * 10 ** 16).toString().padStart(16, '0')
            Cookies.set('UniqueId',UID)
        }
        axios.interceptors.request.use(function (config) {
            config.headers['authorization'] = 'Bearer ' + Cookies.get('token')
            config.headers['UniqueId'] = Cookies.get('UniqueId')
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
            if (error.response && error.response.status === 401) {
                // مسیر فعلی
                let current = window.location.pathname + window.location.search;
                // ریدایرکت به لاگین با پارامتر redirect
                window.location.href = `/auth/login?redirect=${encodeURIComponent(current)}`;

                // اگر نیاز داری توکن رو هم پاک کنی:
                Cookies.remove('token');
            }
            return Promise.reject(error);
        });
    }
    ProductApi = new ProductApi()
    MenuApi = new MenuApi()
    TokenAuthApi = new TokenAuthApi()
    BasketApi = new BasketApi()
    AddressApi = new AddressApi()
    FactorApi = new FactorApi()
    PageBuilderApi = new PageBuilderApi()
}

const api = new UseApi()
export default api
