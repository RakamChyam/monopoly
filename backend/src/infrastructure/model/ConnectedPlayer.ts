import Player from "../../domain/model/Player";

export class ConnectedPlayer {
    private _player: Player;
    private _socketId: string;

    constructor(player: Player, socketId: string) {
        this._player = player;
        this._socketId = socketId;
    }

    get player(): Player {
        return this._player;
    }

    get socketId(): string {
        return this._socketId;
    }

    set socketId(value: string) {
        this._socketId = value;
    }
}