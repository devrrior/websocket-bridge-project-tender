import amqp from "amqplib";

import config from "../../config";
import { sendMessage } from "../../rabbitmq";
import CreateUserEventRequest from "../../types/eventRequests/CreateUserEventRequest";
import EventPayload from "../../types/payloads/EventPayload";
import GetProjectListEventRequest from "../../types/eventRequests/GetProjectListEventRequest";
import GetProjectListPayload from "../../types/payloads/GetProjectListPayload";

const ROUTING_KEY = "projectList.get";

const getProjectListService = async (
	channel: amqp.Channel,
	eventRequest: GetProjectListEventRequest
) => {
	const payload: GetProjectListPayload = {
		pageNumber: eventRequest.pageNumber,
		pageSize: eventRequest.pageSize,
	};

	await sendMessage(
		channel,
		config.projectTenderExchangeName,
		ROUTING_KEY,
		payload
	);
};

export default getProjectListService;
