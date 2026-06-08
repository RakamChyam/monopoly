import {OwnerField} from "./Fields";

export default interface Player {
    nickname: string;
    balance: number;
    color: string;
    position: number;
    makingStep: boolean;
    makeRoll: boolean;
    ownerCards: Array<OwnerField>;
    action: string;
    inPrison: boolean;
    prisonYears: number;
    inTrade: boolean;
}