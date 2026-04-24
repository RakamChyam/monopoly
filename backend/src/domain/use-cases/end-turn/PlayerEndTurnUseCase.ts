import Game from "../../model/Game";

export class PlayerEndTurnUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(nickname: string) {
        const player = this.game.getPlayerByNickname(nickname);

        if (!player) {
            throw new Error(`Player ${nickname} not found`);
        }

        if (!player.makingStep || !player.makeRoll) {
            throw new Error(`Player ${nickname} can't end turn`);
        }

        this.game.nextStep();

        return player;
    }
}