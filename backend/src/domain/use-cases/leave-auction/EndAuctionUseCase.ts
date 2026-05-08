import Game from "../../model/Game";
import {Auction} from "../../model/Auction";

export class EndAuctionUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    execute(auction: Auction) {
        const winner = auction.getCurrentParticipant();

        winner.player.addOwnerField(auction.card)
        auction.card.owner = winner.player.nickname;
        winner.player.balance -= winner.bid;

        this.game.removeAuction(auction);
        auction.isEnd = true;

        return auction;
    }
}