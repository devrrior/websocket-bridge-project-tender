import dotenv from "dotenv";

dotenv.config();

const config = {
	port: parseInt(process.env.PORT ?? "3000", 10),
	projectTenderExchangeURL: process.env.PROJECT_TENDER_EXCHANGE_URL as string,
	projectTenderExchange: process.env.PROJECT_TENDER_EXCHANGE as string,
};

export default config;
