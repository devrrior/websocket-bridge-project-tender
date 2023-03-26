import ProjectType from "../../enums/ProjectType";

type UpdateProjectPayload = {
	name: string | null;
	description: string | null;
	budget: number | null;
	type: ProjectType | null;
	imageURL: string | null;
};

export default UpdateProjectPayload;
