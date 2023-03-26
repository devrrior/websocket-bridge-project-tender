import { Server } from "socket.io";

import config from "../config";
import WebsocketEvent from "../enums/WebsocketEvent";
import { connect } from "../rabbitmq";
import createProjectService from "./services/createProjectService";
import createUserService from "./services/createUserService";
import getProjectListService from "./services/getProjectListService";
import getProjectService from "./services/getProjectService";
import updateProjectService from "./services/updateProjectService";
import CreateProjectEventRequest from "../types/eventRequests/CreateProjectEventRequest";
import CreateUserEventRequest from "../types/eventRequests/CreateUserEventRequest";
import GetProjectEventRequest from "../types/eventRequests/GetProjectEventRequest";
import GetProjectListEventRequest from "../types/eventRequests/GetProjectListEventRequest";
import UpdateProjectEventRequest from "../types/eventRequests/UpdateProjectEventRequest";

const setUpWebsocket = async () => {
	const io = new Server();
	const { channel } = await connect(
		config.projectTenderExchangeURL,
		config.projectTenderExchange
	);

	io.on("connection", (socket) => {
		console.log(`User with ID ${socket.id} has connected`);

		socket.on(
			WebsocketEvent.getProject,
			(eventRequest: GetProjectEventRequest) => {
				getProjectService(channel, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.getProjectList,
			(eventRequest: GetProjectListEventRequest) => {
				getProjectListService(channel, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.createUser,
			(eventRequest: CreateUserEventRequest) => {
				createUserService(channel, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.createProject,
			(eventRequest: CreateProjectEventRequest) => {
				createProjectService(channel, eventRequest);
				console.log("Event sent!");
			}
		);

		socket.on(
			WebsocketEvent.updateProject,
			(eventPayload: UpdateProjectEventRequest) => {
				updateProjectService(channel, eventPayload);
				console.log("Event sent!");
			}
		);

		socket.on("disconnect", () => {
			console.log(`A user has disconnected ${socket.id}`);
		});
	});

	return io;
};

export default setUpWebsocket;
