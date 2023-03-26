import amqp from "amqplib";

import EventPayload from "./types/payloads/EventPayload";
import ConnectFunctionReturnType from "./types/returnTypes/ConnectFunctionReturnType";

const connect = async (
	url: string,
	exchange: string
): Promise<ConnectFunctionReturnType> => {
	const rabbitConfig = getRabbitConfig(url, 5672, "guest", "guest");
	const connection = await amqp.connect(rabbitConfig);
	const channel = await connection.createChannel();
	await channel.assertExchange(exchange, "topic", { durable: true });

	return { channel, connection };
};

const sendMessage = async (
	channel: amqp.Channel,
	exchange: string,
	routingKey: string,
	payload: EventPayload
): Promise<void> => {
	const parsedPayload = JSON.stringify(payload);
	channel.publish(exchange, routingKey, Buffer.from(parsedPayload));
	console.log(
		`Message sent to exchange ${exchange} with routing key ${routingKey}: ${payload}`
	);
};

const getRabbitConfig = (
	hostname: string,
	port: number,
	username: string,
	password: string
) => {
	return {
		protocol: "amqp",
		hostname,
		port,
		username,
		password,
	};
};

export { connect, sendMessage };
