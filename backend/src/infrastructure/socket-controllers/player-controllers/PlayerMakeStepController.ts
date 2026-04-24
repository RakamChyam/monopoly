import {PlayerMakeStepUseCase} from "../../../domain/use-cases/make-step/PlayerMakeStepUseCase";
import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerMakeStepController {
    private playerMakeStepUseCase: PlayerMakeStepUseCase;
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;

    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.playerMakeStepUseCase = new PlayerMakeStepUseCase(game);
        this.io = io;
    }

    public execute(data: { nickname: string }) {
        try {
            const nickname = data.nickname;
            const player = this.playerMakeStepUseCase.execute(nickname);
            const field = this.game.getFieldByPlayerPosition(player);

            const players = PlayerMapper.map(this.game.players)
            this.io.emit("update-players-data", {
                players: players,
            })

            this.notificationSystem.sendMessageToAll(`Игроку выпало ${player.cubes}. Теперь он на ${field.name}`);
        } catch (error) {
            console.error(error);
        }
    }
}