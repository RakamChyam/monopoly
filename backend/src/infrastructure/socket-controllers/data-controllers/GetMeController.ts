import Game from "../../../domain/model/Game";
import CookieManager from "../../application/CookieManager";
import {ConnectedPlayerRepository} from "../../repository/ConnectedPlayerRepository";

export class GetMeController {
    private connectedPlayersRepo: ConnectedPlayerRepository;

    constructor(connectedPlayersRepo: ConnectedPlayerRepository) {
        this.connectedPlayersRepo = connectedPlayersRepo;
    }

    public execute(cookies: string, callback: Function) {
        try {
            const id = CookieManager.parse(cookies).playerId;
            if (id) {
                const player = this.connectedPlayersRepo.getPlayerById(id)
                if (player) {
                    console.log(player);
                    callback({
                        success: true,
                        player: player,
                    })
                } else {
                    callback({
                        success: false,
                        player: null,
                    })
                }
            } else {
                callback({
                    success: false,
                    player: null,
                })
            }
        } catch (e) {
            console.error(e);
        }
    }
}