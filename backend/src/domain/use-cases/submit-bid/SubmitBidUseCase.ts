import Game from "../../model/Game";
import Player from "../../model/Player";
import {GameError} from "../../errors/GameError";

export class SubmitBidUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player, bid: number) {
        if (bid < 0) {
            throw new GameError("Ставка должна быть больше нуля", player);
        }

        const auction = this.game.getAuction();
        const participant = auction.getParticipantByPlayer(player);

        if (participant) {
            if (!participant.makingBid) {
                throw new GameError(`Не ваша очередь делать ставку`, player);
            }

            if (participant.player.balance < bid) {
                throw new GameError("Не хватает средств для ставки", player);
            }

            if (bid <= auction.maxBid) {
                throw new GameError("Ваша ставка должна превышать все предыдущие", player);
            }

            participant.bid = bid;
            auction.maxBid = bid;
            auction.nextTurn();

            return auction;
        } else {
            throw new Error(`Participant not found: ${player}`);
        }
    }
}