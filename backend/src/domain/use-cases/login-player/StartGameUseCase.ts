import Game from "../../model/Game";

export class StartGameUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    execute() {
        if (this.game.countOfPlayers === this.game.players.length) {
            this.game.start()
            return true;
        } else {
            return false;
        }
    }
}