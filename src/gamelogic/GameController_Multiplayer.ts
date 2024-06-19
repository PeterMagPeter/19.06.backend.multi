import { logger } from "../logger";
import { Ai_Playtest } from "./Ai_Playtest";
import { Board } from "./Board";
import { Position, HitResult, ShipType, miniHit } from "./Types";
import { Socket } from "socket.io";
import { Ship } from "./Ship";
import { json } from "stream/consumers";
import { log } from "console";

export class GameController {
  playerBoards: Board[];
  playersChanged: boolean = false;
  playerWhosTurnItIs: string;
  io: any;
  roomId: string;

  constructor(playerBoards: Board[], io: any, roomId: string, intiPlayer: string) {
    this.playerBoards = playerBoards;
    this.io = io;
    this.roomId = roomId
    // coin flip whos starts
    this.playerWhosTurnItIs = intiPlayer;
  }
  // shooter name and position
  shoot(username: string, pos: Position) {
    // doTheShooting

    // returns the board that gets shot at
    const board = this.playerBoards.find((board) => {
      if (board.boardOwner != username) return board;
    });
    if (!board)
      throw new Error(
        "Whooops, didn't find the board we are looking for! enemy from: " +
          username
      );
    let enemyBoardOwner = board.boardOwner;
    let hitResult: string | Ship | miniHit = board.checkHit(pos, username);

    if (!hitResult) throw new Error("No hitResult in shoot");

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
    this.io.to(this.roomId, { broadcast: true }).emit("gameOver", body);
  }

  switchPlayers(hit: boolean, switchTo: string) {
    if (!hit) {
      this.playerWhosTurnItIs = switchTo;
    }
  }

  hitEvent(body: HitResult) {
    this.io.to(this.roomId, { broadcast: true }).emit("hitEvent", body);
    this.switchPlayers(body.hit, body.switchTo);
  }

  shipDestroyed(body: ShipType, switchTo: string) {
    this.io.to(this.roomId, { broadcast: true }).emit("shipDestroyed", body, switchTo);
    this.switchPlayers(true, switchTo);
  }
  startGame() {
    this.io.to(this.roomId, { broadcast: true }).emit("gameStart", this.playerWhosTurnItIs);
    logger.debug(this.playerWhosTurnItIs)
    // this.switchPlayers(true, switchTo);
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
