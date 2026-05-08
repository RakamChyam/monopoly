import React from 'react';
import {Route, Routes} from "react-router";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import {SocketProvider} from "./config/SocketProvider";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/game" element={
                <SocketProvider>
                    <GamePage/>
                </SocketProvider>
            }/>
        </Routes>
    );
}

export default App;
