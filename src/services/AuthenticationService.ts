import { User } from "../model/UserModel"

/**
 * Checks name and password. If successful, true is returned, otherwise false
 */
export async function login(email: string, password: string): Promise<{ id: string } | false> {
    const user = await User.findOne({ email: email }).exec();
    const pwValid = await user?.isCorrectPassword(password);
    if (!user || !pwValid) return false
    else return { id: user?.id }
}