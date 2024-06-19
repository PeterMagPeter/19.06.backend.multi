"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.deleteUser = exports.getUser = exports.updateUser = exports.createUser = void 0;
const UserModel_1 = require("../model/UserModel");
/**
 * Create user with data from UserResource and return created object.
 */
function createUser(userRes) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserModel_1.User.create({
            email: userRes.email,
            password: userRes.password,
            username: userRes.username,
            points: userRes.points,
            premium: userRes.premium,
            level: userRes.level,
            gameSound: userRes.gameSound,
            music: userRes.music,
            higherLvlChallenge: userRes.higherLvlChallenge
        });
        return yield getUser(user.id);
    });
}
exports.createUser = createUser;
/**
 * Identify and update user by ID with the given UserResource
 * If no id is provided or user couldn't be found, an error is thrown.
 */
function updateUser(userRes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userRes.id)
            throw new Error("Please provide an ID to update!");
        const user = yield UserModel_1.User.findById(userRes.id).exec();
        if (!user)
            throw new Error("User couldn't be found!");
        if (userRes.email)
            user.email = userRes.email;
        if (isDefined(userRes.username))
            user.username = userRes.username;
        if (isDefined(userRes.points))
            user.points = userRes.points;
        if (isDefined(userRes.premium))
            user.premium = userRes.premium;
        if (isDefined(userRes.level))
            user.level = userRes.level;
        if (isDefined(userRes.gameSound))
            user.gameSound = userRes.gameSound;
        if (isDefined(userRes.music))
            user.music = userRes.music;
        if (isDefined(userRes.higherLvlChallenge))
            user.higherLvlChallenge = userRes.higherLvlChallenge;
        yield user.save();
        return yield getUser(user.id);
        function isDefined(x) {
            return x !== undefined && x !== null;
        }
    });
}
exports.updateUser = updateUser;
/**
 * Get and return user by ID.
 * If user couldn't be found an error is thrown.
 */
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new Error("Please provide an ID to search for!");
        const user = yield UserModel_1.User.findById(id);
        if (!user)
            throw new Error("Couldn't find user with provided ID!");
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            points: user.points,
            premium: user.premium,
            level: user.level,
            gameSound: user.gameSound,
            music: user.music,
            higherLvlChallenge: user.higherLvlChallenge
        };
    });
}
exports.getUser = getUser;
/**
 * Identify user by ID.
 * If user couldn't be found an error is thrown.
 */
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new Error("Please provide an ID to search for!");
        const result = yield UserModel_1.User.findById(id).exec();
        if (result) {
            yield UserModel_1.User.findByIdAndDelete(result.id);
        }
        else {
            throw new Error('Object to delete not found!');
        }
    });
}
exports.deleteUser = deleteUser;
/**
 * Returns all users stored in DB.
 * Omits privacy related data, i.e. email, id and member status
 */
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield UserModel_1.User.find({}).exec();
        const userResources = users.map(user => ({
            username: user.username,
            points: user.points,
            level: user.level,
        }));
        return userResources;
    });
}
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=UserService.js.map