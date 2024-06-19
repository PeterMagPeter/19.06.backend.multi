import {Model, model, Schema} from "mongoose"
import bcrypt from "bcryptjs"

interface IUserMethods{
    isCorrectPassword(toCheck: string): Promise<boolean> 
};

type UserModel = Model<IUser, {}, IUserMethods>;


// User interface
export interface IUser{
    email: string
    username: string,
    password: string,
    points?: number,
    //picture?: string,                         NICE TO HAVE
    premium?: boolean,
    level?: number,
    gameSound?: boolean,
    music?: boolean,
    higherLvlChallenge?: boolean
};

// User schema
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    points: {type: Number, default: 0},
    //picture: {type: String, default: ""},     NICE TO HAVE
    premium: {type: Boolean, default: false},
    level: {type: Number, default: 1},
    gameSound: {type: Boolean, default: true},
    music: {type: Boolean, default: true},
    higherLvlChallenge: {type: Boolean, default: false}
});

userSchema.pre("save", async function () {
    if(this.isModified("password")){
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
});

userSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], async function () {
    const update = this.getUpdate();
    if(update && "password" in update) {
        const hashedPassword = await bcrypt.hash(update.password, 10);
        update.password = hashedPassword;
    }
});

userSchema.method("isCorrectPassword", function(toCheck: string): Promise<boolean> {
    if(this.isModified("password")) {
        throw new Error("Error! Can't compare password, some updates aren't yet saved.")
    }
    const isCorrect = bcrypt.compare(toCheck, this.password);
    return isCorrect;
});

export const User = model("User", userSchema);