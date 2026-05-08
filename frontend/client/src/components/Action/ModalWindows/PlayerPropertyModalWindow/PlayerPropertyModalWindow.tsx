import {JSX} from "react";
import Player from "../../../../types/game-entites/Player";
// @ts-ignore
import "./PlayerPropertyModalWindow.css"
import OwnerCard from "../../../OwnerCard/OwnerCard";

interface PlayerPropertyModalWindowProps {
    player: Player;
    onClose: () => void;
}


export default function PlayerPropertyModalWindow(props: PlayerPropertyModalWindowProps): JSX.Element {
    return (
        <div className={"modal-overlay"} onClick={e => {
            e.preventDefault()
            props.onClose()
        }}>
            <div className={"player-property-modal-window"} onClick={event => event.stopPropagation()}>
                <div className={"player-property-modal-header"}>
                    <h3>Мои территории ({props.player.ownerCards.length})</h3>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={() => props.onClose()}
                    >
                        ×
                    </button>
                </div>
                <div className={"player-property-modal-content"}>
                    {props.player.ownerCards.length ?
                        <div className={"player-property-cards-container"}>
                            {props.player.ownerCards.map((card, index) => (
                                <OwnerCard key={index} field={card} player={props.player}/>
                            ))}
                        </div>
                        :
                        <div className={"player-property-no-cards"}>
                            У вас нет территории
                        </div>}
                </div>
            </div>
        </div>
    )
}