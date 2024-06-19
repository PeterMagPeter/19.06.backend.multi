import { Board } from "./Board";
import { logger } from "../logger";
import { Ship } from "./Ship";
import { Position, miniHit } from "./Types";
import * as fs from "fs";

export class Ai_Playtest {
  presetBoards: string[][][] = [
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "2a", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "2a", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["3a", "3a", "3a", ".", ".", "2b", "2b", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["3b", "3b", "3b", ".", ".", "5", "5", "5", "5", "5"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "4", "4", "4", "4", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    ],
    [
      [".", ".", ".", "5", "5", "5", "5", "5", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "2a", "."],
      [".", ".", ".", "3a", "3a", "3a", ".", ".", "2a", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "2b", "2b"],
      [".", ".", ".", "3b", "3b", "3b", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", "4", "4", "4", "4", ".", ".", "."],
    ],
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "3a"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "3a"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "3a"],
      [".", ".", "4", ".", ".", "2a", "2a", ".", ".", "."],
      [".", ".", "4", ".", ".", ".", ".", ".", ".", "5"],
      [".", ".", "4", ".", ".", ".", ".", ".", "2b", "5"],
      [".", ".", "4", ".", ".", ".", ".", ".", "2b", "5"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "5"],
      [".", ".", ".", "3b", "3b", "3b", ".", ".", ".", "5"],
    ],
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "5", "5", "5", "5", "5", ".", ".", "2a"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "2a"],
      [".", ".", ".", ".", "3a", "3a", "3a", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "4", "4", "4", "4", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "3b", "3b", "3b"],
      [".", ".", "2b", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "2b", ".", ".", ".", ".", ".", ".", "."],
    ],
    [
      ["4", "4", "4", "4", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["3a", "3a", "3a", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "2a", "2a"],
      ["3b", "3b", "3b", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", "2b", ".", ".", ".", "5", "."],
      [".", ".", ".", ".", "2b", ".", ".", ".", "5", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "5", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "5", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", "5", "."],
    ],
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "3a", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "3a", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "3a", ".", ".", ".", ".", ".", "2a", "2a", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "3b", "3b", "3b", ".", "."],
      [".", ".", "2b", ".", ".", ".", ".", ".", ".", "4"],
      [".", ".", "2b", ".", ".", ".", ".", ".", ".", "4"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "4"],
      [".", ".", ".", "5", "5", "5", "5", "5", ".", "4"],
    ],
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["3a", ".", ".", ".", "4", "4", "4", "4", ".", "."],
      ["3a", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["3a", ".", ".", ".", ".", ".", ".", "3b", "3b", "3b"],
      [".", ".", "2a", "2a", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "2b", "2b", ".", ".", "5", "5", "5", "5", "5"],
    ],
    [
      [".", "5", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "5", ".", "3a", "3a", "3a", ".", ".", ".", "."],
      [".", "5", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "5", ".", ".", ".", ".", ".", "4", ".", "."],
      [".", "5", ".", ".", "2a", "2a", ".", "4", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "4", ".", "."],
      [".", "3b", ".", ".", ".", ".", ".", "4", ".", "."],
      [".", "3b", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "3b", ".", ".", ".", "2b", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "2b", ".", ".", ".", "."],
    ],
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", "4", "4", "4", "4", ".", "2a", "2a"],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", "2b", ".", ".", "5", "5", "5", "5", "5", "."],
      [".", "2b", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "3a", "3a", "3a", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", "3b", "3b", "3b", ".", ".", ".", "."],
    ],
    [
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "2a", "2a", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "2b"],
      [".", ".", ".", ".", ".", "3a", ".", ".", ".", "2b"],
      [".", "3b", "3b", "3b", ".", "3a", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "3a", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["5", "5", "5", "5", "5", ".", "4", "4", "4", "4"],
    ],
  ];

  playerBoard: Board;
  aiBoard: Board;
  identifier: string[] = [];
  identifierCopy: string[] = [];
  difficulty: string | undefined;

  ships: Map<string, Ship> = new Map<string, Ship>();
  shipsTemp: Ship[] = []; // speichert ai schiffe aus initializeBoard()
  playerShips: Map<string, Ship>; // holt sich die schiffe des spieler um zu cheaten
  playerShipPositions: Position[] = []; //kein plan?
  focusedShip: Position[] = []; // speichert alle hits vom aktuell beschossen schiff
  currentHits: Position[] = []; //speichert alle hits
  hitsAndMisses: miniHit[] = [];

  emtpyPositions: Position[] = [];
  target: string = "";
  alreadyShotAt: Position[] = []; //speichert alle schüsse
  // probability: number;
  testArray: number[][];
  constructor(playerBoard: Board, difficulty: string, roomId: string) {
    this.testArray = Array.from({ length: 10 }, () => Array(10).fill(0));
    this.playerBoard = playerBoard;
    this.aiBoard = new Board(
      10,
      6,
      "Ai",
      this.initializeBoard(),
      this.shipsTemp,
      roomId
    ); // müsste aber auch gehen
    // this.aiBoard.ships.forEach((ship) => {
    //     this.playerShips.set(ship.identifier, ship);
    //     ship.initialPositions.forEach((shipPosition) => {
    //       this.playerShipPositions.push(shipPosition);
    //     });
    //   });
    // this.aiBoard = new Board(10, 6, "ai", this.getPreset()); //preset boards nehmen
    difficulty ? (this.difficulty = difficulty) : (this.difficulty = undefined);
    playerBoard.identifier.forEach((val) => this.identifier.push(val));
    playerBoard.identifier.forEach((val) => this.identifierCopy.push(val));
    this.playerShips = playerBoard.ships;
    // AI-Feature: Add all ship positions into ships map
    // this.aiBoard.addShips()
    // setzt die Schiffe vom spieler
    // playerBoard.ships.forEach((ship) => {
    //   this.playerShips.set(ship.identifier, ship);
    //   ship.initialPositions.forEach((shipPosition) => {
    //     this.playerShipPositions.push(shipPosition);
    //   });
    // });
    this.ShipPositionsFillUp(this.playerShipPositions);
    /* if (difficulty == "God") {
      this.probability = 0.9;
      this.aiGod(this.probability);
    } else if (difficulty == "Normal") {
      this.probability = 0.6;
      this.aiGod(this.probability);
    } else if (difficulty == "Easy") {
      this.probability = 0.3;
      this.aiGod(this.probability);
    } else {
      this.probability = 0;
    } */
  }

  // Difficulty god-mode. If set, the AI has a statistical hit rate of at least 50 %
  aiGod(probability: number): miniHit | Ship | string {
    let hit: boolean = Math.random() < probability;
    logger.debug("-aigod: " + hit + " " + "---------aiGod---------");

    if (this.identifierCopy.length > 0) {
      if (!hit) {
        // miss noch abhängig vom schiff placement sein
        // wenn er nicht treffen soll
        let coord: Position = this.getRandomMiss(this.playerBoard.playfield);
        let result = { x: coord.x, y: coord.y, hit: false };
        return result;
      } else {
        //wenn er treffen soll
        //   wir setzen ein target wenn es noch kein gibt
        if (this.target === "")
          this.target = this.getRandomIdentifier(this.identifierCopy);
        this.focusedShip = [];
        let id: string = this.target;

        let ship: Ship = this.playerShips.get(id)!;

        //   befüllen focusedShip mit allen werten
        for (let pos of ship.initialPositions) {
          this.focusedShip.push(pos);
        }
        //   alle schon beschossenen Positionen rauswerfen
        for (let pos of this.alreadyShotAt) {
          const index = this.focusedShip.findIndex(
            (ship) => ship.x === pos.x && ship.y === pos.y
          );

          // Wenn eine Übereinstimmung gefunden wird, entfernen Sie das entsprechende Schiff aus focusedShip
          if (index !== -1) {
            this.focusedShip.splice(index, 1);
          }
        }

        //   geht das schiff entlang und setzt den schuss in alreadyShotAt
        let shotCoordinate: Position = this.focusedShip[0];
        this.alreadyShotAt.push(shotCoordinate);
        // checkt was es ist hit oder destroyed
        let checkHitResult = this.playerBoard.checkHit(shotCoordinate, "Ai");

        if (checkHitResult instanceof Ship) {
          // wenn destroyed entferne es aus dem idenifierCopy und setzt das aktuelle target wieder auf ""
          const index = this.identifierCopy.findIndex((t) => {
            console.log("Comparing:", t, "with", id);
            return t === id;
          });
          if (index !== -1) {
            this.identifierCopy.splice(index, 1);
          }
          this.target = "";
        }
        return checkHitResult;
      }
    }
    return "AI";
  }
  aiTest(): miniHit | Ship | string {
    let fieldSize = 10;
    let randomShot: Position;
    let curHitsLen = this.currentHits.length;
    logger.debug(
      "- aiTest length " +
        curHitsLen +
        " arr: " +
        JSON.stringify(this.currentHits)
    );
    // verschiedene hits bei verschiedener anzahl an aktuellen treffern
    if (curHitsLen === 0) {
      randomShot = this.getRandomShot(10);
    } else if (curHitsLen === 1) {
      let tmp = this.getFreeNeighbors(this.currentHits[0], fieldSize);
      randomShot = tmp[Math.floor(Math.random() * tmp.length)];
    } else {
      let test = this.getHitpattern(fieldSize);
      logger.debug("hitpattern " + JSON.stringify(test));
      if (test === null) {
        logger.debug("- aiTest " + test + " randomshot ist null");
        randomShot = this.getRandomShot(10);
      } else {
        randomShot = test;
      }
    }
    this.alreadyShotAt.push(randomShot);
    let checkHitResult = this.playerBoard.checkHit(randomShot, "Ai");
    if (this.isMiniHit(checkHitResult)) {
      this.hitsAndMisses.push(checkHitResult);
      if (checkHitResult.hit === true) {
        this.currentHits.push(randomShot);
      }
    }
    if (checkHitResult instanceof Ship) {
      for (let pos of checkHitResult.initialPositions) {
        const index = this.currentHits.findIndex((t) => {
          console.log(
            "Comparing:",
            JSON.stringify(t),
            "with",
            JSON.stringify(pos)
          );
          return t.x === pos.x && t.y === pos.y;
        });
        if (index !== -1) {
          this.currentHits.splice(index, 1);
        }
        const index2 = this.hitsAndMisses.findIndex((t) => {
          console.log("Comparing:", JSON.stringify(t), "with", JSON.stringify(pos));
          return t.x === pos.x && t.y === pos.y;
        });
      
        // Wenn die Position nicht in hitsAndMisses gefunden wurde, hinzufügen
        if (index2 === -1) {
          let tmp = {x: pos.x, y: pos.y, hit: true}
          this.hitsAndMisses.push(tmp);
        }
      }
    }
    return checkHitResult;
  }
  /**
   * Difficulty middle. If set, AI knows the ship positions, but a randomizer is used to
   * randomly pic coordinates from a list of the enemies ship coordinates and some unused coordinates.
   * If a randomly picked coordinate is a hit, the AI tries to test the coordinates around that hit
   * systematically until the ship is sunk.
   */
  aiNormal(probability: number): miniHit | Ship | string {
    let hit: boolean = Math.random() < probability;

    if (this.focusedShip.length > 0) {
      // Prepare shot and return result
      let shotCoordinate: Position = this.focusedShip[0];
      let checkHitResult = this.playerBoard.checkHit(shotCoordinate, "Ai");
      this.removeSpecificPos(this.focusedShip, shotCoordinate);
      return checkHitResult;
    }
    if (!hit) {
      let coord: Position = this.getRandomPosition(this.emtpyPositions);
      const posBackup: Position = coord;
      this.removeSpecificPos(this.emtpyPositions, coord);
      return { x: posBackup.x, y: posBackup.y, hit: false };
    } else {
      // Get random ship
      let ship: Ship = this.playerShips.get(
        this.getRandomIdentifier(this.identifierCopy)
      )!;

      // Save all ship positions
      ship.initialPositions.forEach((coords) => {
        this.focusedShip.push(coords);
      });

      // Remove identifier from array
      this.removePickedIdentifier(this.identifierCopy, ship.identifier);

      // Prepare shot and return result
      let shotCoordinate: Position = this.focusedShip[0];
      let checkHitResult = this.playerBoard.checkHit(shotCoordinate, "Ai");
      this.removeSpecificPos(this.focusedShip, shotCoordinate);
      return checkHitResult;
    }
  }

  /**
   * Difficulty easy. If set, AI knows the ship positions, but a randomizer is used to
   * randomly pic coordinates from a list of the enemies ship coordinates and many unused coordinates.
   * If a randomly picked coordinate is a hit, the AI tries to test the coordinates around that hit
   * systematically until the ship is sunk.
   */
  aiEasy(probability: number): miniHit | Ship | string {
    let hit: boolean = Math.random() < probability;

    if (this.focusedShip.length > 0) {
      // Prepare shot and return result
      let shotCoordinate: Position = this.focusedShip[0];
      let checkHitResult = this.playerBoard.checkHit(shotCoordinate, "Ai");
      this.removeSpecificPos(this.focusedShip, shotCoordinate);
      return checkHitResult;
    }
    if (!hit) {
      let coord: Position = this.getRandomPosition(this.emtpyPositions);
      const posBackup: Position = coord;
      this.removeSpecificPos(this.emtpyPositions, coord);
      return { x: posBackup.x, y: posBackup.y, hit: false };
    } else {
      // Get random ship
      let ship: Ship = this.playerShips.get(
        this.getRandomIdentifier(this.identifier)
      )!;

      // Save all ship positions
      ship.initialPositions.forEach((coords) => {
        this.focusedShip.push(coords);
      });

      // Remove identifier from array
      this.removePickedIdentifier(this.identifier, ship.identifier);

      // Prepare shot and return result
      let shotCoordinate: Position = this.focusedShip[0];
      let checkHitResult = this.playerBoard.checkHit(shotCoordinate, "Ai");
      this.removeSpecificPos(this.focusedShip, shotCoordinate);
      return checkHitResult;
    }
  }

  getPreset(): string[][] {
    const index = Math.floor(Math.random() * this.presetBoards.length);
    return this.presetBoards[index];
  }

  initializeBoard(): string[][] {
    const playfield: string[][] = this.generateEmtpyPlayfield();
    let ships: Ship[] = this.generateShips();
    this.shipsTemp = ships; //speichert die Schiffe zwischen
    for (const ship of ships) {
      this.placeShip(playfield, ship);
    }
    return playfield;
    // this.writeBoardToFile(board);
  }

  // To fill list with random coordinates, depending on the set difficulty
  aiRandomizedPositionFills(): Position {
    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);
    return { x: randomX, y: randomY };
  }

  // Pick a random coordinate from list
  getRandomPosition(arr: Position[]): Position {
    let randomPositionPick = arr[Math.floor(Math.random() * arr.length)];
    return randomPositionPick;
  }
  //  -------------------------
  // pick random miss
  getRandomMiss(arr: string[][]): Position {
    while (true) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let pos = arr[x][y];
      console.log(pos);
      if (pos === ".") {
        return { x: y, y: x };
      }
    }
  }
  // pick random coordinate that isnt a hit or miss
  getRandomShot(fieldSiz: number): Position {
    const allPositions = new Set<string>();

    // Fülle alle möglichen Positionen in das Set
    for (let x = 0; x < fieldSiz; x++) {
      for (let y = 0; y < fieldSiz; y++) {
        allPositions.add(`${x},${y}`);
      }
    }

    // Entferne bereits getroffene Positionen aus dem Set
    for (let posi of this.alreadyShotAt) {
      allPositions.delete(`${posi.x},${posi.y}`);
    }

    // Wandle das Set in ein Array um
    const remainingPositions = Array.from(allPositions);

    if (remainingPositions.length === 0) {
      throw new Error("Keine verfügbaren Positionen mehr.");
    }

    // Wähle eine zufällige Position aus den verbleibenden
    const randomIndex = Math.floor(Math.random() * remainingPositions.length);
    const [x, y] = remainingPositions[randomIndex].split(",").map(Number);

    return { x, y };
  }
  isMiniHit(obj: any): obj is miniHit {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof obj.x === "number" &&
      typeof obj.y === "number" &&
      typeof obj.hit === "boolean"
    );
  }
  getFreeNeighbors(position: Position, fieldSize: number): Position[] {
    const { x, y } = position;
    const neighbors = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];

    // Filtere die freien Nachbarpositionen
    const freeNeighbors = neighbors.filter(
      (neighbor) =>
        neighbor.x >= 0 &&
        neighbor.x < fieldSize &&
        neighbor.y >= 0 &&
        neighbor.y < fieldSize &&
        !this.alreadyShotAt.some(
          (pos) => pos.x === neighbor.x && pos.y === neighbor.y
        )
    );

    return freeNeighbors;
  }
  // generiert logischen hit DÜRFTE nie null zurückgeben
  getHitpattern(fieldSize: number): Position | null {
    // rechne letzten mit vorletzten hit
    let lastX = this.currentHits[this.currentHits.length - 1].x;
    let secondLastX = this.currentHits[this.currentHits.length - 2].x;
    let lastY = this.currentHits[this.currentHits.length - 1].y;
    let secondLastY = this.currentHits[this.currentHits.length - 2].y;

    let directionX = lastX - secondLastX;
    let directionY = lastY - secondLastY;
    let random = Math.random() < 0.5 ? -1 : 1;
    let result = null;
    directionX /= directionX;
    directionY /= directionY;
    if (directionX !== 0) {
      // guck ob in hit direction es weiter geht
      result = this.searchXDirections(
        this.currentHits[this.currentHits.length - 1],
        directionX,
        fieldSize
      );
      if (result === null) {
        // dann entgegen gesetzte richtung
        result = this.searchXDirections(
          this.currentHits[this.currentHits.length - 1],
          -directionX,
          fieldSize
        );
        if (result === null) {
          // dann random nach oben oder unten
          result = this.searchYDirections(
            this.currentHits[this.currentHits.length - 1],
            random,
            fieldSize
          );
          if (result === null) {
            // andere möglichkeit
            result = this.searchYDirections(
              this.currentHits[this.currentHits.length - 1],
              -random,
              fieldSize
            );
          }
        }
      }
    }
    if (directionY !== 0) {
      result = this.searchYDirections(
        this.currentHits[this.currentHits.length - 1],
        directionY,
        fieldSize
      );
      if (result === null) {
        result = this.searchYDirections(
          this.currentHits[this.currentHits.length - 1],
          -directionY,
          fieldSize
        );
        if (result === null) {
          result = this.searchXDirections(
            this.currentHits[this.currentHits.length - 1],
            random,
            fieldSize
          );
          if (result === null) {
            result = this.searchXDirections(
              this.currentHits[this.currentHits.length - 1],
              -random,
              fieldSize
            );
          }
        }
      }
    }
    return result;
  }
  searchXDirections(
    startPos: Position,
    dir: number,
    fieldSize: number
  ): Position | null {
    let x = startPos.x;
    let y = startPos.y;
    for (let i = x; i < fieldSize && i >= 0; i += dir) {
      let tmp2 = this.hitsAndMisses.find((pos) => pos.x === i && pos.y === y);
      // wenn es die pos noch nicht gibt schießen wir darauf
      if (!tmp2) return { x: i, y: y };
      // wenn es dort ein miss gibt  andere richtung durch laufen
      if (tmp2.hit === false) break;
      // bei hit weitermachen
      if (tmp2.hit === true) continue;
    }
    return null;
  }
  searchYDirections(
    startPos: Position,
    dir: number,
    fieldSize: number
  ): Position | null {
    let x = startPos.x;
    let y = startPos.y;
    for (let i = y; i < fieldSize && i >= 0; i += dir) {
      let tmp2 = this.hitsAndMisses.find((pos) => pos.x === x && pos.y === i);
      // wenn es die pos noch nicht gibt schießen wir darauf
      if (!tmp2) return { x: x, y: i };
      // wenn es dort ein miss gibt  andere richtung durch laufen
      if (tmp2.hit === false) break;
      // bei hit weitermachen
      if (tmp2.hit === true) continue;
    }
    return null;
  }

  getPattern(position: Position, fieldSize: number): Position[] {
    const { x, y } = position;
    let freeNeighbors = [];

    // Prüfe nach links
    for (let i = x - 1; i >= 0; i--) {
      if (!this.hitsAndMisses.some((pos) => pos.x === i && pos.y === y)) {
        freeNeighbors.push({ x: i, y });
        break; // Stoppe die Suche, sobald ein leerer Feld gefunden wurde
      }
    }

    // Prüfe nach rechts
    for (let i = x + 1; i <= fieldSize; i++) {
      if (!this.hitsAndMisses.some((pos) => pos.x === i && pos.y === y)) {
        freeNeighbors.push({ x: i, y });
        break; // Stoppe die Suche, sobald ein leerer Feld gefunden wurde
      }
    }

    // Prüfe nach oben
    for (let i = y - 1; i >= 0; i--) {
      if (!this.hitsAndMisses.some((pos) => pos.x === x && pos.y === i)) {
        freeNeighbors.push({ x, y: i });
        break; // Stoppe die Suche, sobald ein leerer Feld gefunden wurde
      }
    }

    // Prüfe nach unten
    for (let i = y + 1; i <= fieldSize; i++) {
      if (!this.hitsAndMisses.some((pos) => pos.x === x && pos.y === i)) {
        freeNeighbors.push({ x, y: i });
        break; // Stoppe die Suche, sobald ein leerer Feld gefunden wurde
      }
    }

    return freeNeighbors;
  }
  // -------------------------------
  // Pick random identifier
  getRandomIdentifier(arr: string[]): string {
    let identifier = arr[Math.floor(Math.random() * arr.length)];
    return identifier;
  }

  // Delete picked identifier
  removePickedIdentifier(arr: string[], idToDelete: string) {
    let index = arr.findIndex((id: string) => {
      return id === idToDelete;
    });

    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  // Remove a specific position
  removeSpecificPos(arr: Position[], coordToDel: Position) {
    // arr = arr.filter(coord => {
    //     (coord.x !== coordToDel.x && coord.y !== coordToDel.y);
    // });
    let index = arr.findIndex((coord: Position) => {
      return coord.x === coordToDel.x && coord.y === coordToDel.y;
    });
    // logger.debug(index + " index");
    if (index !== -1) {
      //   logger.debug("index !== -1");
      arr.splice(index, 1);
    }
    // logger.debug("------end removeSpecificPos------------");
  }

  // Remove all coords of a ship from an array
  removeAllCoordsFromShipInArr(arr: Position[], ship: Ship) {
    ship.initialPositions.forEach((pos) => {
      let index = arr.findIndex((coord: Position) => {
        return pos.x === coord.x && pos.y === coord.y;
      });

      if (index !== -1) {
        arr.splice(index, 1);
      }
    });
  }

  // Choose how to fill playerShipPositions array
  ShipPositionsFillUp(arr: Position[]) {
    this.emtpyPositions = this.getAllEmtpyFields(arr);
  }

  // Remove all coords of all ships from array
  getAllEmtpyFields(arr: Position[]): Position[] {
    // Copy all ship val
    let arrWithEmtpyCoords: Position[] = [];

    // Create 81 emtpy coords
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        let coord: Position = { x: x, y: y };
        if (!arr.includes(coord)) {
          arrWithEmtpyCoords.push(coord);
        }
      }
    }
    return arrWithEmtpyCoords;
  }

  //-----------------Random Shiffsplatzierung-----------------

  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  isValidPlacement(board: string[][], ship: Ship): boolean {
    const { x, y } = ship.startPosition;

    // Überprüfen, ob das Schiff innerhalb der Grenzen des Spielfelds liegt
    if (ship.isHorizontal) {
      if (x + ship.length > 9) {
        return false;
      }
    } else {
      if (y + ship.length > 9) {
        return false;
      }
    }

    // Überprüfen der umliegenden Felder für den Mindestabstand von 1 Feld
    for (let i = 0; i < ship.length; i++) {
      let shipX = x;
      let shipY = y;

      if (ship.isHorizontal) {
        shipX += i;
      } else {
        shipY += i;
      }

      // Überprüfen, ob das aktuelle Feld belegt ist
      if (board[shipY][shipX] === "X") {
        return false;
      }
      //   schiff wird nur auf feldern gesetzt die ein . sind
      if (board[shipY][shipX] !== ".") {
        return false;
      }

      // Überprüfen der umliegenden Felder
      for (let deltaY = -1; deltaY <= 1; deltaY++) {
        for (let deltaX = -1; deltaX <= 1; deltaX++) {
          const checkX = shipX + deltaX;
          const checkY = shipY + deltaY;

          // Sicherstellen, dass die zu überprüfenden Felder innerhalb der Spielfeldgrenzen liegen
          if (checkX >= 0 && checkX < 10 && checkY >= 0 && checkY < 10) {
            if (board[checkY][checkX] === "X") {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  placeShip(board: string[][], ship: Ship): boolean {
    let isPlaced = false;
    while (!isPlaced) {
      ship.startPosition.x = this.generateRandomNumber(0, 9);
      ship.startPosition.y = this.generateRandomNumber(0, 9);
      ship.isHorizontal = Math.random() < 0.5;
      if (this.isValidPlacement(board, ship)) {
        for (let i = 0; i < ship.length; i++) {
          if (ship.isHorizontal) {
            board[ship.startPosition.y][ship.startPosition.x + i] =
              ship.identifier;
            ship.initialPositions[i].x = ship.startPosition.x + i;
            ship.initialPositions[i].y = ship.startPosition.y;
          } else {
            board[ship.startPosition.y + i][ship.startPosition.x] =
              ship.identifier;
            ship.initialPositions[i].x = ship.startPosition.x;
            ship.initialPositions[i].y = ship.startPosition.y + i;
          }
        }
        isPlaced = true;
      }
    }
    return isPlaced;
  }

  generateEmtpyPlayfield(): string[][] {
    const playfield: string[][] = [];
    for (let i = 0; i < 10; i++) {
      playfield.push(Array(10).fill("."));
    }
    return playfield;
  }

  generateShips(): Ship[] {
    let ships: Ship[] = [];
    let id: string = "";
    let placeholderPos: Position = { x: -1, y: -1 };
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        id = "2a";
      } else {
        id = "2b";
      }
      ships.push(new Ship(id, false, placeholderPos, 2));
    }
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        id = "3a";
      } else {
        id = "3b";
      }
      ships.push(new Ship(id, false, placeholderPos, 3));
    }
    ships.push(new Ship("4", false, placeholderPos, 4));
    ships.push(new Ship("5", false, placeholderPos, 5));
    return ships;
  }

  writeBoardToFile(board: string[][]): void {
    const rows = board.length;
    const cols = board[0].length;

    // Array in eine Textdarstellung umwandeln
    let boardText = "";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        boardText += board[i][j] + " ";
      }
      boardText = boardText.trim(); // Entfernen des letzten Leerzeichens in der Zeile
      boardText += "\n"; // Neue Zeile
    }

    // Schreiben der Textdarstellung in eine Datei
    fs.writeFileSync("boards.txt", boardText, "utf8");
  }
}
