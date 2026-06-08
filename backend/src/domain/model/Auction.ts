import {OwnerField} from "./Field";
import {AuctionParticipant} from "./AuctionParticipant";
import Player from "./Player";

export class Auction {
    private _card: OwnerField;
    private _participants: AuctionParticipant[] = [];
    private _step: number = 0;
    private _maxBid: number = 0;
    private _isEnd: boolean = false;

    public constructor(card: OwnerField) {
        this._card = card;
    }

    public addParticipant(participant: AuctionParticipant) {
        this._participants.push(participant);
    }

    public removeParticipant(participant: AuctionParticipant) {
        this._participants.splice(this._participants.indexOf(participant), 1);
    }

    public nextTurn() {
        this.getCurrentParticipant().makingBid = false
        this._step++;
        this.getCurrentParticipant().makingBid = true;
    }

    public getCurrentParticipant() {
        return this._participants[this._step % this._participants.length];
    }

    public start() {
        this._participants[0].makingBid = true;
    }

    public getParticipantByPlayer(player: Player) {
        return this._participants.find(p => p.player === player);
    }


    get maxBid(): number {
        return this._maxBid;
    }

    set maxBid(value: number) {
        this._maxBid = value;
    }

    get card(): OwnerField {
        return this._card;
    }

    get participants(): AuctionParticipant[] {
        return this._participants;
    }

    get step(): number {
        return this._step;
    }

    set step(value: number) {
        this._step = value;
    }

    get isEnd(): boolean {
        return this._isEnd;
    }

    set isEnd(value: boolean) {
        this._isEnd = value;
    }
}