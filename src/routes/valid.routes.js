const { Router } = require("express");
const ControllerResetTasy = require("../controller/ControllerResetTasy");
// const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const controllerResetTasy = new ControllerResetTasy
const validResetRoutes = Router()

validResetRoutes.post("/", controllerResetTasy.reset)

module.exports = validResetRoutes