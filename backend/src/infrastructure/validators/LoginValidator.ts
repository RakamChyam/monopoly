export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export class LoginValidator {
    constructor(
        private nickname: string,
        private color: string
    ) {}

   public validate(): ValidationResult {
        const errors: ValidationError[] = [];

        if (!this.nickname || this.nickname.trim().length === 0) {
            errors.push({
                field: 'nickname',
                message: 'Никнейм не может быть пустым'
            });
        } else if (this.nickname.length < 3) {
            errors.push({
                field: 'nickname',
                message: 'Никнейм должен быть не менее 3 символов'
            });
        } else if (this.nickname.length > 20) {
            errors.push({
                field: 'nickname',
                message: 'Никнейм должен быть не более 20 символов'
            });
        }

        if (!this.color) {
            errors.push({
                field: 'color',
                message: 'Цвет обязателен',
            });
        }

        if (errors.length > 0) {
            return { isValid: false, errors };
        }

        return {
            isValid: true,
            errors: [],
        };
    }
}