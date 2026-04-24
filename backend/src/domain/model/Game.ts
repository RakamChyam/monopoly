import Player from "./Player";
import {Field, fields} from "./Field";

export default class Game {
    private static _instance: Game | null = null;
    private _step: number = 0;
    private _countOfPlayers: number;
    private _players: Array<Player> = [];
    private _colors: string[] = ["RED", "GREEN", "BLUE"];
    private _board: Field[] = fields;
    private active: boolean = false;


    private constructor(countOfPlayers: number) {
        this._countOfPlayers = countOfPlayers;
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
        return this.colors.find(color => color === color);
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
        this.active = true;
        this.players[0].makingStep = true;
        this.players[0].makeRoll = false;
    }

    public getCurrentPlayer(): Player {
        return this.players[this.step % this.countOfPlayers];
    }

    public nextStep() {
        this.getCurrentPlayer().makingStep = false;
        this.getCurrentPlayer().makeRoll = false;
        this.step++;
        this.getCurrentPlayer().makingStep = true;
        this.getCurrentPlayer().makeRoll = false;
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

    set step(value: number) {
        this._step = value;
    }

    set players(value: Array<Player>) {
        this._players = value;
    }

    set colors(value: string[]) {
        this._colors = value;
    }

}