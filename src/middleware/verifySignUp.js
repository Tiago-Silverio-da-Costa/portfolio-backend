"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var ROLES = models_1.default.ROLES;
var User = models_1.default.User;
var checkDuplicateUsernameOrEmail = function (req, res, next) {
    // Username
    console.log(req.body);
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(function (user) {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }
        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(function (user) {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }
            next();
        });
    });
};
var checkRolesExisted = function (req, res, next) {
    if (req.body.roles) {
        for (var i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }
    next();
};
var verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
};
exports.default = verifySignUp;
