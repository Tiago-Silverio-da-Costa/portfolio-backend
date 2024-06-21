"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_config_1 = require("../config/auth.config");
var models_1 = require("../models");
var User = models_1.default.User;
var catchError = function (err, res) {
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });
};
var verifyToken = function (req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, auth_config_1.default.secret, function (err, decoded) {
        if (err) {
            return catchError(err, res);
        }
        req.userId = decoded.id;
        next();
    });
};
var isAdmin = function (req, res, next) {
    User.findByPk(req.userId).then(function (user) {
        user.getRoles().then(function (roles) {
            for (var i = 0; i < roles.length; i++) {
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
var authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};
exports.default = authJwt;
