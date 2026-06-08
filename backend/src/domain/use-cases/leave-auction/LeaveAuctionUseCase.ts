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
        const currentParticipant = auction.getCurrentParticipant();

        if (participant) {
            const wasCurrent = currentParticipant === participant;
            const currentIndex = auction.step % auction.participants.length;

            auction.removeParticipant(participant);

            if (auction.participants.length === 1) {
                return this.endAuctionUseCase.execute(auction);
            }

            if (wasCurrent) {
                auction.step = currentIndex % auction.participants.length;
                auction.getCurrentParticipant().makingBid = true;
            }

            auction.nextTurn();

            return auction;
        } else {
            throw new Error("Participant not found!");
        }
    }
}