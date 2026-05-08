import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {ReturnCollateralUseCase} from "../../../domain/use-cases/return-collateral/ReturnCollateralUseCase";
import {GameError} from "../../../domain/errors/GameError";
import {OwnerField} from "../../../domain/model/Field";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerReturnCollateralController {
    private game: Game
    private notificationSystem: NotificationSystem
    private io: Server
    private returnCollateralUseCase: ReturnCollateralUseCase


    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.returnCollateralUseCase = new ReturnCollateralUseCase(game);
    }

    public execute(data: { nickname: string; field: OwnerField }): void {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                this.returnCollateralUseCase.execute(player, data.field)

                const players = PlayerMapper.map(this.game.players)

                this.io.emit('update-players-data', {
                    players: players,
                })
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(error.message, error.player)
            }
            console.log(error);
        }
    }
}