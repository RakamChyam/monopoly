import {OwnerField} from "../../domain/model/Field";

export interface TradeParticipantClient {
    nickname: string;
    fields: OwnerField[];
    money: number;
}