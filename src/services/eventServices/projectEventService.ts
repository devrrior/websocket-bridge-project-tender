import amqp from "amqplib";
import { Server } from "socket.io";

import config from "../../config";
import WebsocketEvent from "../../enums/WebsocketEvent";
import { sendMessage } from "../../rabbitmq";
import CreateProjectEventRequest from "../../types/eventRequests/CreateProjectEventRequest";
import GetProjectEventRequest from "../../types/eventRequests/GetProjectEventRequest";
import GetProjectListEventRequest from "../../types/eventRequests/GetProjectListEventRequest";
import UpdateProjectEventRequest from "../../types/eventRequests/UpdateProjectEventRequest";
import CreateProjectPayload from "../../types/payloads/CreateProjectPayload";
import GetProjectListPayload from "../../types/payloads/GetProjectListPayload";
import GetProjectPayload from "../../types/payloads/GetProjectPayload";
import UpdateProjectPayload from "../../types/payloads/UpdateProjectPayload";

export const createProjectEventService = async (
	channel: amqp.Channel,
	eventRequest: CreateProjectEventRequest
) => {
	const ROUTING_KEY = "project.create";
	const payload: CreateProjectPayload = {
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

export const getProjectEventService = async (
	channel: amqp.Channel,
	eventRequest: GetProjectEventRequest
) => {
	const ROUTING_KEY = "project.get";
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

export const getProjectListEventService = async (
	channel: amqp.Channel,
	eventRequest: GetProjectListEventRequest
) => {
	const ROUTING_KEY = "projectList.get";
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

export const updateProjectEventService = async (
	channel: amqp.Channel,
	eventRequest: UpdateProjectEventRequest
) => {
	const ROUTING_KEY = "project.update";
	const payload: UpdateProjectPayload = {
		id: eventRequest.id,
		responsibleConstructor: eventRequest.responsibleConstructor,
	};

	await sendMessage(
		channel,
		config.projectTenderExchangeName,
		ROUTING_KEY,
		payload
	);
};

export const newProjectEventService = (payload: string, server: Server) => {
	server.emit(WebsocketEvent.newProject, payload);
};

export const newProjectListEvent = (payload: string, server: Server) => {
	server.emit(WebsocketEvent.newProjectList, payload);
};
