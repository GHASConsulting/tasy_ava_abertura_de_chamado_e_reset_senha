module.exports = {
    apps : [{
      name: "API_TASY_RESET",
      script: "./src/server.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }