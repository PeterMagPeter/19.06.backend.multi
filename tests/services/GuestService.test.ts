import { createGuest, deleteGuest, getGuest, updateGuest } from "../../src/services/GuestService";
import { GuestResource } from "../../src/Resources";
import { Guest } from "../../src/model/GuestModel";

let createdGuest: GuestResource;
let guestMinimalObj: GuestResource = {
    username: "RandoGuest",
}
let idCreated: string;
beforeEach(async () => {
    createdGuest = await createGuest(guestMinimalObj);
    if(createdGuest.id) idCreated = createdGuest.id;
});

test("Are default properties and name filled?", ()=>{
    expect(createdGuest.username).toBe("RandoGuest");
    expect(createdGuest.points).toBe(0);
    expect(createdGuest.level).toBe(1);
    expect(createdGuest.gameSound).toBe(true);
    expect(createdGuest.music).toBe(true);
});

test("getGuest with empty ID should throw error: 'Please provide an ID to search for!'", async () => {
    await expect(getGuest("")).rejects.toThrow("Please provide an ID to search for!");
    await expect(getGuest("")).rejects.not.toThrow("Sanity check");
});

test("getGuest with wrong ID should throw error: 'Couldn't find guest with provided ID!'", async () => {
    await deleteGuest(idCreated);
    await expect(getGuest(idCreated)).rejects.toThrow("Couldn't find guest with provided ID!");
    await expect(getGuest(idCreated)).rejects.not.toThrow("Sanity check");
});

test("updateGuest cannot update username", async () => {
    const newNick = await updateGuest({ id: createdGuest.id, username: "Nick" });
    expect(newNick.username).toBe(createdGuest.username);
});
 
test("updateGuest update (only update valid values)", async () => {
    const newNick = await updateGuest({ id: createdGuest.id, username: createdGuest.username, level: null! });
    expect(newNick.level).toBe(createdGuest.level);
});

test("updateGuest ID empty should throw error: 'Please provide an ID to update!'", async () => {
    await expect(updateGuest({username: "Test"}))
        .rejects.toThrow("Please provide an ID to update!");
    await expect(updateGuest({username: "Test"}))
        .rejects.not.toThrow("Sanity check");
});

test("updateGuest, guest not valid entry in DB should throw: 'Guest couldn't be found!'", async () => {
    await Guest.findByIdAndDelete(idCreated).exec();
    await expect(updateGuest({id: idCreated, username: "Test"}))
        .rejects.toThrow("Guest couldn't be found!");
    await expect(updateGuest({id: idCreated, username: "Test"}))
        .rejects.not.toThrow("Sanity check");
});

test("updateGuest update points", async () => {
    const userUpdated = await updateGuest({ 
                        id: createdGuest.id, 
                        username: createdGuest.username, 
                        points: 100,
                        level: 5,
                        gameSound: false,
                        music: false
                    });
    expect(userUpdated.username).toBe(createdGuest.username);
    expect(userUpdated.points).toBe(100);
    expect(userUpdated.level).toBe(5);
    expect(userUpdated.gameSound).toBe(false);
    expect(userUpdated.music).toBe(false);
});

test("delete w empty ID throws: 'Please provide an ID to search for!'", async () => {
    await expect(deleteGuest("")).rejects.toThrow("Please provide an ID to search for!");
    await expect(deleteGuest("")).rejects.not.toThrow("Sanity check");
});

test("deleteGuest actually deletes", async () => {
    await deleteGuest(idCreated);
    const allGuests = await Guest.find({}).exec();
    expect(allGuests.length).toBe(0);
});

test("deleteGuest w non-existing ID throws 'Object to delete not found!'", async () => {
    await deleteGuest(idCreated);
    await expect(deleteGuest(idCreated)).rejects.toThrow("Object to delete not found!");
});

