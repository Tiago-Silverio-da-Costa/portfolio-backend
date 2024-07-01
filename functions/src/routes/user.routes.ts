import { Application, Request, Response, NextFunction } from 'express';
import { authJwt } from '../middleware/index.js';
import * as controller from '../controllers/user.controller.js';

export default function (app: Application): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

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

