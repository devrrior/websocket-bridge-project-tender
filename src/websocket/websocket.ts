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
	currentUserEventService,
	newUserEventService,
} from "../services/eventServices/userEventService";
import { verifyJWT } from "../services/restServices/authService";
import CreateProjectEventRequest from "../types/eventRequests/CreateProjectEventRequest";
import CreateUserEventRequest from "../types/eventRequests/CreateUserEventRequest";
import GetProjectEventRequest from "../types/eventRequests/GetProjectEventRequest";
import GetProjectListEventRequest from "../types/eventRequests/GetProjectListEventRequest";
import UpdateProjectEventRequest from "../types/eventRequests/UpdateProjectEventRequest";

const users = new Set();

const setUpWebsocket = async () => {
	const io = new Server({
		cors: {
			origin: "*",
		},
	});
	const connection = await connect(
		config.projectTenderExchangeURL,
		config.rabbitMQUser,
		config.rabbitMQPassword
	);

	const channelSender = await getChannelWithExchange(connection);

	io.on("connection", async (socket: Socket) => {
		if (users.size > 5) socket.disconnect();
		else users.add(socket.id);

		console.log(`User with ID ${socket.id} has connected`);
		const jwt = socket.handshake.query.token as string;
		console.log(jwt);

		socket.on(
			WebsocketEvent.getProject,
			(eventRequest: GetProjectEventRequest) => {
				const email = verifyJWT(jwt);

				if (!email) return socket.disconnect();

				getProjectEventService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.getProjectList,
			(eventRequest: GetProjectListEventRequest) => {
				const email = verifyJWT(jwt);

				if (!email) return socket.disconnect();

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
				const email = verifyJWT(jwt);

				if (!email) return socket.disconnect();

				createProjectEventService(channelSender, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.updateProject,
			(eventPayload: UpdateProjectEventRequest) => {
				const email = verifyJWT(jwt);

				if (!email) return socket.disconnect();

				updateProjectEventService(channelSender, eventPayload);
				console.log("Event sent!");
			}
		);

		socket.on("disconnect", () => {
			users.delete(socket.id);
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
		[QueueName.currentUser]: currentUserEventService,
	};
	const channel = await connection.createChannel();

	Object.entries(queues).map(async ([name, fn]) => {
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
	connection: amqp.Connection
): Promise<amqp.Channel> => {
	return await connection.createChannel();
};

export default setUpWebsocket;
