import express from "express"
import cors from "cors"
import pool from './db/db';
import axios from "axios"
import zod from "zod"

const app = express();
const port = 4000;

const ProjectSchema = zod.object({
    name: zod.string(),
    description: zod.string(),
    image_url: zod.string().url().startsWith("https://"),
    gif_url: zod.string().url().startsWith("https://"),
    video_url: zod.string().url().startsWith("https://"),
    programming_language: zod.string(),
    repo_url: zod.string().url().startsWith("https://"),
    project_url: zod.string().url().startsWith("https://")
})
type TCreateProject = zod.infer<typeof ProjectSchema>

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

pool.query("CREATE TABLE IF NOT EXISTS project (id SERIAL PRIMARY KEY, name TEXT, description TEXT, image_url TEXT, gif_url TEXT, video_url TEXT, programming_language TEXT, repo_url TEXT, project_url TEXT)")
pool.query("CREATE TABLE IF NOT EXISTS experience (id SERIAL PRIMARY KEY, company TEXT, description TEXT, init_time TEXT, final_time TEXT)")

// PROJECTS

app.post("/createproject", async (req, res) => {
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
        image_url = (image_url?.trim() ?? "").substring(0, 200);
        gif_url = (gif_url?.trim() ?? "").substring(0, 200);
        video_url = (video_url?.trim() ?? "").substring(0, 200);
        programming_language = (programming_language?.trim() ?? "").substring(0, 200);
        repo_url = (repo_url?.trim() ?? "").substring(0, 200);
        project_url = (project_url?.trim() ?? "").substring(0, 200);

        const trustedDomains = [
            "https://i.imgur.com/",
            "https://github.com/",
            "https://www.youtube.com/",
            "https://barbearia-john.vercel.app/",
            "https://personal-blog-cmsn.vercel.app/"
        ]

        let isTrustedDomain = false;

        for (const domain of trustedDomains) {
            if (image_url.startsWith(domain) || gif_url.startsWith(domain) || video_url.startsWith(domain) || repo_url.startsWith(domain) || project_url.startsWith(domain)) {
                isTrustedDomain = true;
                break;
            }
        }

        if (!isTrustedDomain) {
            return res.status(403).send("Access to this domain is not permitted")
        }

        if (!name || !description || !image_url || !gif_url || !video_url || !programming_language || !repo_url || !project_url) {
            let fields: string[] = [];
            if (!name) fields.push("name")
            if (!description) fields.push("description")
            if (!image_url) fields.push("image_url")
            if (!gif_url) fields.push("gif_url")
            if (!video_url) fields.push("video_url")
            if (!programming_language) fields.push("programming_language")
            if (!repo_url) fields.push("repo_url")
            if (!project_url) fields.push("project_url")

            return res.status(400).json({
                status: "error",
                message: "Missing fields",
                error: "CreatePost-002",
                fields
            })
        }

        const image = await axios.get(image_url);
        const gif = await axios.get(gif_url);
        const video = await axios.get(video_url);
        const repo = await axios.get(repo_url);
        const project = await axios.get(project_url);

        await pool.query("INSERT INTO project (name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url]);

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
        if (axios.isAxiosError(error)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid URL",
                error: "CreatePost-003"
            })
        }

        return res.status(500).send("Something went wrong");
    }
})

app.get("/getprojects", async (req, res) => {
    try {
        const projects = await pool.query("SELECT * FROM project");
        return res.json(projects.rows);
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
});

app.get("/getproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await pool.query("SELECT * FROM project WHERE id = $1", [id]);

        if (project.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Project not found",
                error: "GetPost-001"
            })
        }

        return res.json(project.rows[0]);
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})


app.put("/updateproject/:id", async (req, res) => {
    try {
        type TCreateProject = {
            name: string,
            description: string,
            image_url: string,
            gif_url: string,
            video_url: string,
            programming_language: string,
            repo_url: string,
            project_url: string
        }

        const { id } = req.params;
        const { name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url }: TCreateProject = req.body;

        const project = await pool.query("SELECT * FROM project WHERE id = $1", [id]);

        if (project.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Project not found",
                error: "UpdatePost-001"
            })
        }

        await pool.query("UPDATE project SET name = $1, description = $2, image_url = $3, gif_url = $4, video_url = $5, programming_language = $6, repo_url = $7, project_url = $8 WHERE id = $9", [name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url, id]);

        return res.json({
            status: "success",
            message: "Project updated successfully"
        })
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})


app.delete("/deleteproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await pool.query("DELETE FROM project WHERE id = $1", [id]);

        if (project.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Project not found",
                error: "DeleteProject-001"
            })
        }

        return res.json({
            status: "success",
            message: "Project deleted successfully"
        })
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

// EXPERIENCE

app.post("/createxp", async (req, res) => {
    try {
        if (req.headers["content-type"] !== "application/json") {
            return res.status(400).json({
                status: "error",
                message: "Invalid format",
                error: "CreateXp-001"
            })
        }

        type TCreateXP = {
            company: string,
            description: string,
            init_time: string,
            final_time: string,
        }

        let {
            company,
            description,
            init_time,
            final_time
        }: TCreateXP = req.body;

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

        await pool.query("INSERT INTO experience (company, description, init_time, final_time) VALUES ($1, $2, $3, $4)", [company, description, init_time, final_time]);

        return res.status(201).json({
            status: 'success',
            message: 'Experience created successfully'
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})

app.get("/getxps", async (req, res) => {
    try {
        const experiences = await pool.query("SELECT * FROM experience")
        return res.json(experiences.rows)
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

app.get("/getxp/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await pool.query("SELECT * FROM experience WHERE id = $1", [id]);

        if (experience.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Experience not found",
                error: "GetExperience-001"
            })
        }

        return res.json(experience.rows[0])
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

app.put("/updatexp/:id", async (req, res) => {
    try {

        type TCreateXP = {
            company: string,
            description: string,
            init_time: string,
            final_time: string,
        }

        const { id } = req.params;
        const { company, description, init_time, final_time }: TCreateXP = req.body;

        const experience = await pool.query("SELECT * FROM experience WHERE id = $1", [id])

        if (experience.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Experience not found",
                error: "UpdateXp-001"
            })
        }

        await pool.query("UPDATE experience SET company = $1, description = $2, init_time = $3, final_time = $4 WHERE id = $5", [company, description, init_time, final_time, id]);

        return res.json({
            status: "success",
            message: "Experience updated successfully"
        })
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

app.delete("/deletexp/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await pool.query("DELETE FROM experience WHERE id = $1", [id]);

        if (experience.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Experience not found",
                error: "DeleteXp-001"
            })
        }

        return res.json({
            status: "success",
            message: "Experience deleted successfully"
        })
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export default app;
