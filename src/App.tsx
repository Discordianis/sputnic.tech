import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
);

export default App;
