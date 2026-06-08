// @ts-ignore
import "./TradeModalWindow.css"
import {useEffect, useState} from "react";
import Player from "../../../../types/game-entites/Player";
import {useSocket} from "../../../../config/SocketProvider";
import TradePlayer from "./TradePlayer/TradePlayer";
import TradeCard from "./TradeCard/TradeCard";
import {TradeOffer} from "../../../../types/game-entites/TradeOffer";
import {OwnerField} from "../../../../types/game-entites/Fields";
import {GetTradeResponse} from "../../../../types/responses/GetTradeResponce";

interface TradeModalWindowProps {
    onClose: () => void;
    players: Player[];
    player: Player;
}

export default function TradeModalWindow(props: TradeModalWindowProps) {
    const [selectPlayer, setSelectPlayer] = useState<Player | null>(null);
    const [tradeOffer, setTradeOffer] = useState<TradeOffer | null>(null);

    const [myCards, setMyCards] = useState<OwnerField[]>([]);
    const [selectPlayerCards, setSelectPlayerCards] = useState<OwnerField[]>([]);
    const [myMoney, setMyMoney] = useState<number>(0);
    const [selectPlayerMoney, setSelectPlayerMoney] = useState<number>(0);

    const [activeTradeOffer, setActiveTradeOffer] = useState<TradeOffer | null>(null);

    const socket = useSocket();

    useEffect(() => {
        try {
            socket.emit("get-trade", {nickname: props.player.nickname}, (response: GetTradeResponse) => {
                if (response.success) {
                    console.log(response);
                    setActiveTradeOffer(response.tradeOffer);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
            if (selectPlayer) {
                const result: TradeOffer = {
                    initiator: {
                        nickname: props.player.nickname,
                        fields: myCards,
                        money: myMoney,
                    },
                    selectedPlayer: {
                        nickname: selectPlayer.nickname,
                        fields: selectPlayerCards,
                        money: selectPlayerMoney,
                    },
                };

                setTradeOffer(result);
            }
        }
        ,
        [myCards, myMoney, selectPlayerMoney, selectPlayerCards]
    )

    const playersToSelect = props.players.filter(p => p.nickname !== props.player.nickname)

    const toggleMyCard = (card: OwnerField) => {
        setMyCards((prev) => {
            const isSelected = prev.some((c) => c.name === card.name);
            if (isSelected) {
                return prev.filter((c) => c.name !== card.name);
            } else {
                return [...prev, card];
            }
        });
    };

    const toggleSelectPlayerCard = (card: OwnerField) => {
        setSelectPlayerCards((prev) => {
            const isSelected = prev.some((c) => c.name === card.name);
            if (isSelected) {
                return prev.filter((c) => c.name !== card.name);
            } else {
                return [...prev, card];
            }
        });
    };

    const sendHandler = () => {
        try {
            console.log(`Отправляю трейд: `, tradeOffer);
            socket.emit("player-offer-trade", {
                nickname: props.player.nickname,
                tradeOffer: tradeOffer,
            });
            setSelectPlayer(null)
        } catch (e) {
            console.error(e);
        }
    }

    const submitHandler = () => {
        try {
            console.log("Подтверждаю трейд")
            socket.emit("player-submit-trade", {
                nickname: props.player.nickname,
            })
        } catch (e) {
            console.error(e);
        }
    }

    const cancelHandler = () => {
        try {
            console.log("Отколаяю трейд")
            socket.emit("player-cancel-trade", {
                nickname: props.player.nickname,
            })
        } catch (e) {
            console.error(e);
        }
    }

    if (selectPlayer) {
        return (
            <div className={'modal-overlay'} onClick={props.onClose}>
                <div className={'trade-window'} onClick={event => event.stopPropagation()}>
                    <div className={'trade-header'}>
                        <h3>Торговля</h3>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => props.onClose()}
                        >
                            ×
                        </button>
                    </div>
                    <div className={'trade-content-selected'}>
                        <div className={'trade-player-container'}>
                            <div className={'trade-player-nickname'}>Вы</div>
                            <div className={'trade-player-cards'}>
                                {props.player.ownerCards.map((card, index) => (
                                    <TradeCard key={index} card={card} onSelect={() => toggleMyCard(card)}/>
                                ))}
                            </div>
                            <div className={'trade-player-balance'}>
                                <p>Баланс: {props.player.balance}</p>
                                <input
                                    type="number"
                                    placeholder="Введите сумму"
                                    className="trade-player-money-input"
                                    min={0}
                                    onChange={(e) => setMyMoney(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className={'trade-player-container'}>
                            <div className={'trade-player-nickname'}>{selectPlayer.nickname}</div>
                            <div className={'trade-player-cards'}>
                                {selectPlayer.ownerCards.map((card, index) => (
                                    <TradeCard key={index} card={card} onSelect={() => toggleSelectPlayerCard(card)}/>
                                ))}
                            </div>
                            <div className={'trade-player-balance'}>
                                <p>Баланс: {selectPlayer.balance}</p>
                                <input
                                    type="number"
                                    placeholder="Введите сумму"
                                    className="trade-player-money-input"
                                    min={0}
                                    onChange={(e) => setSelectPlayerMoney(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={'trade-window-buttons'}>
                        <button type={'button'} onClick={sendHandler}>Отправить</button>
                    </div>
                </div>
            </div>
        )
    } else if (activeTradeOffer) {
        return (
            <div className={'modal-overlay'} onClick={props.onClose}>
                <div className={'trade-window'}>
                    <div className={'trade-header'}>
                        <h3>Торговля</h3>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => props.onClose()}
                        >
                            ×
                        </button>
                    </div>
                    <div className={'trade-content-selected'}>
                        <div className={'trade-player-container'}>
                            <div className={'trade-player-nickname'}>Вы отдаете</div>
                            <div className={'trade-player-cards'}>
                                {activeTradeOffer.selectedPlayer.fields.map((card, index) => (
                                    <TradeCard key={index} card={card} onSelect={() => toggleMyCard(card)}/>
                                ))}
                            </div>
                            <div className={'trade-player-balance'}>
                                <p>Деньги: ${activeTradeOffer.selectedPlayer.money}</p>
                            </div>
                        </div>

                        <div className={'trade-player-container'}>
                            <div className={'trade-player-nickname'}>{activeTradeOffer.initiator.nickname} отдает вам
                            </div>
                            <div className={'trade-player-cards'}>
                                {activeTradeOffer.initiator.fields.map((card, index) => (
                                    <TradeCard key={index} card={card} onSelect={() => toggleSelectPlayerCard(card)}/>
                                ))}
                            </div>
                            <div className={'trade-player-balance'}>
                                <p>Деньги: ${activeTradeOffer.initiator.money}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'trade-window-action-buttons'}>
                        <button type={'button'} onClick={cancelHandler}>Отклонить</button>
                        <button type={'button'} onClick={submitHandler}>Принять</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={'modal-overlay'} onClick={props.onClose}>
                <div className={'trade-window'} onClick={event => event.stopPropagation()}>
                    <div className={'trade-header'}>
                        <h3>Торговля</h3>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => props.onClose()}
                        >
                            ×
                        </button>
                    </div>
                    <div className={'trade-content'}>
                        <h3>Выберите игрока для трейда</h3>
                        <div className={"trade-players-list"}>
                            {playersToSelect.map((player: Player, index) => (
                                <TradePlayer key={index} player={player} onSelect={() => {
                                    setSelectPlayer(player)
                                }}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}