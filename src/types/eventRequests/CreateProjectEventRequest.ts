import ProjectType from "../../enums/ProjectType";

type CreateProjectEventRequest = {
	name: string;
	description: string;
	budget: number;
	type: string;
	imageURL: string;
};

export default CreateProjectEventRequest;
