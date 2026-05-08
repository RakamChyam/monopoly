import Game from "../../model/Game";
import Player from "../../model/Player";
import {OwnerField} from "../../model/Field";
import {GameError} from "../../errors/GameError";

export class ReturnCollateralUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    execute(player: Player, field: OwnerField) {
        const gameField = player.getOwnerCard(field);
        if (!gameField) {
            throw new Error(`Unable to find field ${field}`);
        }

        if (!gameField.collateral) {
            throw new Error(`Нельзя вернуть карту из залога`);
        }

        const money = Math.ceil((gameField.price / 2) * 1.1);

        if (player.balance >= money) {
            player.balance -= money;
            gameField.collateral = false;
        } else {
            throw new GameError("Недостаточно средств", player)
        }
    }
}