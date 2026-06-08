import Player from "./Player";
import {Field, fields, OwnerField} from "./Field";
import {TradeOffer} from "./TradeOffer";
import {Auction} from "./Auction";

export default class Game {
    private static _instance: Game | null = null;
    private _step: number = 0;
    private _countOfPlayers: number;
    private _players: Array<Player> = [];
    private _colors: string[] = ["RED", "GREEN", "BLUE"];
    private _board: Field[] = fields;
    private _ownerFields: OwnerField[];
    private _active: boolean = false;
    private _tradeOffers: TradeOffer[] = [];
    private _auctions: Auction[] = [];

    private constructor(countOfPlayers: number) {
        const indexesToRemove = [0, 2, 4, 7, 10, 17, 20, 22, 30, 33, 36, 38]; //Фильтрация карт при объявлении игры
        this._countOfPlayers = countOfPlayers;
        this._ownerFields = this.board.filter((_, index) => !indexesToRemove.includes(index)) as OwnerField[];
    }

    public static getInstance(countOfPlayers?: number): Game {
        if (!Game._instance) {
            Game._instance = new Game(countOfPlayers || 2);
        }
        return Game._instance;
    }

    public getFieldByPlayerPosition(player: Player) {
        const index = player.position;
        return this.board[index];
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
    }

    public removePlayer(player: Player): void {
        this._players = this._players.filter(p => p !== player);
    }

    public deleteColor(colorToDelete: string): void {
        this._colors = this._colors.filter(existingColor => existingColor !== colorToDelete);
        console.log(this._colors);
    }

    public getPlayerByNickname(nickname: string): Player | undefined {
        return this.players.find(player => player.nickname === nickname);
    }

    public hasColor(color: string) {
        return this.colors.find(c => c === color);
    }

    public roll() {
        const min = 3;
        const max = 18;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private shufflePlayers() {
        this.players.sort(() => Math.random() - Math.random());
    }

    public start() {
        this.shufflePlayers();
        this._active = true;
        this.players[0].makingStep = true;
        this.players[0].makeRoll = false;
    }

    public getCurrentPlayer(): Player {
        return this.players[this.step % this.players.length];
    }

    public nextStep() {
        this.getCurrentPlayer().makingStep = false;
        this.getCurrentPlayer().makeRoll = false;
        this.step++;
        this.getCurrentPlayer().makingStep = true;
        this.getCurrentPlayer().makeRoll = false;
    }

    public getAvalibleOwnerField(player: Player) {
        return this.ownerFields.find(p => p.position === player.position);
    }

    public removeOwnerField(ownerField: OwnerField) {
        const index = this._ownerFields.indexOf(ownerField);
        if (index !== -1) {
            this.ownerFields.splice(index, 1);
        }
    }

    public addTradeOffer(tradeOffer: TradeOffer): void {
        this._tradeOffers.push(tradeOffer);
    }

    public removeTradeOffer(tradeOffer: TradeOffer): void {
        const index = this._tradeOffers.indexOf(tradeOffer);
        if (index !== -1) {
            this.tradeOffers.splice(index, 1);
        }
    }

    public getTradeOfferBySelectedPlayer(player: Player) {
        return this._tradeOffers.find((tradeOffer) =>
            player === tradeOffer.selectedPlayer.player
        )
    }

    public getTradeOfferByPlayer(player: Player) {
        for (const tradeOffer of this._tradeOffers) {
            if (player === tradeOffer.selectedPlayer.player) {
                return tradeOffer
            }
            // } else if (player === tradeOffer.initiator.player) {
            //     return tradeOffer
            // }
        }
    }

    public addAuction(auction: Auction): void {
        this._auctions.push(auction);
    }

    public removeAuction(auction: Auction): void {
        this._auctions.splice(this._auctions.indexOf(auction), 1);
    }

    public getAuction() {
        return this._auctions[0]
    }

    get auctions(): Auction[] {
        return this._auctions;
    }

    get ownerFields(): OwnerField[] {
        return this._ownerFields;
    }

    get board(): Field[] {
        return this._board;
    }

    get step(): number {
        return this._step;
    }

    get countOfPlayers(): number {
        return this._countOfPlayers;
    }

    get players(): Array<Player> {
        return this._players;
    }

    get colors(): string[] {
        return this._colors;
    }

    get tradeOffers(): TradeOffer[] {
        return this._tradeOffers;
    }

    set step(value: number) {
        this._step = value;
    }

    set players(value: Array<Player>) {
        this._players = value;
    }

    set colors(value: string[]) {
        this._colors = value;
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }
}