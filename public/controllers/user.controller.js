"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperience = exports.updateExperience = exports.getExperienceById = exports.getExperiences = exports.createExperience = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = exports.ExperienceSchema = exports.ProjectSchema = exports.adminBoard = exports.userBoard = exports.allAccess = void 0;
const axios_1 = __importDefault(require("axios"));
const project_model_1 = require("../models/project.model");
const zod_1 = require("zod");
const experience_model_1 = require("../models/experience.model");
const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.allAccess = allAccess;
const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.userBoard = userBoard;
const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
exports.adminBoard = adminBoard;
exports.ProjectSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    image_url: zod_1.z.string().url().startsWith("https://"),
    gif_url: zod_1.z.string().url().startsWith("https://"),
    video_url: zod_1.z.string().url().startsWith("https://"),
    programming_language: zod_1.z.string(),
    repo_url: zod_1.z.string().url().startsWith("https://"),
    project_url: zod_1.z.string().url().startsWith("https://")
});
exports.ExperienceSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    company: zod_1.z.string().min(1, { message: "Required Field" }),
    description: zod_1.z.string().min(1, { message: "Required Field" }),
    init_time: zod_1.z.string().min(1, { message: "Required Field" }),
    final_time: zod_1.z.string().min(1, { message: "Required Field" }),
});
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        if (req.headers["content-type"] !== "application/json") {
            return res.status(400).json({
                status: "error",
                message: "Invalid format",
                error: "CreatePost-001"
            });
        }
        const schema = exports.ProjectSchema;
        let { name, description, programming_language, image_url, gif_url, video_url, repo_url, project_url } = schema.parse(req.body);
        name = ((_a = name === null || name === void 0 ? void 0 : name.trim()) !== null && _a !== void 0 ? _a : "").substring(0, 100);
        description = ((_b = description === null || description === void 0 ? void 0 : description.trim()) !== null && _b !== void 0 ? _b : "").substring(0, 5000);
        programming_language = ((_c = programming_language === null || programming_language === void 0 ? void 0 : programming_language.trim()) !== null && _c !== void 0 ? _c : "").substring(0, 50);
        image_url = ((_d = image_url === null || image_url === void 0 ? void 0 : image_url.trim()) !== null && _d !== void 0 ? _d : "").substring(0, 255);
        gif_url = ((_e = gif_url === null || gif_url === void 0 ? void 0 : gif_url.trim()) !== null && _e !== void 0 ? _e : "").substring(0, 255);
        video_url = ((_f = video_url === null || video_url === void 0 ? void 0 : video_url.trim()) !== null && _f !== void 0 ? _f : "").substring(0, 255);
        repo_url = ((_g = repo_url === null || repo_url === void 0 ? void 0 : repo_url.trim()) !== null && _g !== void 0 ? _g : "").substring(0, 255);
        project_url = ((_h = project_url === null || project_url === void 0 ? void 0 : project_url.trim()) !== null && _h !== void 0 ? _h : "").substring(0, 255);
        // Validate inputs
        if (!name || !description || !image_url || !gif_url || !video_url || !programming_language || !repo_url || !project_url) {
            let fields = [];
            if (!name)
                fields.push("name");
            if (!description)
                fields.push("description");
            if (!image_url)
                fields.push("image_url");
            if (!gif_url)
                fields.push("gif_url");
            if (!video_url)
                fields.push("video_url");
            if (!programming_language)
                fields.push("programming_language");
            if (!repo_url)
                fields.push("repo_url");
            if (!project_url)
                fields.push("project_url");
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
        const [image, gif, video, repo, project] = yield Promise.all([
            axios_1.default.get(image_url),
            axios_1.default.get(gif_url),
            axios_1.default.get(video_url),
            axios_1.default.get(repo_url),
            axios_1.default.get(project_url)
        ]);
        // Assuming ProjectModel is defined and sequelize instance is properly set up
        yield project_model_1.Project.create({
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
    }
    catch (error) {
        const err = error;
        if (axios_1.default.isAxiosError(err)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid URL",
                error: "CreatePost-003"
            });
        }
        return res.status(500).send(err.message);
    }
});
exports.createProject = createProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield project_model_1.Project.findAll();
        return res.json(projects);
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.getProjects = getProjects;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const project = yield project_model_1.Project.findByPk(id);
        if (!project) {
            return res.status(400).json({
                status: "error",
                message: "Project not found",
                error: "GetPost-001"
            });
        }
        return res.json(project);
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.getProjectById = getProjectById;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, image_url, gif_url, video_url, programming_language, repo_url, project_url } = req.body;
        yield project_model_1.Project.update({
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
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield project_model_1.Project.destroy({
            where: { id }
        });
        return res.status(200).json({
            status: "success",
            message: "Project deleted successfully"
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.deleteProject = deleteProject;
// EXPERIENCE
const createExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (req.headers["content-type"] !== "application/json") {
            return res.status(400).json({
                status: "error",
                message: "Invalid format",
                error: "CreateXp-001"
            });
        }
        let { company, description, init_time, final_time } = req.body;
        company = ((_a = company === null || company === void 0 ? void 0 : company.trim()) !== null && _a !== void 0 ? _a : "").substring(0, 100);
        description = ((_b = description === null || description === void 0 ? void 0 : description.trim()) !== null && _b !== void 0 ? _b : "").substring(0, 5000);
        init_time = ((_c = init_time === null || init_time === void 0 ? void 0 : init_time.trim()) !== null && _c !== void 0 ? _c : "").substring(0, 25);
        final_time = ((_d = final_time === null || final_time === void 0 ? void 0 : final_time.trim()) !== null && _d !== void 0 ? _d : "").substring(0, 25);
        if (!company || !description || !init_time || !final_time) {
            let fields = [];
            if (!company)
                fields.push("company");
            if (!description)
                fields.push("description");
            if (!init_time)
                fields.push("init_time");
            if (!final_time)
                fields.push("final_time");
            return res.status(400).json({
                status: "error",
                message: "Missing fields",
                error: "CreateXp-002",
                fields
            });
        }
        yield experience_model_1.Experience.create({
            company,
            description,
            init_time,
            final_time
        });
        return res.status(201).json({
            status: "success",
            message: "Experience created successfully"
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.createExperience = createExperience;
const getExperiences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experiences = yield experience_model_1.Experience.findAll();
        return res.json(experiences);
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.getExperiences = getExperiences;
const getExperienceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const experience = yield experience_model_1.Experience.findByPk(id);
        if (!experience) {
            return res.status(400).json({
                status: "error",
                message: "Experience not found",
                error: "GetPost-001"
            });
        }
        return res.json(experience);
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.getExperienceById = getExperienceById;
const updateExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { company, description, init_time, final_time } = req.body;
        yield experience_model_1.Experience.update({
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
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.updateExperience = updateExperience;
const deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield experience_model_1.Experience.destroy({
            where: { id }
        });
        return res.status(200).json({
            status: "success",
            message: "Experience deleted successfully"
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).send(err.message);
    }
});
exports.deleteExperience = deleteExperience;
