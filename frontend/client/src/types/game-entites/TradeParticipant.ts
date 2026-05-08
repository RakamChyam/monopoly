import {OwnerField} from "./Fields";

export interface TradeParticipant {
    nickname: string;
    fields: OwnerField[];
    money: number;
}