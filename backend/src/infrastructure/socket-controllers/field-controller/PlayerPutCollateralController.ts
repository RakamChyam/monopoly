import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {PutCollateralUseCase} from "../../../domain/use-cases/put-collateral/PutCollateralUseCase";
import {OwnerField} from "../../../domain/model/Field";
import {GameError} from "../../../domain/errors/GameError";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerPutCollateralController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private putCollateralUseCase: PutCollateralUseCase;


    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.putCollateralUseCase = new PutCollateralUseCase(game);
    }

    public execute(data: { nickname: string, field: OwnerField }) {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                this.putCollateralUseCase.execute(player, data.field)

                const players = PlayerMapper.map(this.game.players)

                this.io.emit('update-players-data', {
                    players: players,
                })
                
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(error.message, error.player);
            }
            console.log(error);
        }
    }
}