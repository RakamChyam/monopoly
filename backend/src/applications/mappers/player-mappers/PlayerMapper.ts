import Player from "../../../domain/model/Player";

export class PlayerMapper {
    public static map(players: Player[]) {
        return players.map(player => this.mapSingle(player));
    }

    public static mapSingle(player: Player) {
        return {
            nickname: player.nickname,
            balance: player.balance,
            color: player.color,
            position: player.position,
            makingStep: player.makingStep,
        };
    }
}