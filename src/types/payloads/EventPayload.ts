import CreateProjectPayload from "./CreateProjectPayload";
import CreateUserPayload from "./CreateUserPayload";
import GetProjectPayload from "./GetProjectPayload";
import GetProjectListPayload from "./GetProjectListPayload";
import UpdateProjectPayload from "./UpdateProjectPayload";

type EventPayload =
	| GetProjectPayload
	| GetProjectListPayload
	| CreateProjectPayload
	| CreateUserPayload
	| UpdateProjectPayload;

export default EventPayload;
