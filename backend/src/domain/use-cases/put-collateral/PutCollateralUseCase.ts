import Game from "../../model/Game";
import Player from "../../model/Player";
import {OwnerField} from "../../model/Field";
import {GameError} from "../../errors/GameError";

export class PutCollateralUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player, field: OwnerField) {
        const gameField = player.getOwnerCard(field);
        if (!gameField) {
            throw new Error(`Unable to find field ${field}`);
        }

        if (gameField.collateral) {
            throw new Error(`Нельзя положить карту в залог`);
        }

        if ("houses" in gameField) {
            if (gameField.houses !== 0) {
                throw new GameError("Нельзя положить в залог территорию с домами", player)
            }
        }


        const money = Math.floor(gameField.price / 2);

        player.balance += money;
        gameField.collateral = true;
    }
}