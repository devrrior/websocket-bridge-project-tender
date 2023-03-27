import amqp from "amqplib";
import { Server, Socket } from "socket.io";

import config from "../config";
import WebsocketEvent from "../enums/WebsocketEvent";
import { connect } from "../rabbitmq";
import CreateProjectEventRequest from "../types/eventRequests/CreateProjectEventRequest";
import CreateUserEventRequest from "../types/eventRequests/CreateUserEventRequest";
import GetProjectEventRequest from "../types/eventRequests/GetProjectEventRequest";
import GetProjectListEventRequest from "../types/eventRequests/GetProjectListEventRequest";
import UpdateProjectEventRequest from "../types/eventRequests/UpdateProjectEventRequest";
import createProjectService from "./services/createProjectService";
import createUserService from "./services/createUserService";
import getProjectListService from "./services/getProjectListService";
import getProjectService from "./services/getProjectService";
import updateProjectService from "./services/updateProjectService";
import queueName from "../enums/QueueName";

const setUpWebsocket = async () => {
	const io = new Server();
	const connection = await connect(
		config.projectTenderExchangeURL,
		config.rabbitMQUser,
		config.rabbitMQPassword
	);

	const channelSender = await getChannelWithExchange(
		connection,
		config.projectTenderExchangeName
	);

	io.on("connection", async (socket: Socket) => {
		console.log(`User with ID ${socket.id} has connected`);

		socket.on(
			WebsocketEvent.getProject,
			(eventRequest: GetProjectEventRequest) => {
				getProjectService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.getProjectList,
			(eventRequest: GetProjectListEventRequest) => {
				getProjectListService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.createUser,
			(eventRequest: CreateUserEventRequest) => {
				createUserService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.createProject,
			(eventRequest: CreateProjectEventRequest) => {
				createProjectService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.updateProject,
			(eventPayload: UpdateProjectEventRequest) => {
				updateProjectService(channelSender, eventPayload);
				console.log("Event sent!");
			}
		);

		socket.on("disconnect", () => {
			console.log(`A user has disconnected ${socket.id}`);
		});
	});
	await listenQueue(io, connection);

	return io;
};

const listenQueue = async (server: Server, connection: amqp.Connection) => {
	const queueNames = [queueName.projectNew, queueName.projectListNew];
	const channel = await connection.createChannel();

	queueNames.map(async (queueName) => {
		await channel.assertQueue(queueName);

		await channel.consume(queueName, (payload) => {
			if (payload !== null) {
				console.log(payload.content.toString());
				server.emit("project_new", payload.content.toString());
				channel.ack(payload);
			} else {
				console.log("Consumer cancelled by server");
			}
		});
	});
};

const getChannelWithExchange = async (
	connection: amqp.Connection,
	exchangeName: string
): Promise<amqp.Channel> => {
	const channel = await connection.createChannel();
	await channel.assertExchange(exchangeName, "topic", {
		durable: true,
	});

	return channel;
};

export default setUpWebsocket;
