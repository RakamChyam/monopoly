import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {LeaveAuctionUseCase} from "../../../domain/use-cases/leave-auction/LeaveAuctionUseCase";
import {AuctionMapper} from "../../../applications/mappers/auction-mapper/AuctionMapper";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerLeaveAuctionController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private leaveAuctionUseCase: LeaveAuctionUseCase;

    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.leaveAuctionUseCase = new LeaveAuctionUseCase(game);
    }

    public execute(data: { nickname: string }): void {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                const auction = this.leaveAuctionUseCase.execute(player);

                this.io.emit("update-auction-data", {
                    auction: AuctionMapper.map(auction),
                })

                if (auction.isEnd) {
                    this.notificationSystem.sendMessageToAll(`Игрок ${auction.participants[0].player.nickname} выйграл аукцион на ${auction.card.name}`)

                    this.io.emit("update-players-data", {
                        players: PlayerMapper.map(this.game.players)
                    })

                    this.io.emit("auction-end")
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}