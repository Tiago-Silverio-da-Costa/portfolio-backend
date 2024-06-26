"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const controller = __importStar(require("../controllers/user.controller"));
function default_1(app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.get("/api/test/all", controller.allAccess);
    app.get("/api/test/user", [middleware_1.authJwt.verifyToken], controller.userBoard);
    app.get("/api/test/admin", [middleware_1.authJwt.verifyToken, middleware_1.authJwt.isAdmin], controller.adminBoard);
    // project routes
    app.post("/createproject", controller.createProject);
    app.get("/getprojects", controller.getProjects);
    app.get("/getproject/:id", controller.getProjectById);
    app.put("/updateproject/:id", controller.updateProject);
    app.delete("/deleteproject/:id", controller.deleteProject);
    // experience routes
    app.post("/createxp", controller.createExperience);
    app.get("/getxps", controller.getExperiences);
    app.get("/getxp/:id", controller.getExperienceById);
    app.put("/updatexp/:id", controller.updateExperience);
    app.delete("/deletexp/:id", controller.deleteExperience);
}
exports.default = default_1;
