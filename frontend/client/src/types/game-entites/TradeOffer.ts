import {TradeParticipant} from "./TradeParticipant";

export interface TradeOffer {
    initiator: TradeParticipant;
    selectedPlayer: TradeParticipant;
}