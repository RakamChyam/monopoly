import Game from "../../domain/model/Game";
import {ConnectedPlayer} from "../model/ConnectedPlayer";
import Player from "../../domain/model/Player";

export class ConnectedPlayerRepository {
    private game: Game;
    private _connectedPlayers: ConnectedPlayer[] = [];

    constructor(game: Game) {
        this.game = game;
    }

    public addConnectedPlayer(connectedPlayer: ConnectedPlayer) {

        const existingPlayerIndex = this.connectedPlayers.findIndex(
            player => player.player.nickname === connectedPlayer.player.nickname)

        if (existingPlayerIndex !== -1) {
            this._connectedPlayers[existingPlayerIndex].socketId = connectedPlayer.socketId;
        } else {
            this._connectedPlayers.push(connectedPlayer);
        }
    }

    public removeConnectedPlayer(connectedPlayer: ConnectedPlayer) {
        const index = this._connectedPlayers.findIndex(player => player === connectedPlayer);
        if (index !== -1) {
            this._connectedPlayers.splice(index, 1);
        }
    }

    public getConnectedPlayer(player: Player) {
        return this._connectedPlayers.find(CP => CP.player === player);
    }

    get connectedPlayers(): ConnectedPlayer[] {
        return this._connectedPlayers;
    }
}