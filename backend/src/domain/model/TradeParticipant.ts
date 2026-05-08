import Player from "./Player";
import {OwnerField} from "./Field";

export class TradeParticipant {
    private _player: Player;
    private _fieldsToTrade: OwnerField[];
    private _moneyForTrade: number;


    public constructor(player: Player, fieldsToTrade: OwnerField[], moneyForTrade: number) {
        this._player = player;
        this._fieldsToTrade = fieldsToTrade;
        this._moneyForTrade = moneyForTrade;
    }


    get player(): Player {
        return this._player;
    }

    get fieldsToTrade(): OwnerField[] {
        return this._fieldsToTrade;
    }

    get moneyForTrade(): number {
        return this._moneyForTrade;
    }


    set fieldsToTrade(value: OwnerField[]) {
        this._fieldsToTrade = value;
    }
}