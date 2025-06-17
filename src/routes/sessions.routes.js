const { Router } = require("express");
const SessionController = require("../controller/SessionController");
const sessionsController = new SessionController();

const sessionsRoutes = Router();
sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;