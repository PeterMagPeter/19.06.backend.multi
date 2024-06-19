import { GuestResource } from "src/Resources";
import { Guest } from "../model/GuestModel";

/**
 * Create guest with data from GuestResource and return created object.
 */
export async function createGuest(guestRes: GuestResource) {
    const guest = await Guest.create({
        username: guestRes.username,
        points: guestRes.points,
        level: guestRes.level,
        gameSound: guestRes.gameSound,
        music: guestRes.music
    });
    return await getGuest(guest.id);
}

/**
 * Get and return guest by ID.
 * If guest couldn't be found an error is thrown.
 */
export async function getGuest(id: string) {
    if(!id)
        throw new Error("Please provide an ID to search for!");
    
    const guest = await Guest.findById(id).exec();
    if(!guest)
        throw new Error("Couldn't find guest with provided ID!");

    return {
        id: guest.id,
        username: guest.username,
        points: guest.points,
        level: guest.level,
        gameSound: guest.gameSound,
        music: guest.music
    };
}

/**
 * Identify and update guest by ID with the given GuestResource
 * If no id is provided or guest couldn't be found, an error is thrown.
 */
export async function updateGuest(guestRes: GuestResource) {

    if(!guestRes.id)
        throw new Error("Please provide an ID to update!");

    const guest = await Guest.findById(guestRes.id).exec();
    if (!guest)
        throw new Error("Guest couldn't be found!");

    if(isDefined(guestRes.points))
        guest.points = guestRes.points;
    if(isDefined(guestRes.level))
        guest.level = guestRes.level;
    if(isDefined(guestRes.gameSound))
        guest.gameSound = guestRes.gameSound;
    if(isDefined(guestRes.music))
        guest.music = guestRes.music;

    await guest.save();
    
    return await getGuest(guest.id);
    
    function isDefined(x: any): boolean {
        return x !== undefined && x !== null;
    }
}

/**
 * Identify and delete guest by ID.
 * If guest couldn't be found an error is thrown.
 */
export async function deleteGuest(id: string): Promise<void> {
    if(!id)
        throw new Error("Please provide an ID to search for!");
    const result = await Guest.findById(id).exec();
    if(result){
        await Guest.findByIdAndDelete(result.id).exec();
    } else {
        throw new Error('Object to delete not found!');
    }
}