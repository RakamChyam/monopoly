import Game from "../../model/Game";
import Player from "../../model/Player";
import {PlayerActions} from "../../enums/PlayerActions";
import {GameError} from "../../errors/GameError";

export class TreasuryUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player): void {
        if (!player.makingStep || player.action !== PlayerActions.Treasury) {
            throw new Error("Player can't do treasury action")
        }

        if (!player.makeRoll) {
            throw new GameError("Бросьте кубики для выполнения казны", player)
        }

        const cubes = player.cubes;
//не все прописаны
        switch (cubes) {
            case 3:
                player.balance += 50;
                break;
            case 4:
                player.balance -= 50;
                break;
            case 5:
                player.balance += 100;
                break;
            case 6:
                player.balance += 100;
                break;
            case 7:
                player.balance -= 50;
                break;
            case 8:
                player.balance += 20;
                break;
            case 9:
                player.balance -= 100;
                break;
            case 10:
                break;
            case 11:
                player.balance += 25;
                break;
            case 13:
                player.balance += 100;
                break;
            case 14:
                player.balance += 50;
                break;
            case 15:
                player.balance += 10;
                break;
            case 17:
                player.position = 0;
                player.balance += 200;
                break;
            case 18:
                player.balance += 200;
                break;
            default:
                console.log(`doTreasuryAction сработала по дефолту`);
        }
    }
}