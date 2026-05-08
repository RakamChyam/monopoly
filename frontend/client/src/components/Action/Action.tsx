import {JSX, useEffect, useRef} from "react";
//@ts-ignore
import "./Action.css"
import MakeStepButton from "./ActionButtons/MakeStepButton/MakeStepButton";
import EndTurnButton from "./ActionButtons/EndTurnButton/EndTurnButton";
import Player from "../../types/game-entites/Player";
import BuyPropertyButton from "./ActionButtons/BuyPropertyButton/BuyPropertyButton";
import PlayerPropertyButton from "./ActionButtons/PlayerPropertiesButton/PlayerPropertyButton";
import DoActionButton from "./ActionButtons/DoActionButton/DoActionButton";
import AuctionButton from "./ActionButtons/AuctionButton/AuctionButton";
import {useSocket} from "../../config/SocketProvider";
import TradeButton from "./ActionButtons/TradeButton/TradeButton";
import LoseButton from "./ActionButtons/LoseButton/LoseButton";

interface ActionProps {
    nickname: string;
    players: Player[];
}

export default function Action(props: ActionProps): JSX.Element {
    const socket = useSocket();

    const findPlayer = function () {
        return props.players.find(player => player.nickname === props.nickname);
    }

    const player = findPlayer();
    const hasConnected = useRef(false); // Флаг для отслеживания подключения

    useEffect(() => {
        if (socket && player && !hasConnected.current) {
            try {
                console.log("Подключаю игрока...", player.nickname);
                socket.emit("player-connected", {
                    nickname: player.nickname,
                });
                hasConnected.current = true;
            } catch (e) {
                console.error(e);
            }
        }
    }, [socket, player]);

    if (player) {
        return (
            <div className="action-container">
                <div className="player-header">
                    <div
                        className="player-avatar"
                        style={{backgroundColor: player.color}}
                    >
                        {player.nickname.charAt(0)}
                    </div>
                    <div className="player-info">
                        <div className="action-nickname">{player.nickname}</div>
                        <div className="action-balance">${player.balance}</div>
                    </div>
                </div>
                <div className={"action-btns-container"}>
                    <PlayerPropertyButton player={player}/>
                    <AuctionButton player={player}/>
                    <TradeButton player={player} players={props.players}/>
                    <MakeStepButton player={player}/>
                    <BuyPropertyButton player={player}/>
                    <EndTurnButton player={player}/>
                    <DoActionButton player={player}/>
                    <LoseButton player={player}/>
                </div>

            </div>
        )
    } else {
        return (
            <div className={"action-container"}>
                <div className={"player-header"}>Вы зритель</div>
            </div>
        )
    }

}