import React from "react";
import {Avatar} from "@nextui-org/avatar";
import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover";
import {Button} from "@nextui-org/button";
import {Listbox, ListboxItem} from "@nextui-org/listbox";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "@/redux/reducers/auth";

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
        }
        else {
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
    const dispatch: AppDispatch = useDispatch()
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
                        <ListboxItem key="profile">پروفایل</ListboxItem>
                        <ListboxItem key="message">پیام ها</ListboxItem>
                        <ListboxItem  key="logout" className="text-danger" color="danger" onClick={()=>dispatch(logout())}>
                            خروج از حساب کاربری
                        </ListboxItem>
                    </Listbox>
                </div>
            </PopoverContent>
        </Popover>
    )
}