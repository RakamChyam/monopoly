export default class Player {
    private readonly _nickname: string;
    private _balance: number = 1000;
    private readonly _color: string;
    private _position: number = 0;
    private _makingStep: boolean = false;
    private _makeRoll: boolean = false;
    private _cubes: number = 3;

    public constructor(nickname: string, color: string) {
        this._nickname = nickname;
        this._color = color;
    }

    public setPositionByCubes(cubes: number) {
        if (cubes > 18 && cubes < 3) {
            throw new Error(
                "Неверное значение передано в установке позиции в setPositionByCubes",
            );
        }

        let newPosition: number = this.position + cubes;

        if (newPosition > 39) {
            newPosition = newPosition - 40;
            this.position = newPosition;
            this.balance += 200;
        } else {
            this.position = newPosition;
        }
    }

    get nickname(): string {
        return this._nickname;
    }

    get balance(): number {
        return this._balance;
    }

    get color(): string {
        return this._color;
    }

    get position(): number {
        return this._position;
    }

    get makingStep(): boolean {
        return this._makingStep;
    }

    get makeRoll(): boolean {
        return this._makeRoll;
    }

    get cubes(): number {
        return this._cubes;
    }

    set cubes(value: number) {
        if (value < 3 && value > 18) {
            throw new Error("Неверное значение передано в cubes")
        }
        this._cubes = value;
    }

    set makeRoll(value: boolean) {
        this._makeRoll = value;
    }

    set balance(value: number) {
        if (value >= 0) {
            this._balance = value;
        } else {
            throw new Error(`${value} is not a valid number`);
        }
    }

    set position(value: number) {
        if (value >= 0 && value < 40) {
            this._position = value;
        } else {
            throw new Error(`${value} is not a valid number`);
        }
    }

    set makingStep(value: boolean) {
        this._makingStep = value;
    }
}
