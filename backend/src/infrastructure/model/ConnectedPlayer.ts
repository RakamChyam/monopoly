import Player from "../../domain/model/Player";

export class ConnectedPlayer {
    private _player: Player;
    private _socketId: string;
    private _playerId: string;

    constructor(player: Player, socketId: string, playerId: string) {
        this._player = player;
        this._socketId = socketId;
        this._playerId = playerId;
    }

    get playerId(): string {
        return this._playerId;
    }

    set playerId(value: string) {
        this._playerId = value;
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