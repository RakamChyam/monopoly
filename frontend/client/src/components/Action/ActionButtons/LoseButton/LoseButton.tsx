import Player from "../../../../types/game-entites/Player";
import {PlayerActions} from "../../../../types/enums/PlayerAction";
import {useSocket} from "../../../../config/SocketProvider";

interface LoseButtonProps {
    player: Player;
}

export default function LoseButton(props: LoseButtonProps) {
    const socket = useSocket();

    const handler = () => {
        try {
            socket.emit("player-lose-game", {
                nickname: props.player.nickname,
            });
        } catch (err) {
            console.log(err);
        }
    }

    const canLose = props.player.action === PlayerActions.PayRent ||
        props.player.action === PlayerActions.PayTax ||
        props.player.action === PlayerActions.Chance ||
        props.player.action === PlayerActions.Treasury;

    if (!canLose) {
        return null
    } else {
        return (
            <button type={"button"} style={{backgroundColor: props.player.color, marginTop: "50px"}}
                    onClick={handler}>Принять
                поражение💀</button>
        )
    }
}