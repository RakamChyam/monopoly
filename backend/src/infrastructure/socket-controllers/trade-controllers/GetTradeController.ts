import Game from "../../../domain/model/Game";
import {TradeOfferMapper} from "../../../applications/mappers/trade-offer-mapper/TradeOfferMapper";

export class GetTradeController {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(nickname: string, callback: Function) {
        try {
            const player = this.game.getPlayerByNickname(nickname);
            if (player) {
                console.log(player);
                const tradeOffer = this.game.getTradeOfferByPlayer(player);
                if (tradeOffer) {
                    const mappedTradeOffer = TradeOfferMapper.map(tradeOffer)
                    callback({
                        success: true,
                        tradeOffer: mappedTradeOffer,
                    });
                } else {
                    callback({
                        success: false,
                        tradeOffer: null,
                    })
                }
            }
        } catch (error) {
            console.error(error);
            callback({
                success: false,
                tradeOffer: null,
            })
        }
    }
}