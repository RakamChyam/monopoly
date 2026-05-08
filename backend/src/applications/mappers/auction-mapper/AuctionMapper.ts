import {Auction} from "../../../domain/model/Auction";
import {AuctionParticipant} from "../../../domain/model/AuctionParticipant";

export class AuctionMapper {
    public static map(auction: Auction) {
        const mappedParticipants = this.mapParticipants(auction.participants); // Используем this
        return {
            participants: mappedParticipants,
            card: auction.card,
        }
    }

    private static mapParticipants(participants: AuctionParticipant[]) { // Добавили static
        return participants.map(participant => {
            return {
                nickname: participant.player.nickname,
                balance: participant.player.balance,
                bid: participant.bid,
                makingBid: participant.makingBid,
            }
        })
    }
}