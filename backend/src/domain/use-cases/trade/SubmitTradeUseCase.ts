import Game from "../../model/Game";
import Player from "../../model/Player";

export class SubmitTradeUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player) {
        const tradeOffer = this.game.getTradeOfferBySelectedPlayer(player);

        if (!tradeOffer) {
            throw new Error("Could not find trade offer");
        }

        const initiator = this.game.getPlayerByNickname(tradeOffer.initiator.player.nickname)

        if (!initiator) {
            throw new Error("Could not find trade offer initiator");
        }

        const haveEnoughMoneyInitiator = initiator.balance >= tradeOffer.initiator.moneyForTrade
        const haveEnoughMoneySelectedPlayer = player.balance >= tradeOffer.selectedPlayer.moneyForTrade

        if (haveEnoughMoneySelectedPlayer && haveEnoughMoneyInitiator) {
            //обмен деньгами
            initiator.balance -= tradeOffer.initiator.moneyForTrade;
            player.balance -= tradeOffer.selectedPlayer.moneyForTrade;
            initiator.balance += tradeOffer.selectedPlayer.moneyForTrade;
            player.balance += tradeOffer.initiator.moneyForTrade;

            //обмен карточками
            if (tradeOffer.initiator.fieldsToTrade.length > 0) {
                for (const card of tradeOffer.initiator.fieldsToTrade) {
                    initiator.deleteOwnerField(card);
                    player.addOwnerField(card)
                    card.owner = player.nickname
                }
            }

            if (tradeOffer.selectedPlayer.fieldsToTrade.length > 0) {
                for (const card of tradeOffer.selectedPlayer.fieldsToTrade) {
                    player.deleteOwnerField(card)
                    initiator.addOwnerField(card)
                    card.owner = initiator.nickname
                }
            }

            //удаление предложения
            this.game.removeTradeOffer(tradeOffer);
            initiator.inTrade = false;
            player.inTrade = false;

            return tradeOffer;
        }
    }
}