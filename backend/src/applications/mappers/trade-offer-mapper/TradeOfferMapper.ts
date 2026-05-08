import {TradeOffer} from "../../../domain/model/TradeOffer";

export class TradeOfferMapper {
    public static map(tradeOffer: TradeOffer) {
        return {
            initiator: {
                nickname: tradeOffer.initiator.player.nickname,
                fields: tradeOffer.initiator.fieldsToTrade,
                money: tradeOffer.initiator.moneyForTrade,
            },
            selectedPlayer: {
                nickname: tradeOffer.selectedPlayer.player.nickname,
                fields: tradeOffer.selectedPlayer.fieldsToTrade,
                money: tradeOffer.selectedPlayer.moneyForTrade,
            }
        }
    }
}
