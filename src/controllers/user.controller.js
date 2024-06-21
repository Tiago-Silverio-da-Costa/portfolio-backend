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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperience = exports.updateExperience = exports.getExperienceById = exports.getExperiences = exports.createExperience = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = exports.ExperienceSchema = exports.ProjectSchema = exports.adminBoard = exports.userBoard = exports.allAccess = void 0;
var axios_1 = require("axios");
var project_model_1 = require("../models/project.model");
var zod_1 = require("zod");
var experience_model_1 = require("../models/experience.model");
var allAccess = function (req, res) {
    res.status(200).send("Public Content.");
};
exports.allAccess = allAccess;
var userBoard = function (req, res) {
    res.status(200).send("User Content.");
};
exports.userBoard = userBoard;
var adminBoard = function (req, res) {
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
var createProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, _a, name_1, description, programming_language, image_url, gif_url, video_url, repo_url, project_url, fields, trustedDomains, isTrustedDomain, _i, trustedDomains_1, domain, _b, image, gif, video, repo, project, error_1, err;
    var _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _l.trys.push([0, 3, , 4]);
                if (req.headers["content-type"] !== "application/json") {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Invalid format",
                            error: "CreatePost-001"
                        })];
                }
                schema = exports.ProjectSchema;
                _a = schema.parse(req.body), name_1 = _a.name, description = _a.description, programming_language = _a.programming_language, image_url = _a.image_url, gif_url = _a.gif_url, video_url = _a.video_url, repo_url = _a.repo_url, project_url = _a.project_url;
                name_1 = ((_c = name_1 === null || name_1 === void 0 ? void 0 : name_1.trim()) !== null && _c !== void 0 ? _c : "").substring(0, 100);
                description = ((_d = description === null || description === void 0 ? void 0 : description.trim()) !== null && _d !== void 0 ? _d : "").substring(0, 5000);
                programming_language = ((_e = programming_language === null || programming_language === void 0 ? void 0 : programming_language.trim()) !== null && _e !== void 0 ? _e : "").substring(0, 50);
                image_url = ((_f = image_url === null || image_url === void 0 ? void 0 : image_url.trim()) !== null && _f !== void 0 ? _f : "").substring(0, 255);
                gif_url = ((_g = gif_url === null || gif_url === void 0 ? void 0 : gif_url.trim()) !== null && _g !== void 0 ? _g : "").substring(0, 255);
                video_url = ((_h = video_url === null || video_url === void 0 ? void 0 : video_url.trim()) !== null && _h !== void 0 ? _h : "").substring(0, 255);
                repo_url = ((_j = repo_url === null || repo_url === void 0 ? void 0 : repo_url.trim()) !== null && _j !== void 0 ? _j : "").substring(0, 255);
                project_url = ((_k = project_url === null || project_url === void 0 ? void 0 : project_url.trim()) !== null && _k !== void 0 ? _k : "").substring(0, 255);
                // Validate inputs
                if (!name_1 || !description || !image_url || !gif_url || !video_url || !programming_language || !repo_url || !project_url) {
                    fields = [];
                    if (!name_1)
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
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Missing fields",
                            error: "CreatePost-002",
                            fields: fields
                        })];
                }
                trustedDomains = [
                    "https://i.imgur.com/",
                    "https://github.com/",
                    "https://www.youtube.com/",
                    "https://barbearia-john.vercel.app/",
                    "https://personal-blog-cmsn.vercel.app/"
                ];
                isTrustedDomain = false;
                for (_i = 0, trustedDomains_1 = trustedDomains; _i < trustedDomains_1.length; _i++) {
                    domain = trustedDomains_1[_i];
                    if (image_url.startsWith(domain) || gif_url.startsWith(domain) || video_url.startsWith(domain) || repo_url.startsWith(domain) || project_url.startsWith(domain)) {
                        isTrustedDomain = true;
                        break;
                    }
                }
                if (!isTrustedDomain) {
                    return [2 /*return*/, res.status(403).send("Access to this domain is not permitted")];
                }
                return [4 /*yield*/, Promise.all([
                        axios_1.default.get(image_url),
                        axios_1.default.get(gif_url),
                        axios_1.default.get(video_url),
                        axios_1.default.get(repo_url),
                        axios_1.default.get(project_url)
                    ])];
            case 1:
                _b = _l.sent(), image = _b[0], gif = _b[1], video = _b[2], repo = _b[3], project = _b[4];
                // Assuming ProjectModel is defined and sequelize instance is properly set up
                return [4 /*yield*/, project_model_1.Project.create({
                        name: name_1,
                        description: description,
                        image_url: image_url,
                        gif_url: gif_url,
                        video_url: video_url,
                        programming_language: programming_language,
                        repo_url: repo_url,
                        project_url: project_url
                    })];
            case 2:
                // Assuming ProjectModel is defined and sequelize instance is properly set up
                _l.sent();
                return [2 /*return*/, res.status(201).json({
                        status: "success",
                        message: "Project created successfully",
                        response: "urls uploaded successfully",
                        image: image.data,
                        gif: gif.data,
                        video: video.data,
                        repo: repo.data,
                        project: project.data
                    })];
            case 3:
                error_1 = _l.sent();
                err = error_1;
                if (axios_1.default.isAxiosError(err)) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Invalid URL",
                            error: "CreatePost-003"
                        })];
                }
                return [2 /*return*/, res.status(500).send(err.message)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createProject = createProject;
var getProjects = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projects, error_2, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, project_model_1.Project.findAll()];
            case 1:
                projects = _a.sent();
                return [2 /*return*/, res.json(projects)];
            case 2:
                error_2 = _a.sent();
                err = error_2;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProjects = getProjects;
var getProjectById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, project, error_3, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, project_model_1.Project.findByPk(id)];
            case 1:
                project = _a.sent();
                if (!project) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Project not found",
                            error: "GetPost-001"
                        })];
                }
                return [2 /*return*/, res.json(project)];
            case 2:
                error_3 = _a.sent();
                err = error_3;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProjectById = getProjectById;
var updateProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, description, image_url, gif_url, video_url, programming_language, repo_url, project_url, error_4, err;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name_2 = _a.name, description = _a.description, image_url = _a.image_url, gif_url = _a.gif_url, video_url = _a.video_url, programming_language = _a.programming_language, repo_url = _a.repo_url, project_url = _a.project_url;
                return [4 /*yield*/, project_model_1.Project.update({
                        name: name_2,
                        description: description,
                        image_url: image_url,
                        gif_url: gif_url,
                        video_url: video_url,
                        programming_language: programming_language,
                        repo_url: repo_url,
                        project_url: project_url
                    }, {
                        where: { id: id }
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Project updated successfully"
                    })];
            case 2:
                error_4 = _b.sent();
                err = error_4;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateProject = updateProject;
var deleteProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, project_model_1.Project.destroy({
                        where: { id: id }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Project deleted successfully"
                    })];
            case 2:
                error_5 = _a.sent();
                err = error_5;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteProject = deleteProject;
// EXPERIENCE
var createExperience = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, company, description, init_time, final_time, fields, error_6, err;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 2, , 3]);
                if (req.headers["content-type"] !== "application/json") {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Invalid format",
                            error: "CreateXp-001"
                        })];
                }
                _a = req.body, company = _a.company, description = _a.description, init_time = _a.init_time, final_time = _a.final_time;
                company = ((_b = company === null || company === void 0 ? void 0 : company.trim()) !== null && _b !== void 0 ? _b : "").substring(0, 100);
                description = ((_c = description === null || description === void 0 ? void 0 : description.trim()) !== null && _c !== void 0 ? _c : "").substring(0, 5000);
                init_time = ((_d = init_time === null || init_time === void 0 ? void 0 : init_time.trim()) !== null && _d !== void 0 ? _d : "").substring(0, 25);
                final_time = ((_e = final_time === null || final_time === void 0 ? void 0 : final_time.trim()) !== null && _e !== void 0 ? _e : "").substring(0, 25);
                if (!company || !description || !init_time || !final_time) {
                    fields = [];
                    if (!company)
                        fields.push("company");
                    if (!description)
                        fields.push("description");
                    if (!init_time)
                        fields.push("init_time");
                    if (!final_time)
                        fields.push("final_time");
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Missing fields",
                            error: "CreateXp-002",
                            fields: fields
                        })];
                }
                return [4 /*yield*/, experience_model_1.Experience.create({
                        company: company,
                        description: description,
                        init_time: init_time,
                        final_time: final_time
                    })];
            case 1:
                _f.sent();
                return [2 /*return*/, res.status(201).json({
                        status: "success",
                        message: "Experience created successfully"
                    })];
            case 2:
                error_6 = _f.sent();
                err = error_6;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createExperience = createExperience;
var getExperiences = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var experiences, error_7, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, experience_model_1.Experience.findAll()];
            case 1:
                experiences = _a.sent();
                return [2 /*return*/, res.json(experiences)];
            case 2:
                error_7 = _a.sent();
                err = error_7;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getExperiences = getExperiences;
var getExperienceById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, experience, error_8, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, experience_model_1.Experience.findByPk(id)];
            case 1:
                experience = _a.sent();
                if (!experience) {
                    return [2 /*return*/, res.status(400).json({
                            status: "error",
                            message: "Experience not found",
                            error: "GetPost-001"
                        })];
                }
                return [2 /*return*/, res.json(experience)];
            case 2:
                error_8 = _a.sent();
                err = error_8;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getExperienceById = getExperienceById;
var updateExperience = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, company, description, init_time, final_time, error_9, err;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, company = _a.company, description = _a.description, init_time = _a.init_time, final_time = _a.final_time;
                return [4 /*yield*/, experience_model_1.Experience.update({
                        company: company,
                        description: description,
                        init_time: init_time,
                        final_time: final_time
                    }, {
                        where: { id: id }
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Experience updated successfully"
                    })];
            case 2:
                error_9 = _b.sent();
                err = error_9;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateExperience = updateExperience;
var deleteExperience = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_10, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, experience_model_1.Experience.destroy({
                        where: { id: id }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        status: "success",
                        message: "Experience deleted successfully"
                    })];
            case 2:
                error_10 = _a.sent();
                err = error_10;
                return [2 /*return*/, res.status(500).send(err.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteExperience = deleteExperience;
