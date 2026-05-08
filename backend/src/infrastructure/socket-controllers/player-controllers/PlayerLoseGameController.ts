import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {LoseGameUseCase} from "../../../domain/use-cases/lose-game/LoseGameUseCase";
import {GameError} from "../../../domain/errors/GameError";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerLoseGameController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private loseGameUseCase: LoseGameUseCase;

    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.loseGameUseCase = new LoseGameUseCase(game);
    }

    public execute(data: { nickname: string }): void {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                this.loseGameUseCase.execute(player);

                if (this.game.players.length === 1) {
                    const winner = this.game.players[0];
                    this.notificationSystem.sendMessageToAll(`Игрок ${winner.nickname} победил`);

                    this.io.emit("player-win", {
                        winner: winner,
                    })
                }

                this.notificationSystem.sendMessageToAll(`Игрок ${player.nickname} проиграл`)


                this.io.emit("update-players-data", {
                    players: PlayerMapper.map(this.game.players)
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