import amqp from "amqplib";

import config from "../config";
import { sendMessage } from "../rabbitmq/rabbitmq";
import CreateUserEventRequest from "../types/eventRequests/CreateUserEventRequest";
import CreateUserPayload from "../types/payloads/CreateUserPayload";

const ROUTING_KEY = "user.create";

const createUserService = async (
	channel: amqp.Channel,
	eventRequest: CreateUserEventRequest
) => {
	const payload: CreateUserPayload = {
		name: eventRequest.name,
		email: eventRequest.email,
		password: eventRequest.password,
	};

	await sendMessage(
		channel,
		config.projectTenderExchange,
		ROUTING_KEY,
		payload
	);
};

export default createUserService;
