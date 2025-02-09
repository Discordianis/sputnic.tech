import React from "react";
import authStore from "../../store/authStore";
import { observer } from "mobx-react-lite";
import useInput from "../../hooks/useInput.tsx";
import routeStore from "../../store/routeStore.tsx";
import {toJS} from "mobx";

const Login: React.FC = observer(() => {
    const login = useInput('')
    const password = useInput('')

    const handleLogin = async () => {
        await authStore.login(login.value, password.value);
        await routeStore.loadRoute(740, '2025-02-05 06:13:02', '2025-02-07 17:53:24')
        console.log(toJS(routeStore.route[740][0]))
    };

    return (
        <div>
            <input type="text" placeholder="Логин" value={login.value} onChange={(e) => login.onChange(e)} />
            <input type="password" placeholder="Пароль" value={password.value} onChange={(e) => password.onChange(e)} />
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
});

export default Login;