import {JSX, useEffect, useState} from "react";
// @ts-ignore
import "./AuctionModalWindow.css"
import {useSocket} from "../../../../config/SocketProvider";
import {GetAuctionResponce} from "../../../../types/responses/GetAuctionResponce";
import {Auction} from "../../../../types/game-entites/Auction";
import AuctionCard from "./AuctionCard/AuctionCard";
import AuctionPlayer from "./AuctionPlayer/AuctionPlayer";
import Player from "../../../../types/game-entites/Player";

interface AuctionModalWindowProps {
    onClose: () => void;
    player: Player;
}


export default function AuctionModalWindow(props: AuctionModalWindowProps): JSX.Element {
    const [auction, setAuction] = useState<Auction | null>(null);
    const socket = useSocket();
    const [bid, setBid] = useState<number>(0);

    useEffect(() => {
        try {
            socket.emit("get-auction", {}, (response: GetAuctionResponce) => {
                console.log(response);
                if (response.success) {
                    setAuction(response.auction);
                }
            });

            socket.on("update-auction-data", (data) => {
                console.log(data);
                setAuction(data.auction);
            })

            socket.on("auction-end", () => {
                props.onClose();
            })
        } catch (e) {
            console.error(e);
        }
    }, []);

    const submitBid = () => {
        try {
            socket.emit("player-submit-bid", {
                nickname: props.player.nickname,
                bid: bid,
            })
        } catch (e) {
            console.error(e);
        }
    }

    const leaveAuction = () => {
        try {
            socket.emit("player-leave-auction", {
                nickname: props.player.nickname,
            })
            props.onClose();
        } catch (e) {
            console.error(e);
        }
    }

    const findPlayer = () => {
        return auction?.participants.find((participant) => participant.nickname === props.player.nickname);
    }

    const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setBid(isNaN(value) ? 0 : value);
    }

    if (auction) {
        return (
            <div className={'modal-overlay'} onClick={(event) => {
                props.onClose()
                event.preventDefault()
            }}>
                <div className={"auction-window"} onClick={(event) => event.stopPropagation()}>
                    <div className={"auction-window-header"}>
                        <h3>Аукцион</h3>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => props.onClose()}
                        >
                            ×
                        </button>
                    </div>
                    <div className={"auction-window-content"}>
                        <div className={"auction-card-container"}>
                            <AuctionCard card={auction.card}/>
                        </div>
                        <div className={"auction-participants"}>
                            {auction.participants.map((player, index) => {
                                return (
                                    <AuctionPlayer player={player} key={index}/>
                                )
                            })}
                            {findPlayer()?.makingBid && (
                                <div className={"auction-actions"}>
                                    <input placeholder={"Ваша ставка"}
                                           type={"number"}
                                           value={bid === 0 ? "" : bid}
                                           onChange={handleBidChange}/>
                                    <div className={"auction-buttons"}>
                                        <button type={"button"} onClick={leaveAuction}>Выйти</button>
                                        <button type={"button"} onClick={submitBid}>Подтвердить</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'modal-overlay'} onClick={(event) => {
            props.onClose()
            event.preventDefault()
        }}>
            <div className={"auction-window"} onClick={(event) => event.stopPropagation()}>
                <div className={"auction-window-header"}>
                    <h3>Аукцион</h3>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={() => props.onClose()}
                    >
                        ×
                    </button>
                </div>
                <div className={"auction-window-content"}>
                    <p>Нет активных аукционов</p>
                </div>
            </div>
        </div>
    )
}