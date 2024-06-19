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
exports.deleteGuest = exports.updateGuest = exports.getGuest = exports.createGuest = void 0;
const GuestModel_1 = require("../model/GuestModel");
/**
 * Create guest with data from GuestResource and return created object.
 */
function createGuest(guestRes) {
    return __awaiter(this, void 0, void 0, function* () {
        const guest = yield GuestModel_1.Guest.create({
            username: guestRes.username,
            points: guestRes.points,
            level: guestRes.level,
            gameSound: guestRes.gameSound,
            music: guestRes.music
        });
        return yield getGuest(guest.id);
    });
}
exports.createGuest = createGuest;
/**
 * Get and return guest by ID.
 * If guest couldn't be found an error is thrown.
 */
function getGuest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new Error("Please provide an ID to search for!");
        const guest = yield GuestModel_1.Guest.findById(id).exec();
        if (!guest)
            throw new Error("Couldn't find guest with provided ID!");
        return {
            id: guest.id,
            username: guest.username,
            points: guest.points,
            level: guest.level,
            gameSound: guest.gameSound,
            music: guest.music
        };
    });
}
exports.getGuest = getGuest;
/**
 * Identify and update guest by ID with the given GuestResource
 * If no id is provided or guest couldn't be found, an error is thrown.
 */
function updateGuest(guestRes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!guestRes.id)
            throw new Error("Please provide an ID to update!");
        const guest = yield GuestModel_1.Guest.findById(guestRes.id).exec();
        if (!guest)
            throw new Error("Guest couldn't be found!");
        if (isDefined(guestRes.points))
            guest.points = guestRes.points;
        if (isDefined(guestRes.level))
            guest.level = guestRes.level;
        if (isDefined(guestRes.gameSound))
            guest.gameSound = guestRes.gameSound;
        if (isDefined(guestRes.music))
            guest.music = guestRes.music;
        yield guest.save();
        return yield getGuest(guest.id);
        function isDefined(x) {
            return x !== undefined && x !== null;
        }
    });
}
exports.updateGuest = updateGuest;
/**
 * Identify and delete guest by ID.
 * If guest couldn't be found an error is thrown.
 */
function deleteGuest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new Error("Please provide an ID to search for!");
        const result = yield GuestModel_1.Guest.findById(id).exec();
        if (result) {
            yield GuestModel_1.Guest.findByIdAndDelete(result.id).exec();
        }
        else {
            throw new Error('Object to delete not found!');
        }
    });
}
exports.deleteGuest = deleteGuest;
//# sourceMappingURL=GuestService.js.map