import {Model, model, Schema} from "mongoose"

type GuestModel = Model<IGuest, {}>;

// Guest interface
export interface IGuest{
    username: string,
    points?: number,
    //picture?: string,                         NICE TO HAVE
    level?: number,
    gameSound?: boolean,
    music?: boolean
};

// Guest schema
const guestSchema = new Schema<IGuest, GuestModel>({
    username: {type: String, required: true, unique: true},
    points: {type: Number, default: 0},
    //picture: {type: String, default: ""},     NICE TO HAVE
    level: {type: Number, default: 1},
    gameSound: {type: Boolean, default: true},
    music: {type: Boolean, default: true}
});

export const Guest = model("Guest", guestSchema);