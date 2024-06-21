"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var models_1 = require("./models");
var auth_routes_1 = require("./routes/auth.routes");
var user_routes_1 = require("./routes/user.routes");
var app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
models_1.default.sequelize.sync();
app.get('/', function (req, res) {
    res.json({ message: 'Welcome to tiagosc application' });
});
(0, auth_routes_1.default)(app);
(0, user_routes_1.default)(app);
var PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
    console.log("Server is running on port http://localhost:".concat(PORT));
});
