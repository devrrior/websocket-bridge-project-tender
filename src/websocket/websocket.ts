import amqp from "amqplib";
import { Server, Socket } from "socket.io";

import config from "../config";
import QueueName from "../enums/QueueName";
import WebsocketEvent from "../enums/WebsocketEvent";
import { connect } from "../rabbitmq";
import {
	createProjectEventService,
	getProjectEventService,
	getProjectListEventService,
	newProjectEventService,
	newProjectListEvent,
	updateProjectEventService,
} from "../services/eventServices/projectEventService";
import {
	createUserEventService,
	newUserEventService,
} from "../services/eventServices/userEventService";
import CreateProjectEventRequest from "../types/eventRequests/CreateProjectEventRequest";
import CreateUserEventRequest from "../types/eventRequests/CreateUserEventRequest";
import GetProjectEventRequest from "../types/eventRequests/GetProjectEventRequest";
import GetProjectListEventRequest from "../types/eventRequests/GetProjectListEventRequest";
import UpdateProjectEventRequest from "../types/eventRequests/UpdateProjectEventRequest";
import { verifyJWT } from "../services/restServices/authService";

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
		const jwt = socket.handshake.query.token as string;

		const email = verifyJWT(jwt);

		if (!email) return socket.disconnect();

		socket.on(
			WebsocketEvent.getProject,
			(eventRequest: GetProjectEventRequest) => {
				getProjectEventService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.getProjectList,
			(eventRequest: GetProjectListEventRequest) => {
				getProjectListEventService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.createUser,
			(eventRequest: CreateUserEventRequest) => {
				createUserEventService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.createProject,
			(eventRequest: CreateProjectEventRequest) => {
				createProjectEventService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.updateProject,
			(eventPayload: UpdateProjectEventRequest) => {
				updateProjectEventService(channelSender, eventPayload);
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
	const queues = {
		[QueueName.newProject]: newProjectEventService,
		[QueueName.newProjectList]: newProjectListEvent,
		[QueueName.newUser]: newUserEventService,
	};
	const channel = await connection.createChannel();

	Object.entries(queues).map(async ([name, fn]) => {
		await channel.assertQueue(name);

		await channel.consume(name, (payload) => {
			if (payload !== null) {
				const parsedPayload = payload.content.toString();
				fn(parsedPayload, server);
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
