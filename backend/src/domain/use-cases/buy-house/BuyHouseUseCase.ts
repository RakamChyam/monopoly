import Game from "../../model/Game";
import Player from "../../model/Player";
import {OwnerField} from "../../model/Field";
import {GameError} from "../../errors/GameError";

export class BuyHouseUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player, field: OwnerField) {
        const gameField = player.getOwnerCard(field);

        if (!gameField) {
            throw new Error("Поле не найдено");
        }

        if (!gameField.type.startsWith("rent_field")) {
            throw new Error("Неверное значение (тип карточки)");
        }

        // Проверка на максимальное количество домов
        if (gameField.houses >= 5) {
            throw new GameError("У поля максимальное значение домов", player);
        }

        // Проверка баланса
        if (player.balance < gameField.houseCost) {
            throw new GameError("Недостаточно средств для покупки дома", player);
        }

        // Получаем все карты того же типа (цвета)
        const cardsWithCardType = player.ownerCards.filter(
            (c) => c.type === gameField.type
        )

        // Проверка полноты набора территории
        if (
            gameField.type === "rent_field_1" ||
            gameField.type === "rent_field_8"
        ) {
            if (cardsWithCardType.length !== 2) {
                throw new GameError("Нехватает территории для покупки домов", player);
            }
        } else {
            if (cardsWithCardType.length !== 3) {
                throw new GameError("Нехватает территории для покупки домов", player);
            }
        }

        // Проверка равномерности покупки домов с учетом БУДУЩЕГО количества
        const futureHouses = gameField.houses + 1;

        cardsWithCardType.forEach((c) => {
            if (c.name !== gameField.name) {
                if (Math.abs(futureHouses - c.houses) > 1) {
                    throw new GameError(
                        "Покупать дома нужно равномерно по всей территории одного цвета",
                        player
                    );
                }
            }
        });

        player.balance -= gameField.houseCost;
        gameField.houses += 1;

        return player;
    }
}