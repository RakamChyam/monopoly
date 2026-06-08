import {OwnerField} from "./Field";
import {PlayerActions} from "../enums/PlayerActions";

export default class Player {
    private readonly _nickname: string;
    private _balance: number = 1000;
    private readonly _color: string;
    private _position: number = 0;
    private _makingStep: boolean = false;
    private _makeRoll: boolean = false;
    private _cubes: number = 3;
    private _ownerCards: OwnerField[] = [];
    private _action: string = PlayerActions.Nothing;
    private _inTrade: boolean = false;
    private _inPrison: boolean = false;
    private _prisonYears: number = 0;

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

    public addOwnerField(ownerField: OwnerField) {
        this.ownerCards.push(ownerField);
        ownerField.owner = this.nickname;
    }

    public deleteOwnerField(ownerField: OwnerField) {
        const index = this.ownerCards.indexOf(ownerField);
        if (index !== -1) {
            this.ownerCards.splice(index, 1);
        }
    }

    public getLastProperty() {
        return this.ownerCards[this.ownerCards.length - 1];
    }

    public setPositionByCircle(newPosition: number) {
        if (this.position > newPosition) {
            this.position = newPosition;
            this.balance += 200;
        } else {
            this.position = newPosition;
        }
    }

    public getOwnerCard(field: OwnerField) {
        return this.ownerCards.find(c => c.name === field.name && c.position === field.position);
    }

    get ownerCards(): OwnerField[] {
        return this._ownerCards;
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

    get action(): string {
        return this._action;
    }


    get inTrade(): boolean {
        return this._inTrade;
    }

    set inTrade(value: boolean) {
        this._inTrade = value;
    }

    set action(value: string) {
        this._action = value;
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


    get inPrison(): boolean {
        return this._inPrison;
    }

    set inPrison(value: boolean) {
        this._inPrison = value;
    }

    get prisonYears(): number {
        return this._prisonYears;
    }

    set prisonYears(value: number) {
        if (value < 0 || value > 3) {
            throw new Error(`${value} is not a valid number`);
        }
        this._prisonYears = value;
    }
}
