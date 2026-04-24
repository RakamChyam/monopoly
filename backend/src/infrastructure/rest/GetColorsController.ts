import Game from "../../domain/model/Game";
import { Request, Response } from 'express';

export class GetColorsController {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public execute(req: Request, res: Response) {
        try {
            res.status(200).send({
                status: "success",
                colors: this.game.colors,
            });
        } catch(err) {
            console.error(err);
            res.status(500).send({
                status: "error",
                message: "Failed to fetch colors"
            });
        }
    }
}