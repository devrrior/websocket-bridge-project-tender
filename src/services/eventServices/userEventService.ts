import amqp from "amqplib";
import { Server } from "socket.io";

import config from "../../config";
import WebsocketEvent from "../../enums/WebsocketEvent";
import { sendMessage } from "../../rabbitmq";
import CreateUserEventRequest from "../../types/eventRequests/CreateUserEventRequest";
import CreateUserPayload from "../../types/payloads/CreateUserPayload";
import { createUser } from "../restServices/userService";

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
	console.log("entra a new user event");
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
