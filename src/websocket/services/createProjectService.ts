import amqp from "amqplib";

import config from "../../config";
import { sendMessage } from "../../rabbitmq";
import CreateProjectEventRequest from "../../types/eventRequests/CreateProjectEventRequest";
import CreateProjectPayload from "../../types/payloads/CreateProjectPayload";

const ROUTING_KEY = "project.create";

const createProjectService = async (
	channel: amqp.Channel,
	eventRequest: CreateProjectEventRequest
) => {
	const payload: CreateProjectPayload = {
		name: eventRequest.name,
		description: eventRequest.description,
		budget: eventRequest.budget,
		type: eventRequest.type,
		imageURL: eventRequest.imageURL,
	};

	await sendMessage(
		channel,
		config.projectTenderExchange,
		ROUTING_KEY,
		payload
	);
};

export default createProjectService;
