const { Router } = require("express");

const routes = Router()

const validResetRoutes = require("./valid.routes");
const sessionsRoutes = require("./sessions.routes");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const createChamado = require("./createChamado.routes");

routes.use("/", ensureAuthenticated)
routes.use("/passwordReset", ensureAuthenticated, validResetRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/chamado", createChamado)


module.exports = routes