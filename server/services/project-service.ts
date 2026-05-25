import { ProjectRepository } from "@/server/repositories/project-repository";

const projectRepository = new ProjectRepository();

export function listProjects() {
  return projectRepository.listProjects();
}

export function getProject(projectId: string) {
  return projectRepository.getProject(projectId);
}

export function listProjectRuns(projectId: string) {
  return projectRepository.listRuns(projectId);
}

export function createProject(input: {
  prompt: string;
  templateType: string;
  amount: string;
  currency: string;
  unitLabel: string;
}) {
  return projectRepository.createProject(input);
}
