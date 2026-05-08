import Game from "../../../domain/model/Game";
import {Server} from "socket.io";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {SubmitBidUseCase} from "../../../domain/use-cases/submit-bid/SubmitBidUseCase";
import {GameError} from "../../../domain/errors/GameError";
import {AuctionMapper} from "../../../applications/mappers/auction-mapper/AuctionMapper";

export class PlayerSubmitBidController {
    private game: Game;
    private io: Server;
    private notificationSystem: NotificationSystem;
    private submitBidUseCase: SubmitBidUseCase;


    public constructor(game: Game, io: Server, notificationSystem: NotificationSystem) {
        this.game = game;
        this.io = io;
        this.notificationSystem = notificationSystem;
        this.submitBidUseCase = new SubmitBidUseCase(game);
    }

    public execute(data: { nickname: string, bid: number }): void {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                const bid = Math.trunc(data.bid);
                const auction = this.submitBidUseCase.execute(player, bid);

                this.io.emit("update-auction-data", {
                    auction: AuctionMapper.map(auction),
                })
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(error.message, error.player);
            }
            console.error(error);
        }
    }
}