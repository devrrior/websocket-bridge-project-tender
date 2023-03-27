import amqp from "amqplib";

import config from "../../config";
import { sendMessage } from "../../rabbitmq";
import GetProjectEventRequest from "../../types/eventRequests/GetProjectEventRequest";
import GetProjectPayload from "../../types/payloads/GetProjectPayload";

const ROUTING_KEY = "project.get";

const getProjectService = async (
	channel: amqp.Channel,
	eventRequest: GetProjectEventRequest
) => {
	const payload: GetProjectPayload = {
		id: eventRequest.id,
	};

	await sendMessage(
		channel,
		config.projectTenderExchangeName,
		ROUTING_KEY,
		payload
	);
};

export default getProjectService;
