import Game from "../../../domain/model/Game";
import {AuctionMapper} from "../../../applications/mappers/auction-mapper/AuctionMapper";

export class GetAuctionControllers {
    private game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public execute(callback: Function) {
        try {
            const auction = this.game.getAuction();
            if (auction) {
                const mappedAuction = AuctionMapper.map(auction)
                callback({
                    success: true,
                    auction: mappedAuction,
                });
            } else {
                callback({
                    success: false,
                    auction: null,
                })
            }
        } catch (err) {
            console.log(err);
            callback({
                success: false,
                auction: null,
            })
        }
    }
}