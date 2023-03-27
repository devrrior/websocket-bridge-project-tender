import amqp from "amqplib";

import config from "../../config";
import { sendMessage } from "../../rabbitmq";
import UpdateProjectEventRequest from "../../types/eventRequests/UpdateProjectEventRequest";
import UpdateProjectPayload from "../../types/payloads/UpdateProjectPayload";

const ROUTING_KEY = "project.update";

const updateProjectService = async (
	channel: amqp.Channel,
	eventRequest: UpdateProjectEventRequest
) => {
	const payload: UpdateProjectPayload = {
		name: eventRequest.name,
		description: eventRequest.description,
		budget: eventRequest.budget,
		type: eventRequest.type,
		imageURL: eventRequest.imageURL,
	};

	await sendMessage(
		channel,
		config.projectTenderExchangeName,
		ROUTING_KEY,
		payload
	);
};

export default updateProjectService;
