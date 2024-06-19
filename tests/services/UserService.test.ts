import { UserResource } from "../../src/Resources";
import { IUser, User } from "../../src/model/UserModel";
import {
  createUser,
  updateUser,
  getUser,
  deleteUser,
} from "../../src/services/UserService";

let existingUser;
let createdUser: UserResource;
let user: UserResource = {
  email: "test@example.com",
  password: "password",
  username: "Test",
  points: 0,
  premium: false,
  level: 1,
  gameSound: true,
  music: true,
  higherLvlChallenge: false,
};
beforeEach(async () => {
  createdUser = await createUser(user);
});

test("Are there all properties and password missing?", () => {
    expect(createdUser.password).toBeUndefined();
    expect(createdUser.email).toBe("test@example.com");
    expect(createdUser.username).toBe("Test");
    expect(createdUser.points).toBe(0);
    expect(createdUser.premium).toBe(false);
    expect(createdUser.level).toBe(1);
    expect(createdUser.gameSound).toBe(true);
    expect(createdUser.music).toBe(true);
    expect(createdUser.higherLvlChallenge).toBe(false);
});

 test("updateUser update", async () => {
   const newNick = await updateUser({ id: createdUser.id, email: user.email, username: "Nick" });
   expect(newNick.username).toBe("Nick");
   expect(newNick.email).toBe(user.email);
 });


test("updateUser update (missing required attributes)", async () => {
   const newNick = await updateUser({ id: createdUser.id, email: user.email, username: null! });
   expect(newNick.username).toBe("Test");
 });

test("deleting user", async () => {
  const deleteUserResult = await deleteUser(createdUser.id!);
  expect(deleteUserResult).toBeUndefined();
  await expect(getUser(createdUser.id!)).rejects.toThrow("Couldn't find user with provided ID!");
});

test("createUser with only required values", async () => {
  const minimalUser: UserResource = {
    email: "minimal@example.com",
    password: "password",
    username: "Mini",
  };
  const createdMinimalUser = await createUser(minimalUser);
  expect(createdMinimalUser.email).toBe("minimal@example.com");
  expect(createdMinimalUser.username).toBe("Mini");
});

test("updateUser with only required values", async () => {
  const updatedUser = await updateUser({ id: createdUser.id, email: "updated@example.com", username: "Mini" });
  expect(updatedUser.email).toBe("updated@example.com");
  expect(updatedUser.username).toBe("Mini");
});

test("updateUser should throw an error if empty ID is provided", async () => {
  const userToUpdate: UserResource = {
    id: "",
    email: "update@example.com",
    password: "updatePassword",
    username: "UpdatedUser"
  };

  await expect(async() => await updateUser(userToUpdate))
    .rejects
    .toThrow("Please provide an ID to update!");
});

test("should not allow updates on a deleted user", async () => {
  const userData: IUser = {
    email: "temporary@example.com",
    password: "tempPassword",
    username: "TempUser",
    points: 10,
    premium: false,
    level: 1,
    gameSound: true,
    music: false,
    higherLvlChallenge: false,
  };

  const createdUser = await createUser(userData);

  await deleteUser(createdUser.id);

  const updatedData = {
    id: createdUser.id,
    email: "updated@example.com",
    username: "UpdatedUser"
  };

  await expect(async() => await updateUser(updatedData))
    .rejects
    .toThrow("User couldn't be found!");
});

test("should update user points when defined", async () => {

  existingUser = await new User({
    email: "user@example.com",
    password: "password123",
    username: "RegularUser",
    points: 50,
    premium: false,
    level: 1,
    gameSound: true,
    music: false,
    higherLvlChallenge: false,
  }).save();
  
  const updateData: UserResource = {
    username: null!,
    email: null!,
    id: existingUser.id,
    points: 100,
    premium: true,
    level: 3,
    gameSound: false,
    music: true,
    higherLvlChallenge: true 
  };

  const updatedUser = await updateUser(updateData);
  expect(updatedUser.points).toBe(100);
  expect(updatedUser.premium).toBe(true);
  expect(updatedUser.level).toBe(3);
  expect(updatedUser.gameSound).toBe(false);
  expect(updatedUser.music).toBe(true);
  expect(updatedUser.higherLvlChallenge).toBe(true);
});

test('throws an error if no ID is provided', async () => {
  await expect(getUser('')).rejects.toThrow("Please provide an ID to search for!");
});

test('throws an error if ID is undefined', async () => {
  await expect(getUser(undefined as unknown as string)).rejects.toThrow("Please provide an ID to search for!");
});

test('throws an error if no ID is provided', async () => {
  await expect(deleteUser('')).rejects.toThrow("Please provide an ID to search for!");
});


test('delete: ID not from an existing user', async () => {
  await deleteUser(createdUser.id!)
  await expect(deleteUser(createdUser.id!)).rejects.toThrow("Object to delete not found!");
});