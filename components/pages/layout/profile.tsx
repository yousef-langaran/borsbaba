import React, {useEffect, useState} from "react";
import {Avatar} from "@nextui-org/avatar";
import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover";
import {Button} from "@nextui-org/button";
import {isLogin} from "@/utils/helper";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import Cookies from "js-cookie";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";

interface ProfileProps {
    onLogin: () => void
}

interface LoginButtonProps {
    onLogin: () => void
}

interface LoginAvatarProps {

}

export const Profile = (props: ProfileProps) => {
    const token = useSelector((state: RootState) => state.auth.token)
    const componentProfile = () => {
        if (token) {
            return <LoginAvatar/>
        } else {
            return <LoginButton onLogin={props.onLogin}/>
        }
    }
    return (
        <>
            {componentProfile()}
        </>
    )
}
const LoginButton = (props: LoginButtonProps) => {
    return (
        <Button variant="bordered" onClick={props.onLogin}>
            ورود | ثبت نام
        </Button>
    )
}
const LoginAvatar = (props: LoginAvatarProps) => {
    return (
        <Popover placement="bottom-start">
            <PopoverTrigger>
                <Avatar isBordered radius="lg"/>
            </PopoverTrigger>
            <PopoverContent>
                <div className="w-48">
                    <Listbox
                        aria-label="Actions"
                    >
                        <ListboxItem key="new">پروفایل</ListboxItem>
                        <ListboxItem key="copy">پیام ها</ListboxItem>
                        <ListboxItem  key="delete" className="text-danger" color="danger" onClick={()=> Cookies.remove('token')}>
                            خروج از حساب کاربری
                        </ListboxItem>
                    </Listbox>
                </div>
            </PopoverContent>
        </Popover>
    )
}