import Player from "../../model/Player";
import Game from "../../model/Game";
import {PlayerActions} from "../../enums/PlayerActions";

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
            throw new Error("Игрок не может сделать ход");
        }

        if (player.action === PlayerActions.Chance || player.action === PlayerActions.Treasury) {
            const cubes = this.game.roll();
            player.cubes = cubes;
            player.makeRoll = true;
            console.log(player);
            return player;
        }

        const cubes = this.game.roll();

        player.setPositionByCubes(cubes);
        player.cubes = cubes;
        player.makeRoll = true;

        this.definePlayerAction(player);
        console.log(player);

        return player;
    }

    private definePlayerAction(player: Player) {
        const field = this.game.board[player.position];

        if (!field) {
            throw new Error(`Поле не найдено`)
        }

        const onPropertyFiled = field.type.startsWith("rent_field") || field.type === "communal" || field.type === "railway";

        if (field.type === "tax") {
            player.action = PlayerActions.PayTax;
        } else if (field.type === "chance") {
            player.action = PlayerActions.Chance
            player.makeRoll = false;
        } else if (field.type === "treasury") {
            player.action = PlayerActions.Treasury
            player.makeRoll = false;
        } else if (onPropertyFiled) {
            if ("owner" in field && field.owner && field.owner !== player.nickname) {
                player.action = PlayerActions.PayRent;
            } else if (!("owner" in field)) {
                player.action = PlayerActions.BuyProperty;
            } else if ("owner" in field && field.owner === player.nickname) {
                player.action = PlayerActions.Nothing;
            }
        } else {
            player.action = PlayerActions.Nothing;
        }

        return player;
    }
}