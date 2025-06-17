module.exports = {
    apps : [{
      name: "API_SENIOR_TASY",
      script: "./build/src/server.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }