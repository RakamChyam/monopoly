export interface BaseField {
    name: string;
    type: string;
    position: number;
    isRentField: boolean;
    canBuy: boolean;
}

export interface PropertyField extends BaseField {
    price: number;
    color: string;
    houseCost: number;
    houses: number;
    rent: number[];
    collateral: boolean;
    owner: string;
}

export interface TreasuryField extends BaseField {
    type: "treasury";
}

export interface ChanceField extends BaseField {
    type: "chance";
}

export interface TaxField extends BaseField {
    type: "tax";
    value: number;
}

export interface RailwayField extends BaseField {
    type: "railway";
    price: number;
    rent: number[];
    color: string;
    houseCost: 0;
    houses: 0;
    collateral: boolean;
    owner: string;
}

export interface CommunalField extends BaseField {
    type: "communal";
    price: number;
    rent: number[];
    color: string;
    houseCost: 0;
    houses: 0;
    collateral: boolean;
    owner: string;
}

export type GameField = TreasuryField | ChanceField | TaxField;

export type OwnerField = RailwayField | CommunalField | PropertyField;

export type Field = BaseField | OwnerField | GameField;