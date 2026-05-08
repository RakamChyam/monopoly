import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {CancelTradeUseCase} from "../../../domain/use-cases/trade/CancelTradeUseCase";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerCancelTradeController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private cancelTradeUseCase: CancelTradeUseCase;


    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.cancelTradeUseCase = new CancelTradeUseCase(game)
    }

    execute(data: { nickname: string; }) {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                const initiator = this.cancelTradeUseCase.execute(player);

                const mappedPlayers = PlayerMapper.map(this.game.players);

                this.io.emit("update-players-data", {
                    players: mappedPlayers,
                })

                this.notificationSystem.sendPrivateMessageToPlayerById(`Предложение ${player.nickname} было отказано`, initiator)
            }
        } catch (err) {
            console.log(err);
        }
    }
}