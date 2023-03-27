import { IUser, User } from "../../schemas/userSchema";

export const createUser = async (
	email: string,
	password: string,
	roles: string[]
) => {
	const user = new User({ email, password, roles });

	await user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
	const user = await User.findOne({ email });

	return user ? user.toObject() : null;
};
