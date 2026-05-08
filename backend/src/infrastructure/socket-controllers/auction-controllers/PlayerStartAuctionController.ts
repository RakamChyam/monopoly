import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {StartAuctionUseCase} from "../../../domain/use-cases/start-auction/StartAuctionUseCase";
import {GameError} from "../../../domain/errors/GameError";
import {AuctionMapper} from "../../../applications/mappers/auction-mapper/AuctionMapper";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerStartAuctionController {
    private game: Game
    private notificationSystem: NotificationSystem
    private io: Server
    private startAuctionUseCase: StartAuctionUseCase;

    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.startAuctionUseCase = new StartAuctionUseCase(game)
    }

    public execute(data: { nickname: string }): void {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                const auction = this.startAuctionUseCase.execute(player);

                this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} начал аукцион на ${auction.card.name}`)

                const mappedAuction = AuctionMapper.map(auction)
                const players = PlayerMapper.map(this.game.players)

                this.io.emit("update-players-data", {
                    players: players,
                })

                this.io.emit("start-auction", {
                    auction: mappedAuction,
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