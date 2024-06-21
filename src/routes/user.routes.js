"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middleware_1 = require("../middleware");
var controller = require("../controllers/user.controller");
function default_1(app) {
    app.use(function (req, res, next) {
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
