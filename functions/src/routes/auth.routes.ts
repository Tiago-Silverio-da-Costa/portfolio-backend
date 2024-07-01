import { Application, Request, Response, NextFunction } from 'express';
import { verifySignUp } from '../middleware/index.js';
import * as controller from '../controllers/auth.controller.js';

export default function (app: Application): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/refreshtoken", controller.refreshToken);

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
}
