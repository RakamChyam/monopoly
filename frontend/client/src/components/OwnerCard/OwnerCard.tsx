import {useSocket} from "../../config/SocketProvider";
import {useState} from "react";
import Player from "../../types/game-entites/Player";
import {CommunalField, OwnerField, PropertyField, RailwayField} from "../../types/game-entites/Fields";
// @ts-ignore
import "./OwnerCard.css"

interface OwnerCardProps {
    field: OwnerField;
    player: Player;
}

export default function OwnerCard({field, player}: OwnerCardProps) {
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const socket = useSocket();

    const getCountRailways = function (): number {
        let countRailways: number = 0;
        player.ownerCards.forEach((card) => {
            if (card.type === "railway") countRailways++;
        });
        return countRailways;
    };

    const getCountCommunal = function () {
        let countCommunal: number = 0;
        player.ownerCards.forEach((card) => {
            if (card.type === "communal") countCommunal++;
        });
        return countCommunal;
    };

    const isPropertyCard = function (card: OwnerField): card is PropertyField {
        return card.type.startsWith("rent_field_");
    };

    const isRailwayCard = function (card: OwnerField): card is RailwayField {
        return card.type === "railway";
    };

    const isCommunalCard = function (card: OwnerField): card is CommunalField {
        return card.type === "communal";
    };

    const buyHouse = function () {
        if (socket && socket.connected) {
            console.log("Покупаю домик");
            socket.emit("player-buy-house", {
                nickname: player.nickname,
                field: field, // Исправлено: card -> field
            });
        }
    };

    const sellHouse = function () {
        if (socket && socket.connected) {
            console.log("Продаю домик");
            socket.emit("player-sell-house", {
                nickname: player.nickname,
                field: field, // Исправлено: card -> field
            });
        }
    };

    const putAsCollateral = function () {
        if (socket && socket.connected) {
            console.log("Территория в залог");
            socket.emit("player-put-collateral", {
                nickname: player.nickname,
                field: field, // Исправлено: card -> field
            });
        }
    };

    const returnFromCollateral = function () {
        if (socket && socket.connected) {
            console.log("Возвращаю из залога");
            socket.emit("player-return-collateral", {
                nickname: player.nickname,
                field: field, // Исправлено: card -> field
            });
        }
    };

    if (isPropertyCard(field)) {
        const propertyField = field as PropertyField;
        return (
            <div className="owner-card-item">
                <div
                    className="owner-card-color"
                    style={{backgroundColor: propertyField.color}}
                >
                    <button
                        type="button"
                        className="owner-card-info-btn"
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                    >
                        i
                    </button>
                </div>

                {showInfo ? (
                    <div className="owner-card-info-content">
                        <div className="info-section">
                            <div className="info-label">Название:</div>
                            <div className="info-value">{propertyField.name}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Цена:</div>
                            <div className="info-value">${propertyField.price}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Стоимость дома:</div>
                            <div className="info-value">${propertyField.houseCost}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Рента:</div>
                            <div className="info-rent-list">
                                <div>Без домов: ${propertyField.rent[0]}</div>
                                <div>1 дом: ${propertyField.rent[1]}</div>
                                <div>2 дома: ${propertyField.rent[2]}</div>
                                <div>3 дома: ${propertyField.rent[3]}</div>
                                <div>4 дома: ${propertyField.rent[4]}</div>
                                <div>Отель: ${propertyField.rent[5]}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="owner-card-content">
                        <div className="owner-card-name">{propertyField.name}</div>
                        <div className="owner-card-houses">Кол-во домов: {propertyField.houses}</div>
                        <div className="owner-card-rent">
                            Текущая рента: ${propertyField.rent[propertyField.houses]}
                        </div>
                        <div className="owner-card-btns-container">
                            {!propertyField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={buyHouse}
                                >
                                    Купить дом
                                </button>
                            )}
                            {!propertyField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={sellHouse}
                                >
                                    Продать дом
                                </button>
                            )}
                            {!propertyField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={putAsCollateral}
                                >
                                    В залог
                                </button>
                            )}
                            {propertyField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={returnFromCollateral}
                                >
                                    Вернуть
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (isRailwayCard(field)) {
        const railwayField = field as RailwayField;
        return (
            <div className="owner-card-item">
                <div className="owner-card-color">
                    <button
                        type="button"
                        className="owner-card-info-btn"
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                    >
                        i
                    </button>
                    <img
                        className="owner-card-logo"
                        src="/railway.png"
                        alt="railway_logo"
                    />
                </div>

                {showInfo ? (
                    <div className="owner-card-info-content">
                        <div className="info-section">
                            <div className="info-label">Название:</div>
                            <div className="info-value">{railwayField.name}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Цена:</div>
                            <div className="info-value">${railwayField.price}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Рента:</div>
                            <div className="info-rent-list">
                                <div>1 станция: ${railwayField.rent[0]}</div>
                                <div>2 станции: ${railwayField.rent[1]}</div>
                                <div>3 станции: ${railwayField.rent[2]}</div>
                                <div>4 станции: ${railwayField.rent[3]}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="owner-card-content">
                        <div className="owner-card-name">{railwayField.name}</div>
                        <div className="owner-card-houses">
                            Кол-во станций: {getCountRailways()}
                        </div>
                        <div className="owner-card-rent">
                            Текущая рента: ${railwayField.rent[getCountRailways() - 1]}
                        </div>
                        <div className="owner-card-btns-container">
                            {!railwayField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={putAsCollateral}
                                >
                                    В залог
                                </button>
                            )}
                            {railwayField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={returnFromCollateral}
                                >
                                    Вернуть
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (isCommunalCard(field)) {
        const communalField = field as CommunalField;
        return (
            <div className="owner-card-item">
                <div className="owner-card-color">
                    <button
                        type="button"
                        className="owner-card-info-btn"
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                    >
                        i
                    </button>
                    <img
                        className="owner-card-logo"
                        src="/lightning.png"
                        alt="lightning_logo"
                    />
                </div>

                {showInfo ? (
                    <div className="owner-card-info-content">
                        <div className="info-section">
                            <div className="info-label">Название:</div>
                            <div className="info-value">{communalField.name}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Цена:</div>
                            <div className="info-value">${communalField.price}</div>
                        </div>

                        <div className="info-section">
                            <div className="info-label">Рента:</div>
                            <div className="info-rent-list">
                                <div>1 коммуналка: x{communalField.rent[0]}</div>
                                <div>2 коммуналки: x{communalField.rent[1]}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="owner-card-content">
                        <div className="owner-card-name">{communalField.name}</div>
                        <div className="owner-card-houses">
                            Кол-во коммуналок: {getCountCommunal()}
                        </div>
                        <div className="owner-card-rent">
                            Текущая рента: x{communalField.rent[getCountCommunal() - 1]}
                        </div>
                        <div className="owner-card-btns-container">
                            {!communalField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={putAsCollateral}
                                >
                                    В залог
                                </button>
                            )}
                            {communalField.collateral && (
                                <button
                                    type="button"
                                    className="owner-card-btn"
                                    onClick={returnFromCollateral}
                                >
                                    Вернуть
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}