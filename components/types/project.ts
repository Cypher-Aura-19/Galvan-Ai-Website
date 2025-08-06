export interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    year: string;
    demoUrl?: string;
    githubUrl?: string;
  }