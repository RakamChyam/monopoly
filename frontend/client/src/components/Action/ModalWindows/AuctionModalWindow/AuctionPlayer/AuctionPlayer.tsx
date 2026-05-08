import {AuctionParticipant} from "../../../../../types/game-entites/AuctionParticipant";
// @ts-ignore
import "./AuctionPlayer.css"

interface AuctionPlayerProps {
    player: AuctionParticipant
}

export default function AuctionPlayer(props: AuctionPlayerProps) {
    return (
        <div className={props.player.makingBid ? "auction-player-active" : "auction-player"}>
            <div className="auction-player-info">
                <h3>{props.player.nickname}</h3>
                <p>Баланс: {props.player.balance}</p>
            </div>
            <span className="auction-player-bid">{props.player.bid}</span>
        </div>
    )
}