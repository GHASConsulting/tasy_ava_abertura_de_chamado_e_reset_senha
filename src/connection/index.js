require("dotenv/config")
const oracledb = require('oracledb');

// Inicializar Oracle Client apenas se LIBARY_ORACLE estiver definido
if (process.env.LIBARY_ORACLE) {
  oracledb.initOracleClient({ libDir: process.env.LIBARY_ORACLE });
} else {
  // Fallback para o caminho padrão instalado
  oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_21_17' });
}

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
