import Game from "../../model/Game";
import Player from "../../model/Player";
import {OwnerField} from "../../model/Field";
import {GameError} from "../../errors/GameError";

export class SellHouseUseCase {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(player: Player, field: OwnerField) {
        const gameField = player.getOwnerCard(field);

        if (!gameField) {
            throw new Error("Карточка не найдена");
        }

        if (!gameField.type.startsWith("rent_field")) {
            throw new Error("Неверное значение (тип карточки)");
        }

        // Проверка на наличие домов для продажи
        if (gameField.houses === 0) {
            throw new GameError("На этом поле нет домов для продажи", player);
        }

        // Получаем все карты того же типа (цвета)
        const cardsWithCardType = player.ownerCards.filter(
            (c) => c.type === gameField.type
        );

        // Проверка полноты набора территории
        if (
            gameField.type === "rent_field_1" ||
            gameField.type === "rent_field_8"
        ) {
            if (cardsWithCardType.length !== 2) {
                throw new GameError("Нехватает территории для продажи домов", player);
            }
        } else {
            if (cardsWithCardType.length !== 3) {
                throw new GameError("Нехватает территории для продажи домов", player);
            }
        }

        // Проверка равномерности продажи домов с учетом БУДУЩЕГО количества
        const futureHouses = gameField.houses - 1;

        cardsWithCardType.forEach((c) => {
            if (c.name !== gameField.name) {
                if (Math.abs(futureHouses - c.houses) > 1) {
                    throw new GameError(
                        "Продавать дома нужно равномерно по всей территории одного цвета",
                        player
                    );
                }
            }
        });


        const sellPrice = Math.floor(gameField.houseCost / 2);

        player.balance += sellPrice;
        gameField.houses -= 1;

        return player;
    }
}