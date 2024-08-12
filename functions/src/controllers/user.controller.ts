import { Request, Response } from 'express';
import axios from 'axios';
import { Project } from '../models/project.model.js';
import { z } from 'zod';
import { Experience } from '../models/experience.model.js';
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { Lead } from '../models/lead.model.js';
import { Post } from '../models/post.model.js';
import { Theme } from '../models/theme.model.js';
import { Profession } from '../models/profession.model.js';
import { User } from '../models/user.model.js';
import { Op } from 'sequelize';
import validator from 'validator';
const { isEmail } = validator;

export const allAccess = (req: Request, res: Response) => {
  res.status(200).send("Public Content.");
};

export const userBoard = (req: Request, res: Response) => {
  res.status(200).send("User Content.");
};

export const adminBoard = (req: Request, res: Response) => {
  res.status(200).send("Admin Content.");
};

const toTitle = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

export const CreateLeadSchema = z.object({
  name: z
    .string()
    .min(1, "Campo obrigatório")
    .transform((value) => toTitle(value))
    .refine((value) => value.trim().split(' ').length >= 2, {
      message: "Digite seu nome completo",
    }),

  email: z
    .string()
    .min(1, "Campo obrigatório")
    .toLowerCase()
    .refine((value) => isEmail(value), {
      message: "Digite um email válido",
    }),
  phone: z
    .string()
    .min(1, "Campo obrigatório")
    .transform((value) => value.match(/\d/g)?.join(""))
    .refine((value) => !value || isPossiblePhoneNumber("+" + value), {
      message: "Digite um telefone válido",
    }),
});
export type TCreateLead = z.infer<typeof CreateLeadSchema>;

const notSelect = (value: string | undefined) => value !== "selecione";

export const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Campo obrigatório"),

  subtitle: z
    .string()
    .trim()
    .min(1, "Campo obrigatório"),

  profession: z
    .string()
    .trim()
    .refine(notSelect, {
      message: "Campo obrigatório",
    }),

  content: z
    .string()
    .trim()
    .min(1, "Campo obrigatório"),

  existedTheme: z
    .string()
    .trim(),

  createTheme: z
    .string()
    .trim(),

  existedAuthor: z
    .string()
    .trim(),

  createAuthor: z
    .string()
    .trim(),
})
  .superRefine((data, ctx) => {
    if (data.createTheme === "" && notSelect(data.existedTheme)) {
      ctx.addIssue({
        path: ['existedTheme'],
        message: "Campo obrigatório",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.existedTheme === "selecione" && !data.createTheme) {
      ctx.addIssue({
        path: ['createTheme'],
        message: "Campo obrigatório",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.createAuthor === "" && notSelect(data.existedAuthor)) {
      ctx.addIssue({
        path: ['existedAuthor'],
        message: "Campo obrigatório",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.existedAuthor === "selecione" && !data.createAuthor) {
      ctx.addIssue({
        path: ['createAuthor'],
        message: "Campo obrigatório",
        code: z.ZodIssueCode.custom,
      });
    }
  });
export type TCreateBlog = z.infer<typeof createBlogSchema>;

export const createFormlead = async (req: Request, res: Response) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({
        status: "error",
        message: "Invalid format",
        error: "CreateFormLead-001",
      })
    }
    const schema = CreateLeadSchema;

    let {
      name,
      email,
      phone
    }: TCreateLead = schema.parse(req.body)

    name = toTitle(name.trim()).substring(0, 60);
    email = email.trim().toLowerCase().substring(0, 60);
    phone = phone?.replace(/\D/g, "").substring(0, 25);
    if (!name || !email || !phone) {
      let fields = []
      if (!name || name == "") fields.push("name");
      if (!email || !isEmail(email)) fields.push("email");
      if (!phone || phone == "") fields.push("phone");

      return res.status(400).json({
        status: "error",
        message: "Dados inválidos!",
        error: "CreateFormLead-002",
        fields
      })
    }

    const trustedDomains = [
      "https://i.imgur.com/",
      "https://github.com/",
      "https://www.youtube.com/",
      "https://barbearia-john.vercel.app/",
      "https://personal-blog-cmsn.vercel.app/"
    ];

    let isTrustedDomain = false;
    for (const domain of trustedDomains) {
      if (name.startsWith(domain) || email.startsWith(domain) || phone.startsWith(domain)) {
        isTrustedDomain = true;
        break;
      }
    }

    if (!isTrustedDomain) {
      return res.status(403).send("Access to this domain is not permitted");
    }

    const leadAlreadyExists = await Lead.findOne({
      where: {
        email: email
      },
    })

    if (leadAlreadyExists) {
      return res.status(400).json({
        status: "error",
        message: "Usuário já existe!",
        error: "CreateFormLead-003"
      });
    }

    await Lead.create({
      name,
      email,
      phone
    })

    return res.status(201).json({
      status: "success",
      message: "FormLead created successfully",
    });


  } catch (error) {
    const err = error as Error;
    if (axios.isAxiosError(err)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid URL",
        error: "CreateFormLead-004"
      });
    }
    return res.status(500).send(err.message);
  }
}

export const createPost = async (req: Request, res: Response) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({
        status: "error",
        message: "Invalid format",
        error: "CreatePost-001"
      })
    }
    const schema = createBlogSchema;

    let {
      title,
      subtitle,
      createTheme,
      existedTheme,
      existedAuthor,
      createAuthor,
      content,
      profession,
    }: TCreateBlog = schema.parse(req.body)

    title = toTitle(title?.trim() ?? "").substring(0, 100);
    subtitle = toTitle(subtitle?.trim() ?? "").substring(0, 100);
    content = (content?.trim() ?? "").substring(0, 10000);
    existedAuthor = toTitle(existedAuthor?.trim() ?? "").substring(0, 25);
    createAuthor = toTitle(createAuthor?.trim() ?? "").substring(0, 25);
    existedTheme = toTitle(existedTheme?.trim() ?? "").substring(0, 25);
    createTheme = toTitle(createTheme?.trim() ?? "").substring(0, 25);
    profession = toTitle(profession?.trim() ?? "").substring(0, 25);

    if (!title || !subtitle || !content || !existedAuthor || !profession) {
      let fields = [];
      if (!title) fields.push("title");
      if (!subtitle) fields.push("subTitle");
      if (!content) fields.push("content");
      if (!existedAuthor) fields.push("existedAuthor");
      if (!profession) fields.push("profession");
      if (createTheme === "") fields.push("existedTheme");
      if (existedTheme === "") fields.push("createTheme");

      return res.status(400).json({
        status: "error",
        message: "Dados inválidos!",
        error: "CreatePost-002",
        fields
      })
    }

    const trustedDomains = [
      "https://i.imgur.com/",
      "https://github.com/",
      "https://www.youtube.com/",
      "https://barbearia-john.vercel.app/",
      "https://personal-blog-cmsn.vercel.app/"
    ];

    let isTrustedDomain = false;
    for (const domain of trustedDomains) {
      if (title.startsWith(domain) || subtitle.startsWith(domain) || content.startsWith(domain) || existedAuthor.startsWith(domain) || profession.startsWith(domain) || createTheme.startsWith(domain) || existedTheme.startsWith(domain)) {
        isTrustedDomain = true;
        break;
      }
    }

    if (!isTrustedDomain) {
      return res.status(403).send("Access to this domain is not permitted");
    }

    // Check if the theme already exists
    const themeAlreadyExists = await Theme.findOne({
      where: { name: createTheme },
      attributes: ['id']
    });

    if (themeAlreadyExists) {
      return res.status(400).json({
        status: "error",
        message: "Theme already exists!",
        error: "CreatePost-003",
      });
    }

    // Find the theme data by existing theme
    const themeData = await Theme.findOne({
      include: {
        model: Post,
        where: { name: existedTheme },
        required: true,
        attributes: []
      },
      where: {
        [Op.not]: {
          '$Posts.id$': null
        }
      }
    });

    // Find the profession data
    const professionData = await Profession.findOne({
      where: { name: profession }
    });

    if (!professionData) {
      return res.status(404).json({
        status: "error",
        message: "Profession not found!",
        error: "CreatePost-004"
      });
    }

    // Find the author data
    const authorData = await User.findOne({
      include: {
        model: Post,
        where: { name: existedAuthor },
        required: true,
        attributes: []
      },
      where: {
        [Op.not]: {
          '$Posts.id$': null
        }
      }
    });

    // Create the post
    await Post.create({
      title,
      subtitle,
      image: "https://avatars.githubusercontent.com/u/72054311?s=400&u=93af08ef4fba8573510d1f7265840233e95bb760&v=4",
      content,
      themeId: themeData?.id,
      authorId: authorData?.id,
      professionId: professionData.id
    });

    // Create a new author if needed
    if (createAuthor) {
      await User.create({
        username: createAuthor,
        email: "",
        password: "",
        image: "https://avatars.githubusercontent.com/u/72054311?s=400&u=93af08ef4fba8573510d1f7265840233e95bb760&v=4",
      }, {
        include: [Post]
      });
    }

    // Create a new theme if needed
    if (createTheme) {
      await Theme.create({
        name: createTheme.charAt(0).toUpperCase() + createTheme.slice(1),
      }, {
        include: [Post]
      });
    }

    return res.status(201).json({
      status: "success",
      message: "post created successfully",
    });

  } catch (error) {
    const err = error as Error;
    if (axios.isAxiosError(err)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid URL",
        error: "CreatePost-005"
      });
    }
    return res.status(500).send(err.message);
  }
}

export const getPost = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    return res.json(posts)
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      // createTheme,
      // existedTheme,
      // existedAuthor,
      // createAuthor,
      content,
      // profession,
    }: TCreateBlog = req.body;

    await Post.update({
      title,
      subtitle,
      // createTheme,
      // existedTheme,
      // existedAuthor,
      // createAuthor,
      content,
      // profession,
    }, {
      where: { id }
    })

    return res.status(200).json({
      status: "success",
      message: "POst updated successfully"
    });

  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Post.destroy({
      where: { id }
    })

    return res.status(200).json({
      status: "success",
      message: "Post deleted successfully"
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message)
  }
}

export const CreateProfessions = async (req: Request, res: Response) => {
  try {
    const professions = await Profession.findAll()
    return res.json(professions)
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message)
  }
}

export const getThemes = async (req: Request, res: Response) => {
  try {
    const themes = await Theme.findAll();
    return res.json(themes)
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    const err = error as Error;
    return res.status(500).send(err.message);
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({
        status: "error",
        message: "Invalid format",
        error: "CreateProject-001"
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
        error: "CreateProject-002",
        fields
      });
    }

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

    const [image, gif, video, repo, project] = await Promise.all([
      axios.get(image_url),
      axios.get(gif_url),
      axios.get(video_url),
      axios.get(repo_url),
      axios.get(project_url)
    ]);

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
        error: "CreateProject-003"
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