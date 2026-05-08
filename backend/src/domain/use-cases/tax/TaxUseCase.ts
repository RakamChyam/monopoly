import Game from "../../model/Game";
import Player from "../../model/Player";
import {PlayerActions} from "../../enums/PlayerActions";
import {TaxField} from "../../model/Field";
import {GameError} from "../../errors/GameError";

export class TaxUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player) {
        if (!player.makingStep || player.action !== PlayerActions.PayTax || !player.makeRoll) {
            throw new Error("Player can't pay tax")
        }

        const taxField = this.game.board[player.position] as TaxField;
        if (taxField.value <= player.balance) {
            player.balance -= taxField.value;
        } else {
            throw new GameError(`Недостаточно средств`, player)
        }

    }
}