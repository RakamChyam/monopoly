import {useSocket} from "../../../../config/SocketProvider";
import {JSX} from "react";
import Player from "../../../../types/game-entites/Player";
import {PlayerActions} from "../../../../types/enums/PlayerAction";

interface EndTurnButtonProps {
    player: Player;
}

export default function EndTurnButton(props: EndTurnButtonProps) {
    const socket = useSocket();

    const handler = function () {
        try {
            socket.emit("player-end-turn", {
                nickname: props.player.nickname,
            });
            console.log("End Turn button clicked");
        } catch (err) {
            console.log(err);
        }
    }

    if (props.player.makingStep && props.player.makeRoll && props.player.action === PlayerActions.Nothing) {
        return (
            <button className="end-turn-btn" onClick={handler} style={{backgroundColor: props.player.color}}>Завершить
                ход</button>
        )
    } else {
        return null;
    }

}