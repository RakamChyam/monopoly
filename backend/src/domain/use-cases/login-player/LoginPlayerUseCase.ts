import Player from "../../model/Player";
import Game from "../../model/Game";

export class LoginPlayerUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(nickname: string, color: string) {
        if (this.game.getPlayerByNickname(nickname)) {
            throw new Error(`Игрок с ником ${nickname} уже есть`)
        }

        if (!this.game.hasColor(color)) {
            throw new Error(`Этот цвет недоступен`)
        }

        const newPlayer = new Player(nickname.trim(), color.toUpperCase())
        this.game.addPlayer(newPlayer);
        this.game.deleteColor(color);

        return newPlayer;
    }
}