import Game from "../../model/Game";
import {GameError} from "../../errors/GameError";
import {PlayerActions} from "../../enums/PlayerActions";

export class PlayerBuyPropertyUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    execute(nickname: string) {
        const player = this.game.getPlayerByNickname(nickname);

        if (!player) {
            throw new Error("Player not found");
        }

        if (!player.makeRoll || !player.makingStep) {
            throw new Error("Player can't buy property");
        }

        const property = this.game.getAvalibleOwnerField(player);

        if (!property) {
            throw new GameError("Owner field not found", player);
        }

        if (player.balance >= property.price) {
            player.balance -= property.price;
            player.addOwnerField(property);
            property.owner = player.nickname;
            this.game.removeOwnerField(property);
            player.action = PlayerActions.Nothing;
        } else {
            throw new GameError("Недостаточно средств", player)
        }

        return player;
    }
}