import { logger } from "../logger";
import { Ai_Playtest } from "./Ai_Playtest";
import { Board } from "./Board";
import { Position, HitResult, ShipType, miniHit } from "./Types";
import { Socket } from "socket.io";
import { Ship } from "./Ship";
import { json } from "stream/consumers";

export class AiGameController {
  playerBoard: Board;
  aiBoard: Board;
  ai: Ai_Playtest;
  playersChanged: boolean = false
  playerWhosTurnItIs: string;
  socket: Socket;
  difficulty: number = 0.5;

  // constructor(...args: any[]) {
  //     if (args.length === 1) {
  //         this.socket = args[0]; // Initialisiert socket mit dem übergebenen Wert
  //     } else if (args.length === 4) {
  //         this.playerBoard = args[0];
  //         this.aiBoard = args[1];
  //         this.ai = new Ai_Playtest(this.playerBoard, "god");
  //         this.socket = args[2]; // Initialisiert socket mit dem übergebenen Wert
  //         this.gameInit();
  //     }
  //     // Weitere Logiken für andere Konstruktoraufrufe...
  // }
  constructor(
    playerBoard: Board,
    // aiBoard: Board,
    socket: Socket,
    playerWhosTurnItIs: string,
    difficulty: number,
    roomId: string
  ) {
    this.playerBoard = playerBoard;
    this.ai = new Ai_Playtest(this.playerBoard, "god", roomId);
    this.aiBoard = this.ai.aiBoard;
    this.socket = socket;
    this.playerWhosTurnItIs = playerWhosTurnItIs;
    this.difficulty = difficulty;
  }

  shoot(username: string, pos?: Position) {
    // doTheShooting

    const board =
      this.playerBoard.boardOwner === username
        ? this.aiBoard
        : this.playerBoard;
    let enemyBoardOwner =
      this.playerBoard.boardOwner === username
        ? this.aiBoard.boardOwner
        : this.playerBoard.boardOwner;
    if (!board)
      throw new Error(
        "Whooops, didn't find the board we are looking for! " +
          this.playerWhosTurnItIs
      );
    let hitResult: any;
    if (username === this.playerBoard.boardOwner && pos)
      hitResult = this.aiBoard.checkHit(pos, username);
    else {
      hitResult =
        this.difficulty === -1
          ? this.ai.aiTest()
          : this.ai.aiGod(this.difficulty);
    }
    // else hitResult = this.ai.aiTest();

    if (!hitResult) throw new Error("No hitResult");

    if (this.isMiniHit(hitResult)) {
      // hit or miss
      if (hitResult.hit === true) {
        return this.hitEvent({
          x: hitResult.x,
          y: hitResult.y,
          username: username,
          hit: hitResult.hit,
          switchTo: username,
        });
      } else {
        return this.hitEvent({
          x: hitResult.x,
          y: hitResult.y,
          username: username,
          hit: hitResult.hit,
          switchTo: enemyBoardOwner,
        });
      }
    } else if (hitResult instanceof Ship) {
      // ship destroyed
      // logger.debug(" in hitResult Ship" + JSON.stringify(hitResult));
      let ship: ShipType = {
        identifier: hitResult.identifier,
        direction: hitResult.isHorizontal ? "X" : "Y",
        startX: hitResult.initialPositions[0].x,
        startY: hitResult.initialPositions[0].y,
        length: hitResult.length,
        hit: true,
      };
      return this.shipDestroyed(ship, username);
    } else if (typeof hitResult === "string") {
      // win or lose
      logger.debug(" in hitResult string" + JSON.stringify(hitResult));
      return this.gameOver({ username: hitResult });
    } else {
    }
  }

  getCurrentPlayer() {
    return this.playerWhosTurnItIs;
  }

  //   sendet gewinner
  gameOver(body: { username: string }) {
    logger.error("Game over for: " + body.username);
    this.socket.emit("gameOver", body);
  }

  switchPlayers(hit: boolean, enemyBoardOwner: string) {
    
    if (!hit) {
      this.playerWhosTurnItIs = enemyBoardOwner;
      this.playersChanged = true
    }
    if (this.playerWhosTurnItIs === this.aiBoard.boardOwner) {
      logger.info("AI's turn!-----------" + this.playerWhosTurnItIs);
      setTimeout(() => {
        this.shoot(enemyBoardOwner);
      }, this.playersChanged? 3000 : 1500);
      this.playersChanged = false
    }
  }

  hitEvent(body: HitResult) {
    logger.debug(JSON.stringify(body) + " hitevent body");
    this.socket.emit("hitEvent", body);
    this.switchPlayers(body.hit, body.switchTo);
  }

  shipDestroyed(body: ShipType, switchTo: string) {
    logger.info("send shipDestroyed" + JSON.stringify(body));
    this.socket.emit("shipDestroyed", body, switchTo);
    this.switchPlayers(true, switchTo);
  }

  isMiniHit(obj: any): obj is miniHit {
    return (
      typeof obj === "object" &&
      typeof obj.x === "number" &&
      typeof obj.y === "number" &&
      typeof obj.hit === "boolean"
    );
  }
}
