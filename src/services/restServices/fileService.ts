import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";

import config from "../../config";

const cloudinaryFolder = "project-tender/project-images";

cloudinary.config({
	cloud_name: config.cloudinaryCloudName,
	api_key: config.cloudinaryAPIKey,
	api_secret: config.cloudinaryAPISecret,
});

export const fileService = async (req: Request, res: Response) => {
	const file = req.file;

	if (!file) throw new Error("No se ha enviado ningún archivo");

	const result = await cloudinary.uploader.upload(file.path, {
		folder: cloudinaryFolder,
	});

	const fileUrl = result.secure_url;

	res.send({ url: fileUrl });
};
