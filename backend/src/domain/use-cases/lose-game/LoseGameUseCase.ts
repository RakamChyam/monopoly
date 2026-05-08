import Game from "../../model/Game";
import Player from "../../model/Player";
import {Auction} from "../../model/Auction";
import {AuctionParticipant} from "../../model/AuctionParticipant";

export class LoseGameUseCase {
    private game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player) {
        const field = this.game.getFieldByPlayerPosition(player);
        if ("owner" in field) {
            const owner = this.game.getPlayerByNickname(field.owner);
            if (owner) {
                this.game.removePlayer(player);
                owner.balance += player.balance;
                for (const card of player.ownerCards) {
                    if (!card.collateral) {
                        owner.addOwnerField(card);
                    } else {
                        const auction = new Auction(card);
                        for (const player of this.game.players) {
                            const participant = new AuctionParticipant(player);
                            auction.addParticipant(participant)
                        }
                        this.game.addAuction(auction);
                        auction.start()
                    }
                }

                this.game.nextStep();

                if (this.game.players.length === 1) {
                    return this.game.players[0];
                }

                return player;
            } else {
                throw new Error("Owner not found");
            }
        } else if (field.type === "chance" || field.type === "treasury" || field.type === "tax") {
            for (const card of player.ownerCards) {
                const auction = new Auction(card);
                this.game.removePlayer(player);
                for (const player of this.game.players) {
                    const participant = new AuctionParticipant(player);
                    auction.addParticipant(participant)
                }
                this.game.addAuction(auction);
                auction.start()
            }
            this.game.nextStep();

            return player;
        }
    }
}