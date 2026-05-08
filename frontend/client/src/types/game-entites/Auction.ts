import {AuctionParticipant} from "./AuctionParticipant";
import {OwnerField} from "./Fields";

export interface Auction {
    participants: AuctionParticipant[];
    card: OwnerField;
}