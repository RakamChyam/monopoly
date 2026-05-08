import Player from "../../../../../types/game-entites/Player";
// @ts-ignore
import "./TradePlayer.css"

interface TradePlayerProps {
    player: Player;
    onSelect: () => void;
}

export default function TradePlayer(props: TradePlayerProps) {
    return (
        <div className={"trade-player-list-element"} onClick={props.onSelect}>
            <div
                className="player-avatar"
                style={{backgroundColor: props.player.color}}
            >
                {props.player.nickname.charAt(0)}
            </div>
            <div className={"trade-player-list-element-info"}>
                <div className={'trade-player-element-nickname'}>{props.player.nickname}</div>
                <div className={'trade-player-element-balance'}>Баланс: {props.player.balance}</div>
            </div>
        </div>
    )
}