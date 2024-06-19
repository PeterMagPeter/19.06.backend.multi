import { logger } from "../logger";
import { Ship } from "./Ship";
import { Position, miniHit } from "./Types";

// other identifiers:
// "O" = MISS; "." = NOTHING; "X" = HIT; "D" = DESTROYED

export class Board {
  ships: Map<string, Ship> = new Map<string, Ship>(); // own ships
  identifier: string[]; // all 6 ship identifiers
  playfield: string[][]; // 2d array from playfield with X, O, . , and identifiers
  sunkCounter: number;
  columnAmount: number;
  // if all ships are sunken, signal game end
  shipQuantity: number;
  boardOwner: string;
  roomId: string;

  constructor(
    boardSize: number,
    shipQuantity: number,
    boardOwner: string,
    playfield: string[][], // spielfeld mit . und identifier der Schiffe
    ships: Ship[], // die Schiffe die der boardOwner gesetzt hat
    roomId: string  ) {
    // this.ships = new Map<string, Ship>();
    // logger.info("constructor ships " + JSON.stringify(ships));
    this.addShips(ships);
    this.identifier = ["2a", "2b", "3a", "3b", "4", "5"];
    this.playfield = [];
    this.sunkCounter = 0;
    this.columnAmount = boardSize;
    this.shipQuantity = shipQuantity;
    this.boardOwner = boardOwner;
    this.roomId = roomId;
    this.playfield = playfield;
    for (let i = 0; i < playfield.length; i++) logger.debug(this.playfield[i]);
    logger.debug("------------" + boardOwner + "-------------");
  }

  // shooterName <==> winner's name
  checkHit(
    shotPosition: Position,
    shooterName: string
  ): miniHit | Ship | string {
    let elementAt = this.playfield[shotPosition.y][shotPosition.x];
    logger.debug("- checkHit: elementAt" + elementAt);
    if (elementAt === ".") {
      this.playfield[shotPosition.y][shotPosition.x] = "O";
      return { x: shotPosition.x, y: shotPosition.y, hit: false };
    } else if (elementAt === "X" || elementAt === "O") {
      let test: any = { scheiße: "an die wand" };
      logger.error(JSON.stringify(test) + " elementAT " + elementAt);
      return test;
    } else {
      let test: any = { test: "stinkt dieser Tag" }; // DAS WIRD
      // elemtAt ist "X" oder "O"

      const ship = this.ships.get(elementAt);
      logger.debug("- checkHit: ship " + JSON.stringify(this.ships));
      // -------------- ship ist NUR bei player undefined----------------------
      ship?.setHit(shotPosition);
      this.playfield[shotPosition.y][shotPosition.x] = "X";
      if (ship?.getIsSunk()) {
        this.sunkCounter++;
        if (this.sunkCounter == this.shipQuantity) {
          test = signalGameEnd(shooterName);
          return test;
        } else {
          test = signalSinking(ship);
          return test;
        }
      }

      test = { x: shotPosition.x, y: shotPosition.y, hit: true };

      //   let iwas: any = this.identifier.forEach((id) => {
      //     if (elementAt == id) {
      //       logger.debug(elementAt + " e : id " + id);
      //       const ship = this.ships.get(id);
      //       logger.debug(JSON.stringify(ship) + " ship");
      //       logger.debug(ship?.setHit(shotPosition) + " ship set hit");
      //       // ship?.setHit(shotPosition);
      //       this.playfield[shotPosition.y][shotPosition.x] = "X";
      //       if (ship?.getIsSunk()) {
      //         logger.debug(" in imSunk ");
      //         //this.sunkCounter++;
      //         if (this.sunkCounter == this.shipQuantity) {
      //           test = signalGameEnd(shooterName);
      //           return test;
      //         } else {
      //           test = signalSinking(ship);
      //           return test;
      //         }
      //       }

      //       test = { x: shotPosition.x, y: shotPosition.y, hit: true };
      //       logger.debug(test + " hit");
      //       return test;
      //     }
      //   });
      logger.debug(
        JSON.stringify(test) + " checkhit ende---------------------"
      );
      return test;
    }
  }

  // setShipPositions() {
  //   this.ships.forEach((ship) => {
  //     ship.initialPositions.forEach((position) => {
  //       this.playfield[position.x][position.y] = ship.identifier;
  //     });
  //   });
  //   for (let i = 0; i < this.ships.size; i++) logger.debug(this.playfield[i]);
  //   logger.debug("------------" + this.ships + "-------------");
  // }

  addShips(ships: Ship[]) {
    for (let ship of ships) {
      this.ships.set(ship.identifier, ship);
      // logger.debug(JSON.stringify(ship.identifier));
    }
    // logger.debug("-----adships-------");
  }
}

export function signalSinking(ship: Ship): Ship {
  return ship;
}

export function signalGameEnd(winner: string): string {
  return winner;
}
