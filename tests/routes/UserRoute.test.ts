import supertest from "supertest";
import app from "../../src/app";
import { createUser } from "../../src/services/UserService";
import { UserResource } from "../../src/Resources";
import { User } from "../../src/model/UserModel";

let pwMax = "M&xG€h4im";
let pwPeter = "P3t3rG€h4im@@";
let emailMax = "max@example.com";
let emailPeter = "peter@example.com";
let idMax: string;
let idPeter: string;
let userMax: UserResource;
let namePeter = "Peter";

beforeEach(async () => {
    const max = await createUser({
        username: "Max",
        password: pwMax,
        email: emailMax,
    });
    idMax = max.id;
    userMax = max;
});

test("GET /api/user/idMax", async () => {
    const testee = supertest(app);
    const getMax = await testee.get(`/api/user/${idMax}`);
    expect(getMax.statusCode).toBe(200);
    expect(getMax.body.email).toBe(emailMax);
    expect(getMax.body.password).toBe(undefined);
    expect(getMax.body.username).toBe("Max");
    expect(getMax.body.points).toBe(0);
    expect(getMax.body.premium).toBe(false);
    expect(getMax.body.level).toBe(1);
    expect(getMax.body.gameSound).toBe(true);
    expect(getMax.body.music).toBe(true);
    expect(getMax.body.higherLvlChallenge).toBe(false);
});
test("GET /api/user/[non-valid id]", async () => {
    const testee = supertest(app);
    const getNonValid = await testee.get(`/api/user/12345`);
    expect(getNonValid.statusCode).toBe(404);
});

test("PUT /api/user/idMax", async () => {
    const testee = supertest(app);
    const updatedMax: UserResource = {
        id: idMax,
        email: emailMax,
        points: 100,
        level: 3,
        gameSound: false,
        music: false,
        premium: true,
        higherLvlChallenge: true,
        username: "Mäxle"
    };
    const putMax = await testee.put(`/api/user/${idMax}`).send(updatedMax);
    expect(putMax.statusCode).toBe(200);
    expect(putMax.body.email).toBe(emailMax);
    expect(putMax.body.password).toBe(undefined);
    expect(putMax.body.username).toBe("Mäxle");
    expect(putMax.body.points).toBe(100);
    expect(putMax.body.level).toBe(3);
    expect(putMax.body.gameSound).toBe(false);
    expect(putMax.body.music).toBe(false);
    expect(putMax.body.higherLvlChallenge).toBe(true);
    expect(putMax.body.premium).toBe(true);
});

test("POST /api/user/, create new user 'Peter'", async () => {
    const testee = supertest(app);
    const peterResource: UserResource = {
        email: emailPeter,
        password: pwPeter,
        username: namePeter
    }
    const userPeter = await testee.post(`/api/user/`).send(peterResource);
    idPeter = userPeter.body.id;
    expect(userPeter.statusCode).toBe(201);
    expect(userPeter.body.email).toBe(emailPeter);
    expect(userPeter.body.password).toBe(undefined);
    expect(userPeter.body.username).toBe(namePeter);
    expect(userPeter.body.points).toBe(0);
    expect(userPeter.body.premium).toBe(false);
    expect(userPeter.body.level).toBe(1);
    expect(userPeter.body.gameSound).toBe(true);
    expect(userPeter.body.music).toBe(true);
    expect(userPeter.body.higherLvlChallenge).toBe(false);
});

test("PUT Error in updateUser function; user missing in ", async () => {
    const testee = supertest(app);
    await User.deleteMany().exec();
    const updateUserMissing = await testee.put(`/api/user/${idMax}`).send(userMax);
    expect(updateUserMissing.statusCode).toBe(404);
});

test("PUT Error, id in body and params not the same", async () => {
    const testee = supertest(app);
    const idNotSame = await testee.put(`/api/user/${idPeter}`).send(userMax);
    expect(idNotSame.statusCode).toBe(400);
});

test("PUT Error, level negative value", async () => {
    const testee = supertest(app);
    const updatedMax: UserResource = {
        id: idMax,
        email: emailMax,
        username: "Max",
        level: -420
    }; 
    const respMax = await testee.put(`/api/user/${idMax}`).send(updatedMax);
    expect(respMax.statusCode).toBe(400); 
});

test("/api/user/all post alle user", async () => {
    const testee = supertest(app);

    const response = await testee.post(`/api/user/all`).send(userMax);
    expect(response.statusCode).toBe(404);
});

test("/api/user/all put alle user", async () => {
    const testee = supertest(app);

    const response = await testee.put(`/api/user/all`).send(userMax);
    expect(response.statusCode).toBe(404);
});

test("/api/user/all put alle user", async () => {
    const testee = supertest(app);

    const response = await testee.put(`/api/user/all`).send(userMax);
    expect(response.statusCode).toBe(404);
});

test("/api/user/all delete alle user", async () => {
    const testee = supertest(app);
    const response = await testee.delete(`/api/user/all`);
    expect(response.statusCode).toBe(404);
});

test("/api/user/all get alle user", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/user/all`);
    expect(response.statusCode).toBe(200);
});

test("/api/user/alle delete user by id", async () => {
    const testee = supertest(app);
    let response = await testee.delete(`/api/user/${idMax}`);
    expect(response.statusCode).toBe(204);
    response = await testee.delete(`/api/user/bla`);
    expect(response.statusCode).toBe(400);
    response = await testee.delete(`/api/user/${idMax}`);
    expect(response.statusCode).toBe(404);
});

test("/api/user/ post with false prop val expected 400", async () => {
    const testee = supertest(app);
    const emailJuergen = "juergen@gmx.de";
    const pwJuergen = pwMax

    const juergen = {
        username: "Juergen",
        password: pwJuergen,
        email: emailJuergen,
        gameSound: "string" as unknown as boolean
    };

    const response = await testee.post(`/api/user/`).send(juergen);
    expect(response.statusCode).toBe(400);
});

test("/api/user/ post expected 400 with text message 'User with that email already in DB!'", async () => {
    const testee = supertest(app);
    const emailJuergen = "juergen@gmx.de";
    const pwJuergen = pwPeter

    const juergen = {
        username: "Juergen",
        password: pwJuergen,
        email: emailJuergen
    };

    let response = await testee.post(`/api/user/`).send(juergen);
    response = await testee.post(`/api/user/`).send(juergen);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors)
        .toStrictEqual([{"location": "body", "msg": "User with that email already in DB!", "path": "email", "value": "juergen@gmx.de"}]);
});
