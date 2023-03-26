import ProjectType from "../../enums/ProjectType";

type CreateProjectEventRequest = {
	name: string;
	description: string;
	budget: number;
	type: ProjectType;
	imageURL: string;
};

export default CreateProjectEventRequest;
