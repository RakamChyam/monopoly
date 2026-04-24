import Player from "../../model/Player";
import Game from "../../model/Game";

export class PlayerMakeStepUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(playerNickname: string) {
        const player = this.game.getPlayerByNickname(playerNickname);

        if (!player) {
            console.log(`Player ${playerNickname} not found`);
            throw new Error("Игрок с таким ником не найден");
        }

        if (player.makeRoll || !player.makingStep) {
            console.log(`Player ${playerNickname} cant move`);
            throw new Error("Игрок не может сдлеать ход");
        }

        const cubes = this.game.roll();
        console.log(cubes);

        player.setPositionByCubes(cubes);
        player.cubes = cubes;
        player.makeRoll = true;

        console.log(player);

        return player;
    }
}