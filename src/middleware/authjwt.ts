import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../config/auth.config';
import db from '../models';
import { Request, Response, NextFunction } from 'express';

const User = db.User;

declare module 'express-serve-static-core' {
    interface Request {
      userId?: string;
    }
  }

const catchError = (err: Error, res: Response) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"] as string;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded: any) => {
        if (err) {
            return catchError(err, res);
        }
        req.userId = decoded.id;
        next();
    });
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    User.findByPk(req.userId).then((user: any) => {
        user.getRoles().then((roles: any) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};

export default authJwt;