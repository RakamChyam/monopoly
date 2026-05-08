import {TradeOffer} from "../game-entites/TradeOffer";

export interface GetTradeResponse {
    success: boolean;
    tradeOffer: TradeOffer;
}