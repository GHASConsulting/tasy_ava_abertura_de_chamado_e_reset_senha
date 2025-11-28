const connectionTasy = require("../connection")


class ChamadoController {
  limparJSON(jsonString) {
    if (typeof jsonString !== 'string') {
      // Se não for string, tenta converter para string
      return JSON.stringify(jsonString);
    }
    // Remove caracteres de controle ilegais
    return jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').trim();
  }

  async create(request, response) {
    let database = null;
    try {
      database = await connectionTasy();
      
      if (!database) {
        return response.status(500).json({ error: "Erro ao conectar com o banco de dados" });
      }
      // Verifica se request.body já é um objeto ou precisa ser parseado
      let dados;
      if (typeof request.body === 'string') {
        const jsonLimpo = this.limparJSON(request.body);
        dados = JSON.parse(jsonLimpo);
      } else {
        dados = request.body;
      }

      console.log(dados);

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

      // Comando PL/SQL para chamar a procedure
      const sql = `
        begin
          ghas_os_ava_p(
            :ds_dano_brev_p,
            :ds_dano_p,
            :cd_pf_solic_p,
            :nr_seq_localizacao_p,
            :nr_seq_equipamento_p,
            :nm_usuario_p,
            :ie_status_p
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
      await database.execute(sql, binds, { autoCommit: true });

      console.log("Procedure executada com sucesso!");

      if (database) {
        await database.close();
      }

      return response.status(201).json({
        message: "Chamado criado com sucesso",
      });

    } catch (err) {
      console.error('Erro ao processar chamado:', err);
      if (database) {
        try {
          await database.close();
        } catch (closeError) {
          console.error('Erro ao fechar conexão:', closeError);
        }
      }
      return response.status(400).json({
        error: 'Erro ao processar a requisição',
        message: err.message
      });
    }
  }
}

module.exports = ChamadoController