const connectionTasy = require("../connection")


class ChamadoController {
  async create(request, response) {
    const database = await connectionTasy();
    try {
      // Limpar a string JSON antes de parsear
      const jsonString = request.body;
      const jsonLimpo = limparJSON(jsonString);
      const dados = JSON.parse(jsonLimpo);

      console.log(dados)


      const {
        dsDanoBreve,
        nmUsuario,
        dsDano,
        cdPessoaSolicitante,
        nrSeqLocalizacao,
        nrSeqEquipamento,
        status
      } = dados;

      // Continue com a lógica de processamento dos dados
      console.log(`Dano Breve: ${dsDanoBreve}`);
      console.log(`Nome de Usuário: ${nmUsuario}`);
      console.log(`Descrição do Dano: ${dsDano}`);
      console.log(`Código da Pessoa Solicitante: ${cdPessoaSolicitante}`);
      console.log(`Número de Sequência de Localização: ${nrSeqLocalizacao}`);
      console.log(`Número de Sequência de Equipamento: ${nrSeqEquipamento}`);
      console.log(`Status: ${status}`);

      response.status(200).send('Dados recebidos com sucesso!');
    } catch (err) {
      console.error('Erro ao parsear JSON:', err);
      response.status(400).send('Erro ao processar a requisição.');
    }

    function limparJSON(jsonString) {
      if (typeof jsonString !== 'string') { throw new TypeError('jsonString deve ser uma string'); } // Remove caracteres de controle ilegais return jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').trim(); }

      try {
        // Comando PL/SQL para chamar a procedure
        const sql = `
        begin
          ghas_os_ava_p(
            ds_dano_brev_p,
            ds_dano_p,
            cd_pf_solic_p,
            nr_seq_localizacao_p,
            nr_seq_equipamento_p,
            nm_usuario_p,
            ie_status_p,
          );
        end;
      `;

        // Parâmetros da procedure
        const binds = {
          ds_dano_brev_p: dsDanoBreve,
          ds_dano_p: dsDano,
          cd_pf_solic_p: cdPessoaSolicitante,
          nr_seq_localizacao_p: nrSeqLocalizacao,
          nr_seq_equipamento_p: nrSeqEquipamento,
          nm_usuario_p: nmUsuario,
          ie_status_p: status,
        };

        // Executando a procedure
        database.execute(sql, binds, { autoCommit: true });

        console.log("Procedure executada com sucesso!");

      } catch (err) {
        console.error("Erro ao executar a procedure:", err);
      }



      return response.status(201).json({
        message: "Chamado criado com sucesso",
      })
    }

  }
}

module.exports = ChamadoController