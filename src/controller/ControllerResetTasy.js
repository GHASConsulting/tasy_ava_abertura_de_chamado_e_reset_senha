const connection = require("../connection")

class ControllerResetTasy {
  async reset(request, response) {
    
    const {matricula, cpf, } = request.body
    const MatriculaNum = matricula.replace(/\D/g, '')
    const CPFNum = cpf.replace(/\D/g, '')


    const db = await connection()

    //verificação da matricula
    const checkUserExists = await db.execute(`
    SELECT
      ds_usuario
    FROM
      usuario 
    WHERE
      UPPER(nm_usuario) = :matricula
    GROUP BY
      ds_usuario HAVING COUNT(*) >= 1`, [MatriculaNum]);

    if (checkUserExists.rows.length === 0) {
      return response.status(200).json({ error: "Matricula não encontrada"})
    }

    //verificação do CPF
    const checkCPFExists = await db.execute(`
    SELECT 
      nr_cpf 
    FROM 
      pessoa_fisica a,
      usuario b
    WHERE 
      nr_cpf = :cpf 
      and a.cd_pessoa_fisica= b.cd_pessoa_fisica
      and UPPER(b.nm_usuario) =:matricula
    GROUP BY nr_cpf HAVING COUNT(*) >= 1`, [CPFNum, MatriculaNum]);

    if(checkCPFExists.rows.length === 0) {
      return response.status(200).json({ error: "CPF não encontrado" })
    }

    if(!checkCPFExists.rows.length !== 0 && !checkUserExists  !== 0 ) {

      const result = await db.execute(
        `UPDATE USUARIO
         SET 
           DS_SENHA = 'BE4B065B7B01F30804397BD363DD1D4E1205F8D3DFA78954EA8C7E2A4348F133',
           DS_TEC = 'xV@ThKF+\\9eOMDf',
           IE_SITUACAO = 'A',
           dt_alteracao_senha = null
         WHERE
           UPPER(NM_USUARIO) = :matricula`,
        [MatriculaNum],
        { autoCommit: true }
      );
  
      console.log(result);
    }

    const variable = [
    checkCPFExists.rows,
    checkUserExists.rows
    ]
    console.log(variable)

    return response.status(200).json({
        message: "Usuário Atualizado com Sucesso"
    })
  }
}

module.exports = ControllerResetTasy