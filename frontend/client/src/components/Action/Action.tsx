import {JSX, useEffect, useRef, useState} from "react";
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
import PrisonBuyOutButton from "./ActionButtons/PrisonBuyOutButton/PrisonBuyOutButton";
import cards from "../../data/cards";
import GetPlayersDataResponse from "../../types/responses/GetPlayersDataResponce";
import {GetMeResponse} from "../../types/responses/GetMeResponce";

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

    // ✅ Эффект для подключения игрока
    useEffect(() => {
        if (socket && player && !hasConnected.current) {
            console.log("Подключаю игрока...", player.nickname);
            socket.emit("player-connected", {
                nickname: player.nickname,
            });
            hasConnected.current = true;
        }
    }, [socket, player]);

    if (player && player.inPrison) {
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
                        <div className={"prison-info"}>
                            <p>Вы в тюрьме</p>
                            <p>Ходов до выхода: {player.prisonYears}</p>
                        </div>
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
                    <PrisonBuyOutButton player={player}/>
                    <LoseButton player={player}/>
                </div>

            </div>
        )
    }

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