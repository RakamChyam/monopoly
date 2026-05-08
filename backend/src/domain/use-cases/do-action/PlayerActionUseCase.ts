import Game from "../../model/Game";
import {PlayerActions} from "../../enums/PlayerActions";
import {TreasuryUseCase} from "../treasury/TreasuryUseCase";
import {ChanceUseCase} from "../chance/ChanceUseCase";
import {TaxUseCase} from "../tax/TaxUseCase";
import {PayRentUseCase} from "../pay-rent/PayRentUseCase";

export class PlayerActionUseCase {
    private game: Game;
    private treasuryUseCase: TreasuryUseCase
    private chanceUseCase: ChanceUseCase;
    private taxUseCase: TaxUseCase;
    private payRentUseCase: PayRentUseCase;

    constructor(game: Game) {
        this.game = game;
        this.treasuryUseCase = new TreasuryUseCase(game);
        this.chanceUseCase = new ChanceUseCase(game);
        this.taxUseCase = new TaxUseCase(game);
        this.payRentUseCase = new PayRentUseCase(game);
    }

    public execute(nickname: string) {
        const player = this.game.getPlayerByNickname(nickname);

        if (!player) {
            throw new Error(`Игрок ${nickname} не найден`)
        }

        if (player.action === PlayerActions.Treasury) {
            this.treasuryUseCase.execute(player);
            player.action = PlayerActions.Nothing;
        } else if (player.action === PlayerActions.Chance) {
            this.chanceUseCase.execute(player);
            player.action = PlayerActions.Nothing;
        } else if (player.action === PlayerActions.PayTax) {
            this.taxUseCase.execute(player);
            player.action = PlayerActions.Nothing;
        } else if (player.action === PlayerActions.PayRent) {
            this.payRentUseCase.execute(player);
            player.action = PlayerActions.Nothing;
        } else {
            player.action = PlayerActions.Nothing
        }

        return player;
    }
}