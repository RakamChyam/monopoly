import {useSocket} from "../../../../config/SocketProvider";
import {colorToHex} from "../../../../applications/ColorToHex";
import Player from "../../../../types/game-entites/Player";
import {PlayerActions} from "../../../../types/enums/PlayerAction";

interface BuyPropertyButtonProps {
    player: Player;
}

export default function BuyPropertyButton(props: BuyPropertyButtonProps) {
    const socket = useSocket();

    const handler = function () {
        try {
            console.log(`Property button clicked`);
            socket.emit('player-buy-property', {
                nickname: props.player.nickname,
            });
        } catch (err) {
            console.log(err);
        }
    }

    if (props.player.action === PlayerActions.BuyProperty) {
        return (
            <button type={"button"} onClick={handler} style={{backgroundColor: props.player.color}}>Купить поле</button>
        )
    } else {
        return null
    }
}