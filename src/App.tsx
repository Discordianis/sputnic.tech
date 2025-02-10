import React, {useEffect, useState} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/Login/Login.tsx";
import tokenStore from "./store/tokenStore.tsx";
import Loading from "./components/Loading/Loading.tsx";
import './App.css'
import MapChart from "./features/MapChart/MapChart.tsx";

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        tokenStore.getToken()
        if (tokenStore.token) {
            setToken(tokenStore.token)
        }
        setLoading(false)
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <BrowserRouter>
            <Routes>
                {token ?
                    <Route path="/" element={<MapChart/>}/>
                    :
                    <Route path="/" element={<Login/>}/>
                }
            </Routes>
        </BrowserRouter>
    )
};

export default App;
