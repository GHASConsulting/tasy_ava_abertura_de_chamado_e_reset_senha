const connection = require("../connection")

class ControllerResetTasy {
  async reset(request, response) {
    let db = null;
    try {
      const { matricula, cpf } = request.body;

      if (!matricula || !cpf) {
        return response.status(400).json({ error: "Matricula e CPF são obrigatórios" });
      }

      const CPFNum = cpf.replace(/\D/g, '');
      db = await connection();

      if (!db) {
        return response.status(500).json({ error: "Erro ao conectar com o banco de dados" });
      }

      //verificação da matricula
      const checkUserExists = await db.execute(
        `SELECT
          ds_usuario
        FROM
          usuario 
        WHERE
          UPPER(nm_usuario) = UPPER(:matricula)
        GROUP BY
          ds_usuario HAVING COUNT(*) >= 1`,
        { matricula }
      );

      if (!checkUserExists.rows || checkUserExists.rows.length === 0) {
        await db.close();
        return response.status(200).json({ error: "Matricula não encontrada" });
      }

      //verificação do CPF
      const checkCPFExists = await db.execute(
        `SELECT 
          nr_cpf 
        FROM 
          pessoa_fisica a,
          usuario b
        WHERE 
          nr_cpf = :cpf 
          and a.cd_pessoa_fisica = b.cd_pessoa_fisica
          and UPPER(b.nm_usuario) = UPPER(:matricula)
        GROUP BY nr_cpf HAVING COUNT(*) >= 1`,
        { cpf: CPFNum, matricula }
      );

      if (!checkCPFExists.rows || checkCPFExists.rows.length === 0) {
        await db.close();
        return response.status(200).json({ error: "CPF não encontrado" });
      }

      if (checkCPFExists.rows.length > 0 && checkUserExists.rows.length > 0) {
        const result = await db.execute(
          `UPDATE USUARIO
           SET 
             DS_SENHA = 'BE4B065B7B01F30804397BD363DD1D4E1205F8D3DFA78954EA8C7E2A4348F133',
             DS_TEC = 'xV@ThKF+\\9eOMDf',
             IE_SITUACAO = 'A',
             dt_alteracao_senha = null
           WHERE
             UPPER(NM_USUARIO) = UPPER(:matricula)`,
          { matricula },
          { autoCommit: true }
        );

        console.log('Usuário atualizado:', result);
      }

      await db.close();

      return response.status(200).json({
        message: "Usuário Atualizado com Sucesso"
      });

    } catch (error) {
      console.error('Erro no reset de senha:', error);
      if (db) {
        try {
          await db.close();
        } catch (closeError) {
          console.error('Erro ao fechar conexão:', closeError);
        }
      }
      return response.status(500).json({
        error: "Erro ao processar solicitação",
        message: error.message
      });
    }
  }
}

module.exports = ControllerResetTasy
