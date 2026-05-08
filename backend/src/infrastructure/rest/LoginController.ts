import Game from "../../domain/model/Game";
import {Request, Response} from 'express';
import {LoginValidator} from "../validators/LoginValidator";
import {LoginPlayerUseCase} from "../../domain/use-cases/login-player/LoginPlayerUseCase";
import {NotificationSystem} from "../notifications/NotificationSystem";
import {StartGameUseCase} from "../../domain/use-cases/login-player/StartGameUseCase";
import {Server} from "socket.io";
import {PlayerMapper} from "../../applications/mappers/player-mappers/PlayerMapper";


export class LoginController {
    private game: Game;
    private loginPlayerUseCase: LoginPlayerUseCase;
    private notificationSystem: NotificationSystem;
    private startGameUseCase: StartGameUseCase;
    private io: Server;

    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.loginPlayerUseCase = new LoginPlayerUseCase(game);
        this.notificationSystem = notificationSystem;
        this.startGameUseCase = new StartGameUseCase(game);
        this.io = io;
    }

    execute(req: Request, res: Response) {
        try {
            const {nickname, color} = req.body;

            const validator = new LoginValidator(nickname, color);
            const result = validator.validate();

            if (result.isValid) {
                const newPlayer = this.loginPlayerUseCase.execute(nickname, color)

                res.status(200).send({
                    nickname: newPlayer.nickname,
                    color: newPlayer.color,
                })

                this.notificationSystem.sendMessageToAll(`Игрок ${newPlayer.nickname} присоединился`)

                const players = PlayerMapper.map(this.game.players)
                const isStarted = this.startGameUseCase.execute();

                this.io.emit("update-players-data", {
                    players: players,
                })

                if (isStarted) {
                    this.notificationSystem.sendMessageToAll(`Игра началась! Первым ходит ${this.game.getCurrentPlayer().nickname}`);
                }
            } else {
                res.status(400).send({
                    errors: result.errors,
                })
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({
                    message: err.message,
                })
            }
        }
    }
}