import amqp from "amqplib";

import EventPayload from "./types/payloads/EventPayload";

const connect = async (
	url: string,
	username: string,
	password: string
): Promise<amqp.Connection> => {
	const rabbitConfig = getRabbitConfig(url, 5672, username, password);
	return await amqp.connect(rabbitConfig);
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
