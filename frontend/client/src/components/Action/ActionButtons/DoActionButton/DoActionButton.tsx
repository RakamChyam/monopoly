import Player from "../../../../types/game-entites/Player";
import {useEffect, useState} from "react";
import {PlayerActions} from "../../../../types/enums/PlayerAction";
import {useSocket} from "../../../../config/SocketProvider";

interface DoActionButtonProps {
    player: Player;
}

export default function DoActionButton(props: DoActionButtonProps) {
    const [actionText, setActionText] = useState<string>('');
    const socket = useSocket();

    const defineActionText = (player: Player) => {
        if (player.action === PlayerActions.PayTax) {
            setActionText("Заплатить налог");
            return
        } else if (player.action === PlayerActions.Chance) {
            setActionText("Выполинть шанс")
            return;
        } else if (player.action === PlayerActions.Treasury) {
            setActionText("Выполнить казну")
            return;
        } else if (player.action === PlayerActions.PayRent) {
            setActionText("Заплатить ренту")
            return;
        } else {
            setActionText("")
            return;
        }
    }

    const handler = () => {
        try {
            console.log("Выполняю действие")
            socket.emit("player-action", {
                nickname: props.player.nickname,
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        defineActionText(props.player);
    })

    if (actionText) {
        return (
            <button type="button" onClick={handler} style={{backgroundColor: props.player.color}}>{actionText}</button>
        )
    } else {
        return null
    }
}