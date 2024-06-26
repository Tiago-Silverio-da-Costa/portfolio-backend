import { Request, Response } from 'express';
import axios from 'axios';
import { Project } from '../models/project.model';
import { z } from 'zod';
import { Experience } from '../models/experience.model';

export const allAccess = (req: Request, res: Response) => {
  res.status(200).send("Public Content.");
};

export const userBoard = (req: Request, res: Response) => {
  res.status(200).send("User Content.");
};

export const adminBoard = (req: Request, res: Response) => {
  res.status(200).send("Admin Content.");
};

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  image_url: z.string().url().startsWith("https://"),
  gif_url: z.string().url().startsWith("https://"),
  video_url: z.string().url().startsWith("https://"),
  programming_language: z.string(),
  repo_url: z.string().url().startsWith("https://"),
  project_url: z.string().url().startsWith("https://")
});
export type TCreateProject = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = z.object({
  id: z.number().optional(),
  company: z.string().min(1, { message: "Required Field" }),
  description: z.string().min(1, { message: "Required Field" }),
  init_time: z.string().min(1, { message: "Required Field" }),
  final_time: z.string().min(1, { message: "Required Field" }),
})
export type TCreateExperience = z.TypeOf<typeof ExperienceSchema>


export const createProject = async (req: Request, res: Response) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({
        status: "error",
        message: "Invalid format",
        error: "CreatePost-001"
      })
    }
    const schema = ProjectSchema;

    let {
      name,
      description,
      programming_language,
      image_url,
      gif_url,
      video_url,
      repo_url,
      project_url
    }: TCreateProject = schema.parse(req.body);

    name = (name?.trim() ?? "").substring(0, 100);
    description = (description?.trim() ?? "").substring(0, 5000);
    programming_language = (programming_language?.trim() ?? "").substring(0, 50);
    image_url = (image_url?.trim() ?? "").substring(0, 255);
    gif_url = (gif_url?.trim() ?? "").substring(0, 255);
    video_url = (video_url?.trim() ?? "").substring(0, 255);
    repo_url = (repo_url?.trim() ?? "").substring(0, 255);
    project_url = (project_url?.trim() ?? "").substring(0, 255);

    // Validate inputs
    if (!name || !description || !image_url || !gif_url || !video_url || !programming_language || !repo_url || !project_url) {
      let fields: string[] = [];
      if (!name) fields.push("name");
      if (!description) fields.push("description");
      if (!image_url) fields.push("image_url");
      if (!gif_url) fields.push("gif_url");
      if (!video_url) fields.push("video_url");
      if (!programming_language) fields.push("programming_language");
      if (!repo_url) fields.push("repo_url");
      if (!project_url) fields.push("project_url");



      return res.status(400).json({
        status: "error",
        message: "Missing fields",
        error: "CreatePost-002",
        fields
      });
    }

    // Validate URLs against trusted domains
    const trustedDomains = [
      "https://i.imgur.com/",
      "https://github.com/",
      "https://www.youtube.com/",
      "https://barbearia-john.vercel.app/",
      "https://personal-blog-cmsn.vercel.app/"
    ];

    let isTrustedDomain = false;
    for (const domain of trustedDomains) {
      if (image_url.startsWith(domain) || gif_url.startsWith(domain) || video_url.startsWith(domain) || repo_url.startsWith(domain) || project_url.startsWith(domain)) {
        isTrustedDomain = true;
        break;
      }
    }

    if (!isTrustedDomain) {
      return res.status(403).send("Access to this domain is not permitted");
    }

    // Example of axios usage to fetch data from URLs
    const [image, gif, video, repo, project] = await Promise.all([
      axios.get(image_url),
      axios.get(gif_url),
      axios.get(video_url),
      axios.get(repo_url),
      axios.get(project_url)
    ]);

    // Assuming ProjectModel is defined and sequelize instance is properly set up
    await Project.create({
      name,
      description,
      image_url,
      gif_url,
      video_url,
      programming_language,
      repo_url,
      project_url
    });

    return res.status(201).json({
      status: "success",
      message: "Project created successfully",
      response: "urls uploaded successfully",
      image: image.data,
      gif: gif.data,
      video: video.data,
      repo: repo.data,
      project: project.data
    });

  } catch (error) {
    const err = error as Error;
    if (axios.isAxiosError(err)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid URL",
        error: "CreatePost-003"
      });
    }

    return res.status(500).send(err.message);
  }
}

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll();
    return res.json(projects);
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(400).json({
        status: "error",
        message: "Project not found",
        error: "GetPost-001"
      });
    }

    return res.json(project);
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url }: TCreateProject = req.body;

    await Project.update({
      name,
      description,
      image_url,
      gif_url,
      video_url,
      programming_language,
      repo_url,
      project_url
    }, {
      where: { id }
    });

    return res.status(200).json({
      status: "success",
      message: "Project updated successfully"
    });

  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Project.destroy({
      where: { id }
    });

    return res.status(200).json({
      status: "success",
      message: "Project deleted successfully"
    });

  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

// EXPERIENCE

export const createExperience = async (req: Request, res: Response) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({
        status: "error",
        message: "Invalid format",
        error: "CreateXp-001"
      })
    }
    let {
      company,
      description,
      init_time,
      final_time
    }: TCreateExperience = req.body;

    company = (company?.trim() ?? "").substring(0, 100);
    description = (description?.trim() ?? "").substring(0, 5000);
    init_time = (init_time?.trim() ?? "").substring(0, 25);
    final_time = (final_time?.trim() ?? "").substring(0, 25);

    if (!company || !description || !init_time || !final_time) {
      let fields: string[] = [];
      if (!company) fields.push("company")
      if (!description) fields.push("description")
      if (!init_time) fields.push("init_time")
      if (!final_time) fields.push("final_time")

      return res.status(400).json({
        status: "error",
        message: "Missing fields",
        error: "CreateXp-002",
        fields
      })
    }

    await Experience.create({
      company,
      description,
      init_time,
      final_time
    });

    return res.status(201).json({
      status: "success",
      message: "Experience created successfully"
    });

  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.findAll();
    return res.json(experiences);
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByPk(id);

    if (!experience) {
      return res.status(400).json({
        status: "error",
        message: "Experience not found",
        error: "GetPost-001"
      });
    }

    return res.json(experience);
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company, description, init_time, final_time }: TCreateExperience = req.body;

    await Experience.update({
      company,
      description,
      init_time,
      final_time
    }, {
      where: { id }
    });

    return res.status(200).json({
      status: "success",
      message: "Experience updated successfully"
    });

  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Experience.destroy({
      where: { id }
    });

    return res.status(200).json({
      status: "success",
      message: "Experience deleted successfully"
    });

  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}