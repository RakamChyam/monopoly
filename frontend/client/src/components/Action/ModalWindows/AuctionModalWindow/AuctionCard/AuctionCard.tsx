import {OwnerField} from "../../../../../types/game-entites/Fields";
// @ts-ignore
import "./AuctionCard.css"

interface AuctionCardProps {
    card: OwnerField
}

export default function AuctionCard(props: AuctionCardProps) {
    return (
        <div className={"auction-card"}>
            <div className={"auction-card-header"} style={{backgroundColor: props.card.color}}></div>
            <div className={"auction-card-body"}>
                <h3>{props.card.name}</h3>
            </div>
        </div>
    )
}