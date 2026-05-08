import Game from "../../model/Game";
import Player from "../../model/Player";

export class CancelTradeUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player) {
        const tradeOffer = this.game.getTradeOfferByPlayer(player);
        if(!tradeOffer) {
            throw new Error("Could not find any trade offer");
        }

        const initiator = this.game.getPlayerByNickname(tradeOffer.initiator.player.nickname)
        if(!initiator) {
            throw new Error("Could not find initiator");
        }

        player.inTrade = false
        initiator.inTrade = false
        this.game.removeTradeOffer(tradeOffer);

        return initiator;
    }
}