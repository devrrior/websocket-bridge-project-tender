import dotenv from "dotenv";

dotenv.config();

const config = {
	websocketPort: parseInt(process.env.WEBSOCKET_PORT ?? "3000", 10),
	apiPort: parseInt(process.env.API_PORT ?? "3000", 10),
	projectTenderExchangeURL: process.env.PROJECT_TENDER_EXCHANGE_URL as string,
	projectTenderExchangeName: process.env.PROJECT_TENDER_EXCHANGE_NAME as string,
	cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
	cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY as string,
	cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET as string,
	rabbitMQUser: process.env.RABBITMQ_USER as string,
	rabbitMQPassword: process.env.RABBITMQ_PASSWORD as string,
};

export default config;
