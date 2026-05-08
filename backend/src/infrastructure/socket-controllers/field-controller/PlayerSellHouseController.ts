import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {SellHouseUseCase} from "../../../domain/use-cases/sell-house/SellHouseUseCase";
import {Server} from "socket.io";
import Player from "../../../domain/model/Player";
import {OwnerField} from "../../../domain/model/Field";
import {GameError} from "../../../domain/errors/GameError";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerSellHouseController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private sellHouseUseCase: SellHouseUseCase;


    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.sellHouseUseCase = new SellHouseUseCase(game);
    }

    public execute(data: { nickname: string, field: OwnerField }) {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                this.sellHouseUseCase.execute(player, data.field);

                const players = PlayerMapper.map(this.game.players)

                this.io.emit('update-players-data', {
                    players: players,
                })

                this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} продал дом на ${data.field.name}`);
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(error.message, error.player);
            }
            console.log(error);
        }
    }
}