import Player from "../model/Player";

export class GameError extends Error {
    public player: Player

    constructor(message: string, player: Player) {
        super(message);
        this.player = player;
    }
}