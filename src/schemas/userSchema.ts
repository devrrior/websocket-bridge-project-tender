import { model, Schema } from "mongoose";

export interface IUser {
	email: string;
	password: string;
}

export const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	roles: { required: true, type: Array<string> }
});

export const User = model("User", userSchema);
