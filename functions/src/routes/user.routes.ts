import { Application, Request, Response, NextFunction } from 'express';
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

  app.post("/createlead", controller.createFormlead)

  app.post("/createproject", controller.createProject);
  app.get("/getprojects", controller.getProjects);
  app.get("/getproject/:id", controller.getProjectById);
  app.put("/updateproject/:id", controller.updateProject);
  app.delete("/deleteproject/:id", controller.deleteProject);

  app.post("/createxp", controller.createExperience);
  app.get("/getxps", controller.getExperiences);
  app.get("/getxp/:id", controller.getExperienceById);
  app.put("/updatexp/:id", controller.updateExperience);
  app.delete("/deletexp/:id", controller.deleteExperience);
}

