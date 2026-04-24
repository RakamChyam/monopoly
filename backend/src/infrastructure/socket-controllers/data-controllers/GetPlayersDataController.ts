import Game from "../../../domain/model/Game";
import {PlayerMapper} from "../../../applications/mappers/player-mappers/PlayerMapper";


export class GetPlayersDataController {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(callback: Function) {
        try {
            const players = this.game.players;
            const mappedPlayers = PlayerMapper.map(players);

            callback({
                success: true,
                players: mappedPlayers,
            });

        } catch (error) {
            console.error(error);

            const errorMessage = error instanceof Error
                ? error.message
                : "Что-то пошло не так";

            callback({
                success: false,
                error: errorMessage,
            });
        }
    }
}