import {useState} from "react";
import {createPortal} from "react-dom";
import TradeModalWindow from "../../ModalWindows/TradeModalWindow/TradeModalWindow";
import Player from "../../../../types/game-entites/Player";

interface TradeButtonProps {
    player: Player;
    players: Player[];
}

export default function TradeButton(props: TradeButtonProps) {
    const [showTradeWindow, setShowTradeWindow] = useState(false);

    const handler = () => {
        setShowTradeWindow(true);
    }

    return (
        <>
            <button type={"button"} onClick={handler} style={{backgroundColor: props.player.color}}>Торговля</button>
            {showTradeWindow && createPortal(
                <TradeModalWindow onClose={() => setShowTradeWindow(false)} players={props.players}
                                  player={props.player}/>,
                document.body
            )}
        </>
    )
}