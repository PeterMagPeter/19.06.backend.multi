"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWebSocketConnection = void 0;
const socket_io_1 = require("socket.io");
const GameController_Multiplayer_1 = require("./gamelogic/GameController_Multiplayer");
const GameController_Playtest_1 = require("./gamelogic/GameController_Playtest");
const Board_1 = require("./gamelogic/Board");
const Ship_1 = require("./gamelogic/Ship");
const logger_1 = require("./logger");
const gameControllers = new Map();
function startWebSocketConnection(server) {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    console.log("WebSocket server started");
    let playerBoards = {};
    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);
        // join a room/ lobby,
        socket.on("sendJoinRoom", (room, username) => {
            socket.join(room);
            socket.username = username;
            console.log(`${socket.username} joined room: ${room}`);
            if (updateRoomCount(room) == 2) {
                logger_1.logger.debug(" start shipplacement");
                io.to(room).emit("startShipPlacement");
            }
        });
        socket.testee = null;
        socket.on("sendShipPlacement", (body, username, roomId, difficulty) => {
            // logger.info("Received ship placement: " + JSON.stringify(body));
            let fieldSize = 10;
            let arr = Array.from({ length: fieldSize }, () => Array(fieldSize).fill("."));
            let playerShips = [];
            for (const ship of body) {
                for (let i = 0; i < ship.length; i++) {
                    let x = ship.startX;
                    let y = ship.startY;
                    let id = ship.identifier;
                    arr[y][x] = id;
                    if (ship.direction == "Y") {
                        arr[y + i][x] = id;
                    }
                    else {
                        arr[y][x + i] = id;
                    }
                }
                let isHorizontal = ship.direction === "X" ? true : false;
                let position = { x: ship.startX, y: ship.startY };
                playerShips.push(new Ship_1.Ship(ship.identifier, isHorizontal, position, ship.length));
            }
            const playerBoard = new Board_1.Board(10, 6, username, arr, playerShips, roomId);
            logger_1.logger.info("player board created");
            if (difficulty) {
                // create ai GameController
                logger_1.logger.info("createt ai testee");
                socket.testee = new GameController_Playtest_1.AiGameController(playerBoard, socket, username, difficulty, roomId);
                // noch gamestart emit machen damit man direkt gegen ki spielen kann
            }
            else {
                playerBoards[username] = playerBoard;
                allPlayersReady(io, roomId, playerBoards);
            }
        });
        socket.on("sendShot", (body) => {
            logger_1.logger.info("Received shot at: " + body.x + " " + body.y, " room: ", body.roomId);
            if (gameControllers.has(body.roomId)) {
                const gameController = gameControllers.get(body.roomId);
                gameController.shoot(body.username, { x: body.x, y: body.y });
            }
            else {
                logger_1.logger.error("testee is not an instance of GameController or AiGameController");
            }
        });
        socket.on('sendLeaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(`Benutzer ${socket.id} hat den Raum ${roomId} verlassen.`);
            // Prüfen, ob der Raum leer ist
            const room = io.sockets.adapter.rooms.get(roomId);
            if (!room || room.size === 0) {
                // Raum existiert nicht mehr oder ist leer
                gameControllers.delete(roomId);
                console.log(`Raum ${roomId} und zugehöriger GameController gelöscht.`);
            }
        });
        // get the number of people in one room
        function updateRoomCount(room) {
            var _a;
            const roomCount = ((_a = io.sockets.adapter.rooms.get(room)) === null || _a === void 0 ? void 0 : _a.size) || 0;
            io.to(room).emit("roomCount", roomCount);
            return roomCount;
        }
        // check if all players are ready
        function allPlayersReady(io, roomId, playerBoards) {
            let count = Object.keys(playerBoards).length;
            if (count === 2) {
                const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
                if (!socketsInRoom || socketsInRoom.size !== 2) {
                    console.log(`Not enough players ready in room ${roomId}`);
                    return;
                }
                const boardsWithRoomId = [];
                for (const username in playerBoards) {
                    if (playerBoards.hasOwnProperty(username)) {
                        const board = playerBoards[username];
                        if (board.roomId === roomId) {
                            boardsWithRoomId.push(board);
                        }
                    }
                }
                let num = Math.random() < 0.5 ? 0 : 1;
                // gamecontroller erstellen
                const gameController = new GameController_Multiplayer_1.GameController(boardsWithRoomId, io, roomId, boardsWithRoomId[num].boardOwner);
                // in map speichern
                gameControllers.set(roomId, gameController);
                gameController.startGame();
                // socket.testee = n;
                // socket.testee.startGame();
                console.log(`Game started in room ${roomId}`);
            }
        }
    });
}
exports.startWebSocketConnection = startWebSocketConnection;
//# sourceMappingURL=websockets.js.map