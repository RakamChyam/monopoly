import Player from "../../../../types/game-entites/Player";
import {useState} from "react";
import {createPortal} from "react-dom";
import PlayerPropertyModalWindow from "../../ModalWindows/PlayerPropertyModalWindow/PlayerPropertyModalWindow";

interface PlayerPropertyButtonProps {
    player: Player,
}

export default function PlayerPropertyButton(props: PlayerPropertyButtonProps) {
    const [showModal, setShowModal] = useState<boolean>(false);

    const handler = () => {
        setShowModal(true);
    }

    return (
        <>
            <button type={"button"} style={{backgroundColor: props.player.color}} onClick={handler}>
                Мои территории
            </button>
            {showModal && createPortal(
                <PlayerPropertyModalWindow
                    player={props.player}
                    onClose={() => setShowModal(false)}
                />,
                document.body
            )}
        </>
    )
}