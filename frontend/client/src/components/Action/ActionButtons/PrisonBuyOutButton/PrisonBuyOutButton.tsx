import {useSocket} from "../../../../config/SocketProvider";
import Player from "../../../../types/game-entites/Player";
import {JSX} from "react";

interface PrisonBuyOutButtonProps {
    player: Player;
}

export default function PrisonBuyOutButton(props: PrisonBuyOutButtonProps) {
    const socket = useSocket();

    const handler = () => {
        try {
            socket.emit("prison-buy-out", {
                nickname: props.player.nickname,
            });
        } catch (e) {
            console.error(e);
        }
    }

    if (props.player.inPrison && props.player.makingStep) {
        return (
            <button type={"button"} onClick={handler} style={{backgroundColor: props.player.color}}>Выкуп из
                тюрьмы</button>
        )
    } else {
        return null
    }
}