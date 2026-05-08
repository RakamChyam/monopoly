import {useSocket} from "../../../../config/SocketProvider";
import Player from "../../../../types/game-entites/Player";

interface MakeStepButtonProps {
    player: Player
}

export default function MakeStepButton(props: MakeStepButtonProps) {
    const socket = useSocket();

    const handler = function () {
        try {
            socket.emit("player-make-step", {
                nickname: props.player.nickname,
            });
            console.log("Make step button clicked");
        } catch (err) {
            console.log(err);
        }
    }

    if (!props.player.makeRoll && props.player.makingStep) {
        return (
            <button className="make-step-btn" onClick={handler} style={{backgroundColor: props.player.color}}>Бросить
                кубики</button>
        )
    } else {
        return null;
    }

}