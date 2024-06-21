"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middleware_1 = require("../middleware");
var controller = require("../controllers/auth.controller");
function default_1(app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.post("/api/auth/refreshtoken", controller.refreshToken);
    app.post("/api/auth/signup", [
        middleware_1.verifySignUp.checkDuplicateUsernameOrEmail,
        middleware_1.verifySignUp.checkRolesExisted
    ], controller.signup);
    app.post("/api/auth/signin", controller.signin);
}
exports.default = default_1;
