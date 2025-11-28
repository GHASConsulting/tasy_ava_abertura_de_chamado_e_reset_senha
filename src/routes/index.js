const { Router } = require("express");

const routes = Router()

const validResetRoutes = require("./valid.routes");
const sessionsRoutes = require("./sessions.routes");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
  const createChamadoRoutes = require("./createChamado.routes");

routes.use("/passwordReset", ensureAuthenticated, validResetRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/chamado", createChamadoRoutes)


module.exports = routes
