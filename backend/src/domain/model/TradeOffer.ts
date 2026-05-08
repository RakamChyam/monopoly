import {TradeParticipant} from "./TradeParticipant";

export class TradeOffer {
    public initiator: TradeParticipant;
    public selectedPlayer: TradeParticipant;

    public constructor(initiator: TradeParticipant, selectedPlayer: TradeParticipant) {
        this.initiator = initiator;
        this.selectedPlayer = selectedPlayer;
    }
}