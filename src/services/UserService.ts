import { UserResource } from "../Resources";
import { User } from "../model/UserModel";

/**
 * Create user with data from UserResource and return created object.
 */
export async function createUser(userRes: UserResource) {
    const user = await User.create({
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
    return await getUser(user.id);
}

/**
 * Identify and update user by ID with the given UserResource
 * If no id is provided or user couldn't be found, an error is thrown.
 */
export async function updateUser(userRes: UserResource) {
    
    if(!userRes.id)
        throw new Error("Please provide an ID to update!");

    const user = await User.findById(userRes.id).exec();
    if (!user)
        throw new Error("User couldn't be found!");

    if(userRes.email)
        user.email = userRes.email;
    if(isDefined(userRes.username))
        user.username = userRes.username;
    if(isDefined(userRes.points))
        user.points = userRes.points;
    if(isDefined(userRes.premium))
        user.premium = userRes.premium;
    if(isDefined(userRes.level))
        user.level = userRes.level;
    if(isDefined(userRes.gameSound))
        user.gameSound = userRes.gameSound;
    if(isDefined(userRes.music))
        user.music = userRes.music;
    if(isDefined(userRes.higherLvlChallenge))
        user.higherLvlChallenge = userRes.higherLvlChallenge;

    await user.save();
    
    return await getUser(user.id);
    
    function isDefined(x: any): boolean {
        return x !== undefined && x !== null;
    }
}

/**
 * Get and return user by ID.
 * If user couldn't be found an error is thrown.
 */
export async function getUser(id: string){
    if(!id)
        throw new Error("Please provide an ID to search for!");
    
    const user = await User.findById(id);
    if(!user)
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
}

/**
 * Identify user by ID.
 * If user couldn't be found an error is thrown.
 */
export async function deleteUser(id: string): Promise<void> {
    if(!id)
        throw new Error("Please provide an ID to search for!");
    const result = await User.findById(id).exec();
    if(result){
        await User.findByIdAndDelete(result.id);
    } else {
        throw new Error('Object to delete not found!');
    }
}

/**
 * Returns all users stored in DB.
 * Omits privacy related data, i.e. email, id and member status
 */
export async function getAllUsers(): Promise<UserResource[]> {
    const users = await User.find({}).exec();
    const userResources = users.map(user => ({ 
        username: user.username,
        points: user.points,
        level: user.level,
    }));
    return userResources;
}