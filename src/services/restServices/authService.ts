import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../../config";
import { findUserByEmail } from "./userService";

export const createJWTToken = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { email, password } = req.body;
	const user = await findUserByEmail(email);

	if (!user) {
		res.status(501);
		res.send({ message: "User not found" });
		return;
	}

	const isVerifiedPassword = await verifyPassword(password, user.password);

	if (!isVerifiedPassword) {
		res.status(501);
		res.send({ message: "User not found" });
		return;
	}

	const token = generateJWTToken(email);

	res.status(201);
	res.send({ token });
	return;
};

const verifyPassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return await bcrypt.compare(password, hashedPassword);
};

const generateJWTToken = (email: string) => {
	return jwt.sign({ email }, config.JWTPrivateKey);
};
