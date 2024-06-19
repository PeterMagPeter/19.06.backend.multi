import { Server, Socket } from "socket.io";
import { GameController } from "./gamelogic/GameController_Multiplayer";
import { AiGameController } from "./gamelogic/GameController_Playtest";
import { Ai_Playtest } from "./gamelogic/Ai_Playtest";
import { Board } from "./gamelogic/Board";
import { Ship } from "./gamelogic/Ship";
import { logger } from "./logger";
import { Position } from "./gamelogic/Types";
import { skip } from "node:test";
import { log } from "console";
interface ExtendedSocket extends Socket {
  testee?: any; // oder genauerer Typ, falls bekannt, z.B. GameController oder AiGameController
}
const gameControllers = new Map();

export function startWebSocketConnection(server: any) {
  const io = new Server(server, { cors: { origin: "*" } });
  console.log("WebSocket server started");

  let playerBoards: { [username: string]: Board } = {};
  io.on("connection", (socket: any) => {
    console.log("New connection:", socket.id);
    // join a room/ lobby,

    socket.on("sendJoinRoom", (room: string, username: string) => {
      socket.join(room);
      socket.username = username;
      console.log(`${socket.username} joined room: ${room}`);
      if (updateRoomCount(room) == 2) {
        logger.debug(" start shipplacement");
        io.to(room).emit("startShipPlacement");
      }
    });

    socket.testee = null;
    socket.on(
      "sendShipPlacement",
      (body: any[], username: string, roomId: string, difficulty?: number) => {
        // logger.info("Received ship placement: " + JSON.stringify(body));
        let fieldSize: number = 10;
        let arr: string[][] = Array.from({ length: fieldSize }, () =>
          Array(fieldSize).fill(".")
        );
        let playerShips: Ship[] = [];
        for (const ship of body) {
          for (let i = 0; i < ship.length; i++) {
            let x = ship.startX;
            let y = ship.startY;
            let id = ship.identifier;
            arr[y][x] = id;
            if (ship.direction == "Y") {
              arr[y + i][x] = id;
            } else {
              arr[y][x + i] = id;
            }
          }
          let isHorizontal = ship.direction === "X" ? true : false;
          let position: Position = { x: ship.startX, y: ship.startY };
          playerShips.push(
            new Ship(ship.identifier, isHorizontal, position, ship.length)
          );
        }
        const playerBoard = new Board(
          10,
          6,
          username,
          arr,
          playerShips,
          roomId
        );
        logger.info("player board created");
        if (difficulty) {
          // create ai GameController
          logger.info("createt ai testee");
          socket.testee = new AiGameController(
            playerBoard,
            socket,
            username,
            difficulty,
            roomId
          );
          // noch gamestart emit machen damit man direkt gegen ki spielen kann
        } else {
          playerBoards[username] = playerBoard;
          allPlayersReady(io, roomId, playerBoards);
        }
      }
    );

    socket.on(
      "sendShot",
      (body: { x: number; y: number; username: string; roomId: string }) => {
        logger.info("Received shot at: " + body.x + " " + body.y, " room: ", body.roomId);
        if (gameControllers.has(body.roomId)) {
          const gameController = gameControllers.get(body.roomId);
          gameController.shoot(body.username, { x: body.x, y: body.y });
        } else {
          logger.error(
            "testee is not an instance of GameController or AiGameController"
          );
        }
      }
    );

    socket.on('sendLeaveRoom', (roomId: string) => {
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
    function updateRoomCount(room: string) {
      const roomCount = io.sockets.adapter.rooms.get(room)?.size || 0;
      io.to(room).emit("roomCount", roomCount);
      return roomCount;
    }
    // check if all players are ready
    function allPlayersReady(
      io: Server,
      roomId: string,
      playerBoards: { [username: string]: Board }
    ) {
      let count: number = Object.keys(playerBoards).length;
      if (count === 2) {
        const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
        if (!socketsInRoom || socketsInRoom.size !== 2) {
          console.log(`Not enough players ready in room ${roomId}`);
          return;
        }
        const boardsWithRoomId: Board[] = [];
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
        const gameController = new GameController(
          boardsWithRoomId,
          io,
          roomId,
          boardsWithRoomId[num].boardOwner
        );
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
