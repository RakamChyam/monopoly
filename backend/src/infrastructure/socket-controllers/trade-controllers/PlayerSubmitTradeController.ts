import Game from "../../../domain/model/Game";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {SubmitTradeUseCase} from "../../../domain/use-cases/trade/SubmitTradeUseCase";
import {GameError} from "../../../domain/errors/GameError";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";

export class PlayerSubmitTradeController {
    private game: Game;
    private notificationSystem: NotificationSystem;
    private io: Server;
    private submitTradeUseCase: SubmitTradeUseCase;


    public constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.submitTradeUseCase = new SubmitTradeUseCase(game);
    }

    public execute(data: { nickname: string }): void {
        try {
            const player = this.game.getPlayerByNickname(data.nickname);
            if (player) {
                const tradeOffer = this.submitTradeUseCase.execute(player)
                if (tradeOffer) {
                    const players = PlayerMapper.map(this.game.players)

                    this.io.emit("update-players-data", {
                        players: players,
                    })

                    this.notificationSystem.sendMessageToAll(`Игроки ${tradeOffer.initiator.player.nickname} и ${tradeOffer.selectedPlayer.player.nickname} заключили сделку`);
                }
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(error.message, error.player);
            }
        }
    }
}