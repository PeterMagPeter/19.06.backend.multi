"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestBoard_1 = require("../../src/gamelogic/TestBoard");
const Ship_1 = require("../../src/gamelogic/Ship");
const TestControllerMaris_1 = require("../../src/gamelogic/TestControllerMaris");
const AIship1 = new Ship_1.Ship("2a", "Y", 5, 5, 2);
const AIship2 = new Ship_1.Ship("2b", "X", 7, 7, 2);
const playerShip1 = new Ship_1.Ship("2a", "Y", 5, 5, 2);
const playerShip2 = new Ship_1.Ship("2b", "X", 7, 7, 2);
const aiBoard = new TestBoard_1.Board(10, 2, "AI");
aiBoard.fillEmptyField();
aiBoard.addShips([AIship1, AIship2]);
aiBoard.setShipPositions();
const playerBoard = new TestBoard_1.Board(10, 2, "Player");
playerBoard.fillEmptyField();
playerBoard.addShips([playerShip1, playerShip2]);
playerBoard.setShipPositions();
const controller = new TestControllerMaris_1.TestPlayerController(playerBoard, aiBoard, "AI");
let missingPos = { x: 4, y: 2 };
let hitPos = { x: 5, y: 5 };
test("Current Player should be 'AI'", () => {
    expect(controller.playerWhosTurnItIs).toBe("AI");
});
const hitShot = controller.shoot(hitPos);
test("Current Player should be 'AI'", () => {
    expect(controller.playerWhosTurnItIs).toBe("AI");
});
const missingShot = controller.shoot(missingPos);
test("We should have hit", () => {
    expect(controller.playerWhosTurnItIs).toBe("Player");
    expect(hitShot).toBe(true);
});
test("What does the AI field look like?", () => {
    expect(controller.boards[0].playfield).toEqual([[".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", "O", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "X", "2a", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", "2b", ".", "."], [".", ".", ".", ".", ".", ".", ".", "2b", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."]]);
});
controller.shoot(missingPos);
test("What does the player field look like?", () => {
    expect(controller.boards[1].playfield).toEqual([[".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", "O", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "2a", "2a", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", "2b", ".", "."], [".", ".", ".", ".", ".", ".", ".", "2b", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", ".", "."]]);
});
test("We should get false", () => {
    expect(controller.playerWhosTurnItIs).toBe("AI");
    expect(missingShot).toBe(false);
});
/* let missingPos: Position =  {x: 4, y: 2};
 test("Checking for whos turn it is", ()=>{
    expect(controller.playerWhosTurnItIs).toBe("AI");
})
const missingShot = controller.shoot(missingPos);
test("We should get false", ()=>{
    expect(controller.playerWhosTurnItIs).toBe("AI");
    expect(missingShot).toBe(false);
})
let hitPos: Position =  {x: 5, y: 5};
const hitShot = controller.shoot(hitPos);
test("We should get true", ()=>{
    // expect(controller.boards[0].playfield).toEqual("kp")
    // expect(controller.playerWhosTurnItIs).toBe("AI");
    // expect(hitShot).toBe(true);
    expect(controller.boards[1].playfield).toEqual("kp")
    controller.shoot({x: 5, y: 5});
    expect(controller.playerWhosTurnItIs).toBe("AI");
})
test("We should get true", ()=>{
    expect(controller.boards[0].playfield).toEqual("kp")
    controller.shoot({x: 5, y: 5});
    expect(controller.playerWhosTurnItIs).toBe("AI");
}) */ 
//# sourceMappingURL=controller.test.js.map