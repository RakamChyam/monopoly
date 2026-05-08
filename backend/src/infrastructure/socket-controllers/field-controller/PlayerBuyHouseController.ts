import Game from "../../../domain/model/Game";
import {Server} from "socket.io";
import {OwnerField} from "../../../domain/model/Field";
import {BuyHouseUseCase} from "../../../domain/use-cases/buy-house/BuyHouseUseCase";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {GameError} from "../../../domain/errors/GameError";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerBuyHouseController {
    private game: Game;
    private io: Server;
    private notificationSystem: NotificationSystem;
    private buyHouseUseCase: BuyHouseUseCase;

    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.buyHouseUseCase = new BuyHouseUseCase(game);
    }

    public execute(data: { nickname: string, field: OwnerField }) {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            const field = data.field;
            console.log(data.field, data.nickname);
            if (player && field) {
                this.buyHouseUseCase.execute(player, field);

                const players = PlayerMapper.map(this.game.players)

                this.io.emit('update-players-data', {
                    players: players,
                })

                this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} купил дом на ${field.name}`);
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(error.message, error.player)
            }
            console.log(error);
        }

    }
}