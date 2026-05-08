import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {socket} from "./SocketConnection";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            setReady(true)
            console.log(`подключил сокет: ${socket.id}`)
        });

        socket.on('disconnect', (reason) => { console.log('Отключил сокет', socket.id, reason)})
    }, []);

    if (!ready) return <div>Подключение...</div>;

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) throw new Error("useSocket must be used inside SocketProvider");
    return socket;
};
