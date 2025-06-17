const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.LIBARY_ORACLE });
require("dotenv/config")

async function connectionTasy() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.BASE_USER,
      password: process.env.BASE_PASSWORD,
      connectString: process.env.DATABASE_URL
    });
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    return connection;
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error.message);
    return null;
  }
}

module.exports = connectionTasy;
