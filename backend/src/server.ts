import express, {Request, Response} from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import Game from "./domain/model/Game";
import {GetColorsController} from "./infrastructure/rest/GetColorsController";
import {LoginController} from "./infrastructure/rest/LoginController";
import {GetPlayersDataController} from "./infrastructure/socket-controllers/data-controllers/GetPlayersDataController";
import {NotificationSystem} from "./infrastructure/notifications/NotificationSystem";
import {
    PlayerMakeStepController
} from "./infrastructure/socket-controllers/player-controllers/PlayerMakeStepController";
import {PlayerEndTurnController} from "./infrastructure/socket-controllers/player-controllers/PlayerEndTurnController";

const app = express();
const httpServer = createServer(app);
const game = Game.getInstance();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const notificationSystem = new NotificationSystem(io);

app.use(express.json());

io.on('connection', (socket) => {
    console.log("Socket connection connected");

    const getPlayersDataController = new GetPlayersDataController(game);
    socket.on('get-players-data', (data, callback) => {
        console.log("Got players data")
        getPlayersDataController.execute(callback)
    })


    const playerMakeStepController = new PlayerMakeStepController(game, notificationSystem, io);
    socket.on('player-make-step', (data) => {
        console.log(`Player ${data.nickname} make step`)
        playerMakeStepController.execute(data)
    })

    const playerEndTurnController = new PlayerEndTurnController(game, notificationSystem, io);
    socket.on('player-end-turn', (data) => {
        console.log(`Player ${data.nickname} end turn`)
        playerEndTurnController.execute(data)
    })
})

const getColorController = new GetColorsController(game);
app.get('/api/colors', (req: Request, res: Response) => {
    console.log("API COLORS")
    getColorController.execute(req, res);
})


const loginController = new LoginController(game, notificationSystem, io);
app.post('/api/login', (req: Request, res: Response) => {
    console.log("API LOGIN")
    loginController.execute(req, res);
})


const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Socket.io ready`);
});