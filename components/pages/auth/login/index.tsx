import {ReactNode, useState} from "react";
import {UCard, UCardBody, UCardHeader} from "@/components/base/card";
import {Logo} from "@/components/icons";
import {UInput} from "@/components/base/input";
import {UButton} from "@/components/base/button/button";
import {ULink} from "@/components/base/link/link";
import {UIcon} from "@/components/base/icon";
import api from "@/services/useApi";
import {motion, AnimatePresence} from "framer-motion"
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {login} from "@/redux/reducers/auth";
import {AppDispatch} from "@/redux/store";

interface PagesLoginProps {
    children?: ReactNode
}

export const PagesLogin = (props: PagesLoginProps) => {
    const router = useRouter()
    const dispatch: AppDispatch = useDispatch()
    const [isSignInType, setIsSignInType] = useState(0)
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const onSetUser = (username: string) => {
        setUsername(username)
        setIsSignInType(1)
    }
    const onLogin = async (password: string) => {
        setIsLoading(true)
        const {data} :any = await api.TokenAuthApi.apiTokenAuthAuthenticatePost({
            userNameOrEmailAddress: username,
            password: password
        })
        dispatch(login(data.result.accessToken))
        router.push('/')
        setIsLoading(false)
    }
    const loginComponent = () => {
        if (isSignInType === 0) {
            return <PagesLoginSetUser onLoginClick={onSetUser}/>
        } else if (isSignInType === 1) {
            return <PagesLoginSetPassword onLoginClick={onLogin} loading={isLoading}/>
        }
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <motion.div layout>
            <UCard className="w-[27rem] p-4">
                <UCardHeader>
                    <div className="flex justify-between w-full">
                        <div className="w-10"></div>
                        <div className="flex items-center">
                            <Logo/>
                            <span>پرومال</span>
                        </div>
                        <div className="w-10">
                            <AnimatePresence>
                                {isSignInType !== 0 && (
                                    <motion.div
                                        initial={{opacity: 0, scale: 0}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0}}
                                        transition={{duration: 0.3}}
                                    >
                                        <UButton isIconOnly onClick={() => setIsSignInType(0)}>
                                            <UIcon fontSize={20} icon="solar:arrow-left-outline"/>
                                        </UButton>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </UCardHeader>
                <div>
                    <AnimatePresence mode="wait">
                        {isSignInType !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                layout
                            >
                                {loginComponent()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </UCard>
            </motion.div>
        </div>
    )
}

interface PagesLoginSetUserProps {
    onLoginClick: (username: string) => void;
}

const PagesLoginSetUser = (props: PagesLoginSetUserProps) => {
    const [username, setUsername] = useState('')
    return (
        <>
            <UCardBody className="text-right" onKeyDown={(event) => event.key === 'Enter' && props.onLoginClick(username)}>
                <h1 className="text-2xl mb-8 font-bold">ورود | ثبت نام</h1>
                <h5 className="text-base">سلام!</h5>
                <h5 className="text-base">لطفا شماره موبایل یا ایمیل خود را وارد کنید</h5>
                <UInput autoFocus value={username} onValueChange={setUsername} dir="ltr" className="mt-12" variant="bordered"
                        size="lg"/>
                <UButton className="mt-12" color="primary" onClick={() => props.onLoginClick(username)}>
                    ورود
                </UButton>
                <div className="mx-auto mt-4">
                    <p className="text-xs mt-4">ورود شما به معنای پذیرش<ULink className="mx-1 inline-block text-xs"
                                                                              href="/page/terms/">شرایط
                        دیجی‌کالا</ULink>و<ULink className="mx-1 inline-block text-xs" href="/page/privacy/">قوانین
                        حریم‌خصوصی</ULink>است</p>
                </div>
            </UCardBody>
        </>
    )
}

interface PagesLoginSetPasswordProps {
    onLoginClick: (password: string) => void;
    loading?: boolean;
}

const PagesLoginSetPassword = (props: PagesLoginSetPasswordProps) => {
    const [password, setPassword] = useState('')
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <>
            <UCardBody className="text-right" onKeyDown={(event) => event.key === 'Enter' && props.onLoginClick(password)}>
                <h1 className="text-2xl mb-8 font-bold">رمز عبور را وارد کنید</h1>
                <UInput autoFocus value={password} onValueChange={setPassword} dir="ltr" className="mt-8" variant="bordered"
                        size="lg" startContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}
                            aria-label="toggle password visibility">
                        {isVisible ? (
                            <UIcon icon="solar:eye-outline" className="text-2xl text-default-400 pointer-events-none"/>
                        ) : (
                            <UIcon icon="solar:eye-closed-outline"
                                   className="text-2xl text-default-400 pointer-events-none"/>
                        )}
                    </button>
                }
                        type={isVisible ? "text" : "password"}/>
                <UButton className="mt-12" color="primary" isLoading={props.loading}
                         onClick={() => props.onLoginClick(password)}>
                    تایید
                </UButton>
            </UCardBody>
        </>
    )
}