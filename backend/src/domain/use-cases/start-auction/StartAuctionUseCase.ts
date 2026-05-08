import Game from "../../model/Game";
import Player from "../../model/Player";
import {Auction} from "../../model/Auction";
import {AuctionParticipant} from "../../model/AuctionParticipant";
import {PlayerActions} from "../../enums/PlayerActions";

export class StartAuctionUseCase {
    private game: Game

    constructor(game: Game) {
        this.game = game
    }

    public execute(player: Player) {
        if (!player.makingStep || !player.makeRoll) {
            throw new Error("Нельзя начать аукцион")
        }

        const card = this.game.getAvalibleOwnerField(player);
        if (card) {
            const auction = new Auction(card);

            for (const player of this.game.players) {
                const auctionParticipant = new AuctionParticipant(player);
                auction.addParticipant(auctionParticipant);
            }

            auction.start()
            this.game.addAuction(auction);
            player.action = PlayerActions.Nothing;

            return auction;
        } else {
            throw new Error("Поле не найдено, аукцион не начать")
        }
    }
}