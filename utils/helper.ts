import Cookie from 'js-cookie'
export const isLogin = () =>{
    return !!Cookie.get('auth')
}