import {UButton} from "@/components/base/button/button";
import React from "react";
import {isLogin} from "@/utils/helper";
import {UAvatar} from "@/components/base/avatar/avatar";

interface ProfileProps {
    onLogin: () => void
}
interface LoginButtonProps {
    onLogin: () => void
}
interface LoginAvatarProps {

}
export const Profile = (props:ProfileProps) => {
    const componentProfile = () =>{
        if (isLogin()){
            return <LoginAvatar/>
        }else{
            return <LoginButton onLogin={props.onLogin}/>
        }
    }
    return (
        <>
        {componentProfile()}
        </>
    )
}
const LoginButton = (props:LoginButtonProps) => {
    return (
        <UButton variant="bordered" onClick={props.onLogin}>
            ورود | ثبت نام
        </UButton>
    )
}
const LoginAvatar = (props:LoginAvatarProps) => {
    return (
        <UAvatar isBordered color="primary" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
    )
}