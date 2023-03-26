import ProjectType from "../../enums/ProjectType";

type UpdateProjectEventRequest = {
	name: string | null;
	description: string | null;
	budget: number | null;
	type: ProjectType | null;
	imageURL: string | null;
};

export default UpdateProjectEventRequest;
