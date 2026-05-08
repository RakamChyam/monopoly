import Board from "../components/Board/Board";
import {useSocket} from "../config/SocketProvider";
import {useEffect, useState} from "react";
import GetPlayersDataResponse from "../types/responses/GetPlayersDataResponce";
import Player from "../types/game-entites/Player";
import PlayerList from "../components/PlayerList/PlayerList";
import Notification from "../components/Notification/Notification";
import {useLocation} from "react-router";
import Action from "../components/Action/Action";


export default function GamePage() {
    const [playersData, setPlayersData] = useState<Player[]>([]);
    const socket = useSocket();
    const location = useLocation();
    const nickname = location.state;

    useEffect(() => {
        socket.emit("get-players-data", {}, (response: GetPlayersDataResponse) => {
            if (response.success) {
                console.log(response.players);
                setPlayersData(response.players);
            }
        });

        socket.on("update-players-data", (data) => {
            setPlayersData(data.players);
        })
    }, [socket]);

    return (
        <div className="App">
            <Board players={playersData}/>
            <PlayerList players={playersData}/>
            <Notification/>
            <Action nickname={nickname} players={playersData}/>
        </div>
    )
}