import supertest from "supertest";
import app from "../../src/app";
import { createGuest, getGuest } from "../../src/services/GuestService";
import { GuestResource } from "../../src/Resources";
import { Guest } from "../../src/model/GuestModel";

let idMax: string;
let idPeter: string;
let guestMax: GuestResource;
let namePeter = "Peter";

beforeEach(async () => {
    const max = await createGuest({
        username: "Max",
    });
    idMax = max.id;
    guestMax = max;
});

test("GET /api/guest/idMax", async () => {
    const testee = supertest(app);
    const getMax = await testee.get(`/api/guest/${idMax}`);
    expect(getMax.statusCode).toBe(200);
    expect(getMax.body.username).toBe("Max");
    expect(getMax.body.points).toBe(0);
    expect(getMax.body.level).toBe(1);
    expect(getMax.body.gameSound).toBe(true);
    expect(getMax.body.music).toBe(true);
});

test("GET /api/guest/[non-valid id]", async () => {
    const testee = supertest(app);
    const getNonValid = await testee.get(`/api/guest/12345`);
    expect(getNonValid.statusCode).toBe(404);
});

test("PUT /api/guest/idMax", async () => {
    const testee = supertest(app);
    const updatedMax: GuestResource = {
        id: idMax,
        points: 100,
        level: 3,
        gameSound: false,
        music: false,
        username: "Mäxle"
    };
    const putMax = await testee.put(`/api/guest/${idMax}`).send(updatedMax);
    expect(putMax.statusCode).toBe(200);
    // CANNOT UPDATE USERNAME TEST
    expect(putMax.body.username).toBe("Max");
    expect(putMax.body.points).toBe(100);
    expect(putMax.body.level).toBe(3);
    expect(putMax.body.gameSound).toBe(false);
    expect(putMax.body.music).toBe(false);
    expect(putMax.body.higherLvlChallenge).toBe(undefined);
    expect(putMax.body.premium).toBe(undefined);
});

test("POST /api/guest/, create new guest 'Peter'", async () => {
    const testee = supertest(app);
    const peterResource: GuestResource = {
        username: namePeter
    }
    const guestPeter = await testee.post(`/api/guest/`).send(peterResource);
    idPeter = guestPeter.body.id;
    expect(guestPeter.statusCode).toBe(201);
    expect(guestPeter.body.username).toBe(namePeter);
    expect(guestPeter.body.points).toBe(0);
    expect(guestPeter.body.premium).toBe(undefined);
    expect(guestPeter.body.level).toBe(1);
    expect(guestPeter.body.gameSound).toBe(true);
    expect(guestPeter.body.music).toBe(true);
    expect(guestPeter.body.higherLvlChallenge).toBe(undefined);
});

test("PUT Error in updateGuest function; guest missing in DB", async () => {
    const testee = supertest(app);
    await Guest.deleteMany().exec();
    const updateGuestMissing = await testee.put(`/api/guest/${idMax}`).send(guestMax);
    expect(updateGuestMissing.statusCode).toBe(404);
});

test("PUT Error, id in body and params not the same", async () => {
    const testee = supertest(app);
    const idNotSame = await testee.put(`/api/guest/${idPeter}`).send(guestMax);
    expect(idNotSame.statusCode).toBe(400);
});

test("PUT Error, level negative value", async () => {
    const testee = supertest(app);
    const updatedMax: GuestResource = {
        id: idMax,
        username: "Max",
        level: -420
    }; 
    const respMax = await testee.put(`/api/guest/${idMax}`).send(updatedMax);
    expect(respMax.statusCode).toBe(400); 
});

test("POST /api/guest/all trying to create via /all responds 404", async () => {
    const testee = supertest(app);

    const response = await testee.post(`/api/guest/all`).send(guestMax);
    expect(response.statusCode).toBe(404);
});

test("PUT /api/guest/all trying to update all guests responds 404", async () => {
    const testee = supertest(app);

    const response = await testee.put(`/api/guest/all`).send(guestMax);
    expect(response.statusCode).toBe(404);
});

test("DELETE /api/guest/all trying to delete all guests responds 404", async () => {
    const testee = supertest(app);
    const response = await testee.delete(`/api/guest/all`);
    expect(response.statusCode).toBe(404);
});

test("GET /api/guest/all trying to get all guests responds 404", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/guest/all`);
    expect(response.statusCode).toBe(404);
});

test("/api/guest/alle delete guest by id", async () => {
    const testee = supertest(app);
    let response = await testee.delete(`/api/guest/${idMax}`);
    expect(response.statusCode).toBe(204);
    response = await testee.delete(`/api/guest/bla`);
    expect(response.statusCode).toBe(400);
    response = await testee.delete(`/api/guest/${idMax}`);
    expect(response.statusCode).toBe(404);
});

test("POST /api/guest/ with false prop val expected 400", async () => {
    const testee = supertest(app);

    const juergen: GuestResource ={
        username: "Juergen",
        gameSound: "undefined" as unknown as boolean
    };

    const response = await testee.post(`/api/guest/`).send(juergen);
    expect(response.statusCode).toBe(400);
});

test("Return 400 and the error message when an error occurs while creating the guest", async () => {
    const testee = supertest(app);

    const max: GuestResource ={
        username: "Max"
    };

    const response = await testee.post(`/api/guest/`).send(max);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toEqual("User with that name already exists!");
});

/* test("POST /api/guest/ expected 400", async () => {
    const testee = supertest(app);

    const juergen: GuestResource = {
        username: "Juergen",
    };

    let response = await testee.post(`/api/guest/`).send(juergen);
    response = await testee.post(`/api/guest/`).send(juergen);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors)
        .toStrictEqual([{"location": "body", "msg": "Guest with that name already in DB!", "path": "username", "value": juergen.username}]);
});
 */