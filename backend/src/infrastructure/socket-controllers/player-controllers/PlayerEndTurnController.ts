import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import Game from "../../../domain/model/Game";
import {PlayerEndTurnUseCase} from "../../../domain/use-cases/end-turn/PlayerEndTurnUseCase";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerEndTurnController {
    private notificationSystem: NotificationSystem
    private io: Server;
    private game: Game;
    private playerEndTurnUseCase: PlayerEndTurnUseCase;

    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.game = game;
        this.playerEndTurnUseCase = new PlayerEndTurnUseCase(game);
    }

    public execute(data: { nickname: string }) {
        try {
            const nickname = data.nickname;
            const player = this.playerEndTurnUseCase.execute(nickname);

            const players = PlayerMapper.map(this.game.players)
            this.io.emit("update-players-data", {
                players: players,
            })

            this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} завершил ход`)
        } catch (error) {
            console.log(error);
        }
    }
}