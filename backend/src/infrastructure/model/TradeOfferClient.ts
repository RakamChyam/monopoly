import {TradeParticipantClient} from "./TradeParticipantClient";

export interface TradeOfferClient {
    initiator: TradeParticipantClient;
    selectedPlayer: TradeParticipantClient;
}