import ProjectType from "../../enums/ProjectType";

type CreateProjectPayload = {
	name: string;
	description: string;
	budget: number;
	type: string;
	imageURL: string;
};

export default CreateProjectPayload;
