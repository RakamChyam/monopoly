import Player from "../game-entites/Player";

export interface GetMeResponse {
    success: boolean;
    player: Player;
}