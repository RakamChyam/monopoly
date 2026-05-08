import Game from "../../model/Game";
import Player from "../../model/Player";
import {PlayerActions} from "../../enums/PlayerActions";
import {GameError} from "../../errors/GameError";

export class ChanceUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player) {
        if (!player.makingStep || player.action !== PlayerActions.Chance) {
            throw new Error("Player can't do chance");
        }

        if (!player.makeRoll) {
            throw new GameError("Бросьте кубики для выполения шанса", player)
        }

        const cubes = player.cubes;

        switch (cubes) {
            case 3:
                player.position = 39;
                break;
            case 4:
                player.setPositionByCircle(5);
                break;
            case 5:
                player.balance += 150;
                break;
            case 6:
                player.setPositionByCircle(24);
                break;
            case 8:
                // player.goToPrison();
                break;
            case 9:
                player.position = 0;
                player.balance += 200;
                break;
            case 10:
                player.balance += 50;
                break;
            case 12:
                player.balance += 50;
                break;
            case 13:
                player.setPositionByCircle(11);
                break;
            case 15:
                const newPosition: number = player.position - 3;
                player.position = newPosition;
                break;
            case 16:
                player.balance -= 15;
                break;
            default:
                console.log(`doChanceAction сработала по дефолту`);
        }
    }
}