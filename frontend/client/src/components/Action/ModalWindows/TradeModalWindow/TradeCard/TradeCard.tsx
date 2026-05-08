import {OwnerField} from "../../../../../types/game-entites/Fields";
// @ts-ignore
import "./TradeCard.css"
import {useState} from "react";


interface TradeCardProps {
    card: OwnerField;
    onSelect: (card: OwnerField) => void;
}

export default function TradeCard(props: TradeCardProps) {
    const [isSelected, setIsSelected] = useState(false);

    const handler = () => {
        props.onSelect(props.card)

        if (isSelected) {
            setIsSelected(false);
        } else {
            setIsSelected(true);
        }
    }

    return (
        <div className={isSelected ? "trade-card-selected" : "trade-card"} onClick={handler}>
            <div
                className="trade-card-color"
                style={{backgroundColor: props.card.color}}
            ></div>
            <div className="trade-card-name">{props.card.name}</div>
        </div>
    )
}