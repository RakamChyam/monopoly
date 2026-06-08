import Player from "../../../domain/model/Player";
import {OwnerField} from "../../../domain/model/Field";

export class PlayerMapper {
    public static map(players: Player[]) {
        return players.map(player => this.mapSingle(player));
    }

    public static mapSingle(player: Player) {
        return {
            nickname: player.nickname,
            balance: player.balance,
            color: player.color,
            position: player.position,
            makingStep: player.makingStep,
            makeRoll: player.makeRoll,
            ownerCards: this.sortOwnerCards(player.ownerCards),
            action: player.action,
            inPrison: player.inPrison,
            prisonYears: player.prisonYears,
            inTrade: player.inTrade,
        };
    }

    private static sortOwnerCards(cards: OwnerField[]): OwnerField[] {
        if (!cards || cards.length === 0) return [];

        return [...cards].sort((a, b) => {
            // Функция для получения приоритета типа
            const getTypePriority = (type: string): number => {
                if (type.startsWith("rent_field")) return 1;
                if (type === "railway") return 2;
                if (type === "communal") return 3;
                return 4; // для любых других типов
            };

            const priorityA = getTypePriority(a.type);
            const priorityB = getTypePriority(b.type);

            // Если приоритеты разные, сортируем по приоритету
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Если приоритеты одинаковые, сортируем по позиции
            return a.position - b.position;
        });
    }
}