import Player from "./Player";

export class AuctionParticipant {
    private readonly _player: Player;
    private _makingBid: boolean = false;
    private _bid: number = 0;

    public constructor(player: Player) {
        this._player = player;
    }

    get player(): Player {
        return this._player;
    }

    get makingBid(): boolean {
        return this._makingBid;
    }

    set makingBid(value: boolean) {
        this._makingBid = value;
    }

    get bid(): number {
        return this._bid;
    }

    set bid(value: number) {
        this._bid = value;
    }
}