import Game from "../../../domain/model/Game";
import {TradeOfferValidator} from "../../validators/TradeOfferValidator";
import {TradeOfferClient} from "../../model/TradeOfferClient";
import {TradeParticipant} from "../../../domain/model/TradeParticipant";
import {TradeOfferUseCase} from "../../../domain/use-cases/trade/TradeOfferUseCase";
import {NotificationSystem} from "../../notifications/NotificationSystem";
import {Server} from "socket.io";
import {GameError} from "../../../domain/errors/GameError";

export class TradeOfferController {
    private game: Game;
    private tradeOfferValidator: TradeOfferValidator
    private tradeOfferUseCase: TradeOfferUseCase;
    private notificationSystem: NotificationSystem;
    private io: Server;

    constructor(game: Game, notificationSystem: NotificationSystem, io: Server) {
        this.game = game;
        this.notificationSystem = notificationSystem;
        this.io = io;
        this.tradeOfferValidator = new TradeOfferValidator();
        this.tradeOfferUseCase = new TradeOfferUseCase(game)
    }

    public execute(data: { nickname: string, tradeOffer: TradeOfferClient }): void {
        try {
            const result = this.tradeOfferValidator.validate(data);
            if (result.isValid) {
                const initiatorPlayer = this.game.getPlayerByNickname(data.nickname);
                const selectedPlayer = this.game.getPlayerByNickname(data.tradeOffer.selectedPlayer.nickname);
                if (initiatorPlayer && selectedPlayer) {
                    const initiator = new TradeParticipant(initiatorPlayer, data.tradeOffer.initiator.fields, data.tradeOffer.initiator.money)
                    const selectedPlayerTradeParticipant = new TradeParticipant(selectedPlayer, data.tradeOffer.selectedPlayer.fields, data.tradeOffer.selectedPlayer.money)
                    const isCorrect = this.tradeOfferUseCase.execute(initiator, selectedPlayerTradeParticipant)
                    if (isCorrect) {
                        this.notificationSystem.sendPrivateMessageToPlayerById("Трейд успешно отправлен", initiatorPlayer);
                        this.notificationSystem.sendPrivateMessageToPlayerById(`Вам пришел трейд от ${initiatorPlayer.nickname}`, selectedPlayer);
                    }
                }
            } else {
                console.log(result.errors)
            }
        } catch (e) {
            if (e instanceof GameError) {
                this.notificationSystem.sendPrivateMessageToPlayerById(e.message, e.player)
            }
            console.log(e)
        }
    }
}