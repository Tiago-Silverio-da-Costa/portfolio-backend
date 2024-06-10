import express from "express"
import cors from "cors"
import pool from './db/db';
import axios from "axios"
import { toTitle } from "./utils/utils";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

pool.query("CREATE TABLE IF NOT EXISTS project (id SERIAL PRIMARY KEY, name TEXT, description TEXT, image_url TEXT, gif_url TEXT, video_url TEXT, programming_language TEXT, repo_url TEXT, project_url TEXT)")
pool.query("CREATE TABLE IF NOT EXISTS experience (id SERIAL PRIMARY KEY, company TEXT, description TEXT, charge TEXT, init_time TEXT, final_time TEXT)")

app.post("/createproject", async (req, res) => {
    try {
        if (req.headers["content-type"] !== "application/json") {
            return res.status(400).json({
                status: "error",
                message: "Invalid format",
                error: "CreatePost-001"
            })
        }

        type TCreatePost = {
            name: string,
            description: string,
            image_url: string,
            gif_url: string,
            video_url: string,
            programming_language: string,
            repo_url: string,
            project_url: string
        }

        let {
            name,
            description,
            programming_language,
            image_url,
            gif_url,
            video_url,
            repo_url,
            project_url
        }: TCreatePost = req.body;

        name = (name?.trim() ?? "").substring(0, 100);
        description = (description?.trim() ?? "").substring(0, 5000);
        image_url = (image_url?.trim() ?? "").substring(0, 200);
        gif_url = (gif_url?.trim() ?? "").substring(0, 200);
        video_url = (video_url?.trim() ?? "").substring(0, 200);
        programming_language = (programming_language?.trim() ?? "").substring(0, 200);
        repo_url = (repo_url?.trim() ?? "").substring(0, 200);
        project_url = (project_url?.trim() ?? "").substring(0, 200);

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

        // const image = await axios.get(image_url);
        // const gif = await axios.get(gif_url);
        // const video = await axios.get(video_url);
        // const repo = await axios.get(repo_url);
        // const project = await axios.get(project_url);

        await pool.query("INSERT INTO project (name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url]);

        // res.json({
        //     response: "urls uploaded successfully",
        //     image: image.data,
        //     gif: gif.data,
        //     video: video.data,
        //     repo: repo.data,
        //     project: project.data
        // });


        return res.status(201).json({
            status: "success",
            message: "Project created successfully"
        })


    } catch (error) {
        if (axios.isAxiosError(error)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid URL",
                error: "CreatePost-003"
            })
        }

        res.status(500).send("Something went wrong");
    }
})

app.get("/getprojects", async (req, res) => {
    try {
        const projects = await pool.query("SELECT * FROM project");
        res.json(projects.rows);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

app.put("/updateproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url } = req.body;

        const project = await pool.query("SELECT * FROM project WHERE id = $1", [id]);

        if (project.rowCount === 0) {
            return res.status(400).json({
                status: "error",
                message: "Project not found",
                error: "UpdatePost-001"
            })
        }

        await pool.query("UPDATE project SET name = $1, description = $2, image_url = $3, gif_url = $4, video_url = $5, programming_language = $6, repo_url = $7, project_url = $8 WHERE id = $9", [name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url, id]);

        res.json({
            status: "success",
            message: "Project updated successfully"
        })
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})

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

        res.json(project.rows[0]);
    } catch (error) {
        res.status(500).send("Something went wrong");
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
                error: "DeletePost-001"
            })
        }

        res.json({
            status: "success",
            message: "Project deleted successfully"
        })
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export default app;
