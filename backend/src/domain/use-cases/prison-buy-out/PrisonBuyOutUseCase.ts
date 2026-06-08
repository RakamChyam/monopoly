import Game from "../../model/Game";
import Player from "../../model/Player";
import {GameError} from "../../errors/GameError";

export class PrisonBuyOutUseCase {
    private buyOutPrice: number = 50;

    public execute(player: Player) {
        if (!player.makingStep) {
            throw new Error("Player can't buy out");
        }

        if (player.balance < this.buyOutPrice) {
            throw new GameError("Недостаточно средств для выкупа", player);
        }

        player.balance -= this.buyOutPrice;
        player.inPrison = false;
        player.makeRoll = player.prisonYears === 3;

        player.prisonYears = 0;

        return player;
    }
}