import amqp from "amqplib";
import { Server } from "socket.io";

import config from "../../config";
import { sendMessage } from "../../rabbitmq";
import CreateUserEventRequest from "../../types/eventRequests/CreateUserEventRequest";
import CreateUserPayload from "../../types/payloads/CreateUserPayload";
import { createUser } from "../restServices/userService";
import WebsocketEvent from "../../enums/WebsocketEvent";

export const createUserEventService = async (
	channel: amqp.Channel,
	eventRequest: CreateUserEventRequest
) => {
	const ROUTING_KEY = "user.create";

	const payload: CreateUserPayload = {
		name: eventRequest.name,
		email: eventRequest.email,
		password: eventRequest.password,
	};

	await sendMessage(
		channel,
		config.projectTenderExchangeName,
		ROUTING_KEY,
		payload
	);
};

export const newUserEventService = (payload: string, _: Server) => {
	const parsedPayload = JSON.parse(payload);
	createUser(parsedPayload.email, parsedPayload.password, parsedPayload.roles)
		.then(() => {
			console.log("User created!");
			return;
		})
		.catch((e) => {
			console.log(e);
			console.log("User not created!");
		});
};

export const currentUserEventService = (payload: string, server: Server) => {
	server.emit(WebsocketEvent.currentUser, payload);
};
