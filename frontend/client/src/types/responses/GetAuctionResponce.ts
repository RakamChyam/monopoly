import {Auction} from "../game-entites/Auction";

export interface GetAuctionResponce {
    success: boolean;
    auction: Auction;
}