import React from "react";
import authStore from "../../store/authStore.tsx";
import { observer } from "mobx-react-lite";
import useInput from "../../hooks/useInput.tsx";
import Button from "../../components/Button/Button.tsx";
import personImg from '../../../public/person.svg'
import lockImg from '../../../public/lock.svg'
import './Login.css'
import Background from "../../components/Background/Background.tsx";

const Login: React.FC = observer(() => {
    const login = useInput('')
    const password = useInput('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        await authStore.login(login.value, password.value);
    };

    return (
        <div className={'login_root'}>
            <div className={'login_sub'}>
                <div className={'login_header'}>
                    <h2>Добро пожаловать!</h2>
                    <span>Пожалуйста введите данные для входа в приложение</span>
                </div>
                <form>
                    <div className={'form_inputs'}>
                        <div className={'form_input_login'}>
                            <div>
                                <img src={personImg} alt={''}/>
                                <input type="text" placeholder="Имя пользователя" value={login.value}
                                       onChange={(e) => login.onChange(e)} autoComplete={'name'}/>
                            </div>
                        </div>
                        <div className={'form_input_password'}>
                            <div>
                                <img src={lockImg} alt={''}/>
                                <input type="password" placeholder="Пароль" value={password.value}
                                       onChange={(e) => password.onChange(e)} autoComplete={'current-password'}/>
                            </div>
                        </div>
                    </div>
                    <div className={'form_button'}>
                        <Button onClick={handleLogin}>Войти</Button>
                    </div>
                </form>
            </div>
            <Background />
        </div>
    );
});

export default Login;