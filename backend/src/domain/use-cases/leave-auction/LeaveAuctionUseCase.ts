import Game from "../../model/Game";
import Player from "../../model/Player";
import {EndAuctionUseCase} from "./EndAuctionUseCase";

export class LeaveAuctionUseCase {
    private game: Game;
    private endAuctionUseCase: EndAuctionUseCase;

    constructor(game: Game) {
        this.game = game;
        this.endAuctionUseCase = new EndAuctionUseCase(game);
    }

    public execute(player: Player) {
        const auction = this.game.getAuction();
        const participant = auction.getParticipantByPlayer(player);

        if (participant) {
            auction.removeParticipant(participant);
            auction.nextTurn();

            if (auction.participants.length === 1) {
                return this.endAuctionUseCase.execute(auction);
            }

            return auction;
        } else {
            throw new Error("Participant not found!");
        }
    }
}