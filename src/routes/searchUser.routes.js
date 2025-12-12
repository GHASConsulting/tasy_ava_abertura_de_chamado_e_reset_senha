const { Router } = require("express");

const searchUserRoutes = Router();

const ControllerResetTasy = require("../controller/ControllerResetTasy");
const controllerResetTasy = new ControllerResetTasy();

searchUserRoutes.post("/", controllerResetTasy.SearchUser);

module.exports = searchUserRoutes;