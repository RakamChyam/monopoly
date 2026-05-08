import {TradeOfferClient} from "../model/TradeOfferClient";

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export class TradeOfferValidator {
    validate(data: { nickname: string; tradeOffer: TradeOfferClient }): ValidationResult {
        const errors: string[] = [];

        // 1. Валидация nickname
        if (!data.nickname) {
            errors.push("Player nickname is required");
        } else if (typeof data.nickname !== "string") {
            errors.push("Player nickname is not string");
        } else if (data.nickname.trim().length < 3 || data.nickname.trim().length > 20) {
            errors.push("Player nickname has wrong format (must be 3-20 characters)");
        }

        // 2. Валидация наличия tradeOffer
        if (!data.tradeOffer) {
            errors.push("Trade offer is required");
            return {isValid: false, errors};
        }

        // 3. Валидация участников
        const {initiator, selectedPlayer} = data.tradeOffer;

        if (!initiator || !selectedPlayer) {
            errors.push("Trade offer participants (initiator and selectedPlayer) are required");
        }

        // 4. Валидация initiator
        if (initiator) {
            // Проверка nickname инициатора
            if (!initiator.nickname) {
                errors.push("Initiator: nickname is required");
            } else if (initiator.nickname.trim().length < 3 || initiator.nickname.trim().length > 20) {
                errors.push("Initiator: nickname has wrong format (must be 3-20 characters)");
            }

            // Проверка соответствия nickname
            if (initiator.nickname && data.nickname !== initiator.nickname) {
                errors.push("Player nickname does not match initiator nickname");
            }

            // Проверка moneyForTrade
            if (typeof initiator.money !== "number") {
                errors.push("Initiator: moneyForTrade is not a number");
            } else if (isNaN(initiator.money)) {
                errors.push("Initiator: moneyForTrade is NaN");
            } else if (!isFinite(initiator.money)) {
                errors.push("Initiator: moneyForTrade is not finite");
            } else if (initiator.money < 0) {
                errors.push("Initiator: moneyForTrade has not valid value");
            }

            // Проверка fields (может быть пустым массивом)
            if (initiator.fields === undefined || initiator.fields === null) {
                errors.push("Initiator: fields is required");
            } else if (!Array.isArray(initiator.fields)) {
                errors.push("Initiator: fields is not an array");
            }
        }

        // 5. Валидация selectedPlayer
        if (selectedPlayer) {
            // Проверка nickname выбранного игрока
            if (!selectedPlayer.nickname) {
                errors.push("SelectedPlayer: nickname is required");
            } else if (selectedPlayer.nickname.trim().length < 3 || selectedPlayer.nickname.trim().length > 20) {
                errors.push("SelectedPlayer: nickname has wrong format (must be 3-20 characters)");
            }

            // Проверка moneyForTrade
            if (typeof selectedPlayer.money !== "number") {
                errors.push("SelectedPlayer: moneyForTrade is not a number");
            } else if (isNaN(selectedPlayer.money)) {
                errors.push("SelectedPlayer: moneyForTrade is NaN");
            } else if (!isFinite(selectedPlayer.money)) {
                errors.push("SelectedPlayer: moneyForTrade is not finite");
            } else if (selectedPlayer.money < 0) {
                errors.push("SelectedPlayer: moneyForTrade has not valid value");
            }

            // Проверка fields
            if (selectedPlayer.fields === undefined || selectedPlayer.fields === null) {
                errors.push("SelectedPlayer: fields is required");
            } else if (!Array.isArray(selectedPlayer.fields)) {
                errors.push("SelectedPlayer: fields is not an array");
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
        };
    }
}