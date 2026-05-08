import Player from "../../../../types/game-entites/Player";
import {JSX, useEffect, useState} from "react";
import {PlayerActions} from "../../../../types/enums/PlayerAction";
import {useSocket} from "../../../../config/SocketProvider";
import {createPortal} from "react-dom";
import AuctionModalWindow from "../../ModalWindows/AuctionModalWindow/AuctionModalWindow";

interface AuctionButtonProps {
    player: Player
}


export default function AuctionButton(props: AuctionButtonProps): JSX.Element {
    const socket = useSocket();
    const [showAuctionWindow, setShowAuctionWindow] = useState(false);

    useEffect(() => {
        try {
            socket.on("start-auction", () => {
                setShowAuctionWindow(true);
            })
        } catch (e) {
            console.error(e);
        }
    }, [])

    const handleStartAuction = () => {
        try {
            console.log("starting Auction");
            socket.emit("player-start-auction", {
                nickname: props.player.nickname,
            });
        } catch (err) {
            console.error(err);
        }
    }

    const handleShowAuctionWindow = () => {
        setShowAuctionWindow(true);
    }

    if (props.player.action === PlayerActions.BuyProperty) {
        return (
            <button type={"button"} style={{backgroundColor: props.player.color}} onClick={handleStartAuction}>На
                аукцион</button>
        )
    } else {
        return (
            <>
                <button type={"button"} style={{backgroundColor: props.player.color}}
                        onClick={handleShowAuctionWindow}>Аукцион
                </button>
                {showAuctionWindow && createPortal(
                    <AuctionModalWindow onClose={() => setShowAuctionWindow(false)} player={props.player}/>,
                    document.body
                )}
            </>

        )
    }
}