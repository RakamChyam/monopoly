import { io } from "socket.io-client";

const getServerUrl = () => {
    const host = window.location.hostname;
    const port = "5000";

    console.log(`${host}:${port}`);

    return `http://${host}:${port}`;
};

export const socket = io(getServerUrl(), {
    autoConnect: false,
    reconnection: true,
    transports: ["websocket"],
    timeout: 10000
});

console.log("🔌 Socket connecting to:", getServerUrl());