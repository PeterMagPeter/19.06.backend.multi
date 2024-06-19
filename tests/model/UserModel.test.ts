import { HydratedDocument } from "mongoose";
import { IUser, User } from "../../src/model/UserModel";
import { UserResource } from "../../src/Resources";
import bcrypt from "bcryptjs";

let peter: HydratedDocument<IUser>;

beforeEach(async () => {
    peter = new User({
        email: "peter@example.com",
        password: "1234",
        username: "Peter",
    });
    await peter.save();
});

test("Create User; Is password hashed?", () => {
    expect(peter.username).toBe("Peter");
    expect(peter.password).not.toBe("1234");
    expect(peter.email).toBe("peter@example.com");
});

test("violate unique email constraint", async () => {
    const userRepeatMail = {
        email: "peter@example.com",
        password: "4567",
        username: "Peterle",
    };
    await expect(User.create(userRepeatMail)).rejects.toThrow(
        'E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "peter@example.com" }'
    );
});

test("new User.save() 'max@example.com'", async () => {
    const max: UserResource = {
        email: "max@example.com",
        password: "s4f€",
        username: "Max",
    };
    const userMax = await new User(max).save();
    expect(userMax).toBeDefined();
    expect(userMax.username).toBe("Max");
    expect(await bcrypt.compare(max.password!, userMax.password)).toBe(true);
});

test("User.findOne() find peter", async () => {
    const findPeter = await User.findOne({ username: "Peter" }).exec();
    expect(findPeter?.email).toBe("peter@example.com");
    expect(findPeter?.id).toBe(peter.id);
});

test("User.updateOne update Peters username to Matze", async () => {
    await User.updateOne({ _id: peter.id }, { username: "Matze" }).exec();
    const findMatze = await User.findById(peter.id).exec();
    expect(findMatze?.username).toBe("Matze");
});

test("User update Peters pw, is it hashed?", async () => {
    const newPW = "4mN0tSuR€";
    await User.updateOne({ _id: peter.id }, { password: newPW }).exec();
    const userUpdated = await User.findById(peter.id).exec();
    expect(await bcrypt.compare(newPW, userUpdated!.password)).toBe(true);
});

test("isCorrectPassword test", async () => {
    const findPeter = await User.findById(peter.id).exec();
    expect(await findPeter!.isCorrectPassword("1234")).toBe(true);
    findPeter!.password = "k33nP4$$W0rd";
    expect(
        async () => await findPeter!.isCorrectPassword("1234")
    ).rejects.toThrow("Error! Can't compare password, some updates aren't yet saved.");
});

test("does updateOne work for all update ops?", async () => {
    await User.findOneAndUpdate({_id: peter.id}, {password: "s4f€"}).exec();
    const findPeterle = await User.findOne({username: "Peter"});
    expect(findPeterle?.password).not.toBe("s4f€");
})