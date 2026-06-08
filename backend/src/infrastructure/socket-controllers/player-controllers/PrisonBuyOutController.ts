import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {PrisonBuyOutUseCase} from "../../../domain/use-cases/prison-buy-out/PrisonBuyOutUseCase";
import {GameError} from "../../../domain/errors/GameError";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PrisonBuyOutController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server
    private prisonBuyOutUseCase: PrisonBuyOutUseCase;

    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.prisonBuyOutUseCase = new PrisonBuyOutUseCase();
    }

    public execute(data: { nickname: string }) {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                this.prisonBuyOutUseCase.execute(player);

                this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} выкупился из тюрьмы`);

                this.io.emit("update-players-data", {
                    players: PlayerMapper.map(this.game.players),
                })
            }
        } catch (err) {
            if (err instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(err.message, err.player)
            }
            console.log(err);
        }
    }
}