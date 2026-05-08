import Game from "../../model/Game";
import Player from "../../model/Player";
import {GameError} from "../../errors/GameError";
import {OwnerField} from "../../model/Field";

export class PayRentUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player) {
        const field = this.game.getFieldByPlayerPosition(player)
        if ("owner" in field) {
            const owner = this.game.getPlayerByNickname(field.owner);
            if (owner) {
                const rent = this.defineRent(field, owner, player)
                if (player.balance >= rent) {
                    player.balance -= rent;
                    owner.balance += rent;
                } else {
                    console.log(field)
                    throw new GameError("Недостаточно средств", player);
                }
            } else {
                throw new Error("Игрок не найден")
            }
        } else {
            throw new Error("У поля нет владельца")
        }
    }

    private defineRent(field: OwnerField, owner: Player, player: Player) {
        let rent = 0;

        if (field.type.startsWith("rent_field")) {
            const cardsWithCardType = owner.ownerCards.filter(
                (c) => c.type === field.type
            )

            if (field.type === "rent_field_1" || field.type === "rent_field_8") {
                if (cardsWithCardType.length === 2 && field.houses === 0) {
                    rent = field.rent[field.houses] * 2
                    return rent
                }
            } else {
                if (cardsWithCardType.length === 3 && field.houses === 0) {
                    rent = field.rent[field.houses] * 2
                    return rent
                }
            }

            rent = field.rent[field.houses]
            return rent
        }

        if (field.type === "communal") {
            let communalCount = 0;
            for (const field of owner.ownerCards) {
                if (field.type === "communal") {
                    communalCount++;
                }
            }
            rent = player.cubes * field.rent[communalCount - 1]
            return rent;
        }

        if (field.type === "railway") {
            let railwayCount = 0;
            for (const field of owner.ownerCards) {
                if (field.type === "railway") {
                    railwayCount++;
                }
            }
            rent = player.cubes * field.rent[railwayCount - 1]
            return rent;
        }

        return rent;
    }
}