export default function GameField() {
  type Position = { x: number; y: number };

  interface Ship {


    id: string;
    length: number;
    position: Position;
    isHorizontal: boolean;
  }

  function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isValidPlacement(board: string[][], ship: Ship): boolean {
    if (ship.isHorizontal) {
      if (ship.position.x + ship.length > 10) {
        return false;
      }
      for (let i = 0; i < ship.length; i++) {
        if (board[ship.position.y][ship.position.x + i] === "X") {
          return false;
        }
        if (
          ship.position.y - 1 >= 0 &&
          board[ship.position.y - 1][ship.position.x + i] === "X"
        ) {
          return false;
        }
        if (
          ship.position.y + 1 < 10 &&
          board[ship.position.y + 1][ship.position.x + i] === "X"
        ) {
          return false;
        }
      }
    } else {
      if (ship.position.y + ship.length > 10) {
        return false;
      }
      for (let i = 0; i < ship.length; i++) {
        if (board[ship.position.y + i][ship.position.x] === "X") {
          return false;
        }
        if (
          ship.position.x - 1 >= 0 &&
          board[ship.position.y + i][ship.position.x - 1] === "X"
        ) {
          return false;
        }
        if (
          ship.position.x + 1 < 10 &&
          board[ship.position.y + i][ship.position.x + 1] === "X"
        ) {
          return false;
        }
      }
    }
    return true;
  }

  function placeShip(board: string[][], ship: Ship): boolean {
    let isPlaced = false;
    while (!isPlaced) {
      ship.position.x = generateRandomNumber(0, 9);
      ship.position.y = generateRandomNumber(0, 9);
      ship.isHorizontal = Math.random() < 0.5;
      if (isValidPlacement(board, ship)) {
        for (let i = 0; i < ship.length; i++) {
          if (ship.isHorizontal) {
            board[ship.position.y][ship.position.x + i] = "X";
          } else {
            board[ship.position.y + i][ship.position.x] = "X";
          }
        }
        isPlaced = true;
      }
    }
    return isPlaced;
  }

  function generateBoard(): string[][] {
    const board: string[][] = [];
    for (let i = 0; i < 10; i++) {
      board.push(Array(10).fill("."));
    }
    return board;
  }

  function generateShips(): Ship[] {
    const ships: Ship[] = [];
    let id: string = "";
    for (let i = 0; i < 2; i++) {
        if(i == 0){
            id = "2a";
        } else {
            id = "2b";
        }
      ships.push({
        id: id,
        length: 2,
        position: { x: -1, y: -1 },
        isHorizontal: false,
      });
    }
    for (let i = 0; i < 2; i++) {
        if(i == 0){
            id = "3a";
        } else {
            id = "3b";
        }
      ships.push({
        id: id,
        length: 3,
        position: { x: -1, y: -1 },
        isHorizontal: false,
      });
    }
    ships.push({
      id: "4",
      length: 4,
      position: { x: -1, y: -1 },
      isHorizontal: false,
    });
    ships.push({
      id: "5",
      length: 5,
      position: { x: -1, y: -1 },
      isHorizontal: false,
    });
    return ships;
  }

  function main() {
    const board = generateBoard();
    const ships = generateShips();
    for (const ship of ships) {
      placeShip(board, ship);
    }
    console.log(board);
  }
}