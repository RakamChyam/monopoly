// @ts-ignore
import "./Card.css"
import Player from "../../types/game-entites/Player";
import {JSX, useState} from "react";
import treasuryActions from "../../data/treasury";
import chanceActions from "../../data/chance";

interface CardProps {
    position: number;
    name: string;
    type: string;
    isRentField: boolean;
    canBuy: boolean;
    price?: number;
    color?: string;
    houseCost?: number;
    rent?: number[];
    orientation?: string;
    players: Player[];
    value?: number;
    owner?: string;
}

type ColorKey = keyof typeof colors;

const corners = [0, 10, 20, 30];

const colors = {
    RED: "#FF0000",
    GREEN: "#00FF00",
    BLUE: "#0000FF",
    YELLOW: "#FFFF00",
    PURPLE: "#800080",
};

export default function Card(props: CardProps) {
    const [showCardInfo, setShowCardInfo] = useState<boolean>(false);

    const findCardOwner = () => {
        for (const player of props.players) {
            if (player.ownerCards.find((c) => c.position === props.position)) {
                return {nickname: player.nickname, color: player.color as ColorKey};
            }
        }
    };

    // Функция для конвертации HEX в RGBA
    const hexToRgba = (hex: string, alpha: number) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;

        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    //отбражение игроков на карте
    const renderPlayers = () => {
        const players = props.players;
        const cardPosition = props.position;
        return players
            .filter((player) => player.position === cardPosition)
            .map((player) => (
                <div
                    className="player-on-card"
                    style={{backgroundColor: player.color}}
                    key={player.nickname}
                ></div>
            ));
    };

    //Рендер карты
    const renderCardContent = () => {
        const owner = findCardOwner();
        const bgStyle = owner
            ? {
                backgroundColor: hexToRgba(colors[owner.color], 0.15),
                backdropFilter: "blur(2px)",
            }
            : {};

        // if (props.owner) {
        //     return (
        //         <>
        //             <div
        //                 className="card-color"
        //                 style={{backgroundColor: props.color}}
        //             ></div>
        //             <div className="card-content" style={bgStyle}>
        //                 <div className="card-name">{props.name}</div>
        //                 <div className="card-players">{renderPlayers()}</div>
        //                 <div className="card-price">{defineRent()}</div>
        //             </div>
        //         </>
        //     );
        // }

        if (props.color) {
            return (
                <>
                    <div
                        className="card-color"
                        style={{backgroundColor: props.color}}
                    ></div>
                    <div className="card-content" style={bgStyle}>
                        <div className="card-name">{props.name}</div>
                        <div className="card-players">{renderPlayers()}</div>
                        {props.price && <div className="card-price">${props.price}</div>}
                    </div>
                </>
            );
        }

        return (
            <div className="card-content" style={bgStyle}>
                <div className="card-name">{props.name}</div>
                <div className="card-players">{renderPlayers()}</div>
                {props.price && <div className="card-price">${props.price}</div>}
            </div>
        );
    };

    const renderInfoByType = (type: string) => {
        if (type.startsWith("rent_field_")) {
            return (
                <>
                    <div className="modal-card-info-section">
                        Стоимость территории: ${props.price}
                    </div>
                    <div className="modal-card-info-section">
                        Стоимость дома: ${props.houseCost}
                    </div>
                    <div className="modal-card-info-section">
                        Без домов: ${props.rent?.[0]}
                    </div>
                    <div className="modal-card-info-section">
                        1 дом: ${props.rent?.[1]}
                    </div>
                    <div className="modal-card-info-section">
                        2 дома: ${props.rent?.[2]}
                    </div>
                    <div className="modal-card-info-section">
                        3 дома: ${props.rent?.[3]}
                    </div>
                    <div className="modal-card-info-section">
                        4 дома: ${props.rent?.[4]}
                    </div>
                    <div className="modal-card-info-section">
                        Отель: ${props.rent?.[5]}
                    </div>
                    <div className="modal-card-info-section">
                        Если собраны все территории одного цвета, то рента без домов
                        удваивается
                    </div>
                </>
            );
        } else if (type === "chance") {
            return (
                <>
                    {chanceActions.map((action, index) => {
                        return (
                            <div className="modal-chance-action" key={index}>
                                <b>{action.number}.</b> {action.discription}
                            </div>
                        );
                    })}
                </>
            );
        } else if (type === "treasury") {
            return (
                <>
                    {treasuryActions.map((action, index) => {
                        return (
                            <div className="modal-treasury-action" key={index}>
                                <b>{action.number}.</b> {action.discription}
                            </div>
                        );
                    })}
                </>
            );
        } else if (type === "railway") {
            return (
                <>
                    <div className="modal-card-info-section">
                        Стоимость территории: ${props.price}
                    </div>
                    <div className="modal-card-info-section">
                        1 станция: ${props.rent?.[0]}
                    </div>
                    <div className="modal-card-info-section">
                        2 станции: ${props.rent?.[1]}
                    </div>
                    <div className="modal-card-info-section">
                        3 станции: ${props.rent?.[2]}
                    </div>
                    <div className="modal-card-info-section">
                        4 станции: ${props.rent?.[3]}
                    </div>
                </>
            );
        } else if (type === "communal") {
            return (
                <>
                    <div className="modal-card-info-section">
                        Стоимость территории: ${props.price}
                    </div>
                    <div className="modal-card-info-section">
                        1 комуналка: x{props.rent?.[0]}
                    </div>
                    <div className="modal-card-info-section">
                        2 комуналки: x{props.rent?.[1]}
                    </div>
                </>
            );
        } else if (type === "tax") {
            return (
                <>
                    <div>Размер налога: ${props.value}</div>
                </>
            );
        }
        return <div>{type}</div>;
    };

    // Используем orientation из props или задаем по умолчанию
    const orientation = props.orientation || "horizontal";

    return (
        <>
            <div
                className={`${orientation} ${corners.includes(props.position) ? "corner" : "card"}`}
                onClick={() => setShowCardInfo(true)}
            >
                {renderCardContent()}
            </div>
            {showCardInfo && (
                <div className="modal-overlay" onClick={() => setShowCardInfo(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div
                            className="modal-card-header"
                            style={{backgroundColor: props.color}}
                        ></div>
                        <div className="modal-card-content">
                            <h3 className="modal-card-name">{props.name}</h3>
                            <div>{renderInfoByType(props.type)}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
