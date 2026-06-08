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
import {
    PlayerBuyPropertyController
} from "./infrastructure/socket-controllers/player-controllers/PlayerBuyPropertyController";
import {PlayerActionController} from "./infrastructure/socket-controllers/player-controllers/PlayerActionController";
import {ConnectedPlayerRepository} from "./infrastructure/repository/ConnectedPlayerRepository";
import {ConnectPlayerController} from "./infrastructure/socket-controllers/data-controllers/ConnectPlayerController";
import {PlayerBuyHouseController} from "./infrastructure/socket-controllers/field-controller/PlayerBuyHouseController";
import {TradeOfferController} from "./infrastructure/socket-controllers/trade-controllers/TradeOfferController";
import {GetTradeController} from "./infrastructure/socket-controllers/trade-controllers/GetTradeController";
import {
    PlayerSubmitTradeController
} from "./infrastructure/socket-controllers/trade-controllers/PlayerSubmitTradeController";
import {
    PlayerCancelTradeController
} from "./infrastructure/socket-controllers/trade-controllers/PlayerCancelTradeController";
import {
    PlayerSellHouseController
} from "./infrastructure/socket-controllers/field-controller/PlayerSellHouseController";
import {
    PlayerPutCollateralController
} from "./infrastructure/socket-controllers/field-controller/PlayerPutCollateralController";
import {
    PlayerReturnCollateralController
} from "./infrastructure/socket-controllers/field-controller/playerReturnCollateralController";
import {GetAuctionControllers} from "./infrastructure/socket-controllers/auction-controllers/GetAuctionControllers";
import {
    PlayerStartAuctionController
} from "./infrastructure/socket-controllers/auction-controllers/PlayerStartAuctionController";
import {
    PlayerSubmitBidController
} from "./infrastructure/socket-controllers/auction-controllers/PlayerSubmitBidController";
import {
    PlayerLeaveAuctionController
} from "./infrastructure/socket-controllers/auction-controllers/PlayerLeaveAuctionController";
import {
    PlayerLoseGameController
} from "./infrastructure/socket-controllers/player-controllers/PlayerLoseGameController";
import path from "node:path";
import {PrisonBuyOutController} from "./infrastructure/socket-controllers/player-controllers/PrisonBuyOutController";
import cookieParser from 'cookie-parser';
import {GetMeController} from "./infrastructure/socket-controllers/data-controllers/GetMeController";

const app = express();
const httpServer = createServer(app);
const game = Game.getInstance(2);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

const connectedPlayersRepo = new ConnectedPlayerRepository();
const notificationSystem = new NotificationSystem(io, connectedPlayersRepo);


app.use(cookieParser())

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/client/build')));
app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path.includes('.')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../../frontend/client/build', 'index.html'));
});

io.on('connection', (socket) => {
    const connectPlayerController = new ConnectPlayerController(game, connectedPlayersRepo, io);
    socket.on("player-connected", (data) => {
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
            connectPlayerController.execute(data.nickname, socket.id, cookies)
        }
    })

    const getMeController = new GetMeController(connectedPlayersRepo);
    socket.on('get-me', (data, callback) => {
        console.log("get-me")
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
            getMeController.execute(cookies, callback);
        } else {
            console.log("Нет куков")
        }
    })

    const getPlayersDataController = new GetPlayersDataController(game);
    socket.on('get-players-data', (data, callback) => {
        getPlayersDataController.execute(callback)
    })

    const playerMakeStepController = new PlayerMakeStepController(game, notificationSystem, io);
    socket.on('player-make-step', (data) => {
        playerMakeStepController.execute(data)
    })

    const playerEndTurnController = new PlayerEndTurnController(game, notificationSystem, io);
    socket.on('player-end-turn', (data) => {
        playerEndTurnController.execute(data)
    })

    const playerBuyPropertyController = new PlayerBuyPropertyController(game, notificationSystem, io);
    socket.on('player-buy-property', (data) => {
        console.log(`Player ${data.nickname} buy property`)
        playerBuyPropertyController.execute(data);
    })

    const playerActionController = new PlayerActionController(game, notificationSystem, io);
    socket.on('player-action', (data) => {
        console.log(`Player ${data.nickname} action`)
        playerActionController.execute(data);
    })

    const playerBuyHouseController = new PlayerBuyHouseController(game, notificationSystem, io);
    socket.on('player-buy-house', (data) => {
        console.log(`Player ${data.nickname} buy house`)
        playerBuyHouseController.execute(data);
    })

    const playerSellHouseController = new PlayerSellHouseController(game, notificationSystem, io);
    socket.on('player-sell-house', (data) => {
        console.log(`Player ${data.nickname} sell-house`)
        playerSellHouseController.execute(data);
    })

    const playerPutCollateralController = new PlayerPutCollateralController(game, notificationSystem, io);
    socket.on('player-put-collateral', (data) => {
        console.log(`Player ${data.nickname} put collateral`)
        playerPutCollateralController.execute(data);
    })

    const playerReturnCollateralController = new PlayerReturnCollateralController(game, notificationSystem, io);
    socket.on('player-return-collateral', (data) => {
        console.log(`Player ${data.nickname} return-collateral`)
        playerReturnCollateralController.execute(data);
    })

    const tradeOfferController = new TradeOfferController(game, notificationSystem, io);
    socket.on('player-offer-trade', (data) => {
        console.log(`Player ${data.nickname} offer trade`)
        tradeOfferController.execute(data);
    })

    const getTradeController = new GetTradeController(game);
    socket.on('get-trade', (data, callback) => {
        console.log(`Get trade`)
        getTradeController.execute(data.nickname, callback)
    })

    const playerSubmitTradeController = new PlayerSubmitTradeController(game, notificationSystem, io);
    socket.on('player-submit-trade', (data) => {
        console.log(`Player ${data.nickname} submit trade`)
        playerSubmitTradeController.execute(data);
    })

    const playerCancelTradeController = new PlayerCancelTradeController(game, notificationSystem, io);
    socket.on('player-cancel-trade', (data) => {
        console.log(`Player ${data.nickname} cancel trade`)
        playerCancelTradeController.execute(data);
    })

    const getAuctionController = new GetAuctionControllers(game)
    socket.on("get-auction", (data, callback) => {
        console.log(`Get auction`)
        getAuctionController.execute(callback);
    })

    const playerStartAuctionController = new PlayerStartAuctionController(game, notificationSystem, io);
    socket.on('player-start-auction', (data) => {
        console.log(`Player ${data.nickname} start`)
        playerStartAuctionController.execute(data);
    })

    const playerSubmitBid = new PlayerSubmitBidController(game, io, notificationSystem);
    socket.on('player-submit-bid', (data) => {
        console.log(`Player ${data.nickname} submit bid ${data.bid}`)
        playerSubmitBid.execute(data);
    })

    const playerLeaveAuctionController = new PlayerLeaveAuctionController(game, notificationSystem, io);
    socket.on('player-leave-auction', (data) => {
        console.log(`Player ${data.nickname} leave`)
        playerLeaveAuctionController.execute(data);
    })

    const playerLoseGameController = new PlayerLoseGameController(game, notificationSystem, io);
    socket.on('player-lose-game', (data) => {
        console.log(`Player ${data.nickname} lose`)
        playerLoseGameController.execute(data);
    })

    const prisonBuyOutController = new PrisonBuyOutController(game, notificationSystem, io);
    socket.on('prison-buy-out', (data) => {
        console.log(`Prison buy out`)
        prisonBuyOutController.execute(data);
    })
})


const getColorController = new GetColorsController(game);
app.get('/api/colors', (req: Request, res: Response) => {
    getColorController.execute(req, res);
})


const loginController = new LoginController(game, notificationSystem, io);
app.post('/api/login', (req: Request, res: Response) => {
    loginController.execute(req, res);
})

const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Socket.io ready`);
});