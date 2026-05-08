import Game from "../../model/Game";
import {TradeParticipant} from "../../model/TradeParticipant";
import {GameError} from "../../errors/GameError";
import {OwnerField} from "../../model/Field";
import {TradeOffer} from "../../model/TradeOffer";

export class TradeOfferUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(initiator: TradeParticipant, selectedPlayer: TradeParticipant) {
        if (initiator.player.inTrade) {
            throw new GameError("Вы уже находитесь в активном трейде", initiator.player);
        }

        if (selectedPlayer.player.inTrade) {
            throw new GameError(`Игрок ${selectedPlayer.player.nickname} уже находится в активном трейде`, selectedPlayer.player);
        }

        const initiatorFields: OwnerField[] = [];

        for (const fieldToTrade of initiator.fieldsToTrade) {
            const card = initiator.player.ownerCards.find((ownerCard) => ownerCard.name === fieldToTrade.name && ownerCard.position === fieldToTrade.position);
            if (card) {
                initiatorFields.push(card);
            }
        }

        if (initiatorFields.length !== initiator.fieldsToTrade.length) {
            throw new Error("Количество карт владельца не сошлось у инициатора")
        }

        const selectedPlayerFields: OwnerField[] = [];

        for (const fieldToTrade of selectedPlayer.fieldsToTrade) {
            const card = selectedPlayer.player.ownerCards.find((ownerCard) => ownerCard.name === fieldToTrade.name && ownerCard.position === fieldToTrade.position);
            if (card) {
                selectedPlayerFields.push(card);
            }
        }

        if (selectedPlayerFields.length !== selectedPlayer.fieldsToTrade.length) {
            throw new Error("Количество карт владельца не сошлось у выбранного")
        }

        initiator.player.inTrade = true;
        selectedPlayer.player.inTrade = true;

        initiator.fieldsToTrade = initiatorFields;
        selectedPlayer.fieldsToTrade = selectedPlayerFields;

        const tradeOffer = new TradeOffer(initiator, selectedPlayer);
        this.game.addTradeOffer(tradeOffer);

        return true;
    }
}