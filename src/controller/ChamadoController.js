const connectionTasy = require("../connection")
const oracledb = require('oracledb');


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

      // Converter valores para os tipos corretos
      // cdPessoaSolicitante - manter como string (pode ser CPF formatado)
      const cdPessoaSolicitanteClean = cdPessoaSolicitante
        ? (typeof cdPessoaSolicitante === 'string' ? cdPessoaSolicitante.replace(/\D/g, '') : String(cdPessoaSolicitante))
        : null;

      const nrSeqLocalizacaoNum = nrSeqLocalizacao !== null && nrSeqLocalizacao !== undefined
        ? Number(nrSeqLocalizacao)
        : null;
      const nrSeqEquipamentoNum = nrSeqEquipamento !== null && nrSeqEquipamento !== undefined
        ? Number(nrSeqEquipamento)
        : null;

      // Converter status para NUMBER (0 ou outro valor numérico)
      const statusNum = status !== null && status !== undefined
        ? Number(status)
        : 0;

      // Comando PL/SQL para chamar a procedure com schema TASY e parâmetro OUT
      // Usando sintaxe posicional (mais compatível com node-oracledb)
      const sql = `
        begin
          TASY.ghas_os_ava_p(
            :ds_dano_brev_p,
            :ds_dano_p,
            :cd_pf_solic_p,
            :nr_seq_localizacao_p,
            :nr_seq_equipamento_p,
            :nm_usuario_p,
            :ie_status_p,
            :ds_retorno_p
          );
        end;
      `;

      // Parâmetros da procedure com tipos explícitos
      // ds_retorno_p é um parâmetro OUT
      const binds = {
        ds_dano_brev_p: dsDanoBreve ? { val: dsDanoBreve, type: oracledb.STRING } : { val: null, type: oracledb.STRING },
        ds_dano_p: dsDano ? { val: dsDano, type: oracledb.STRING } : { val: null, type: oracledb.STRING },
        cd_pf_solic_p: cdPessoaSolicitanteClean ? { val: cdPessoaSolicitanteClean, type: oracledb.STRING } : { val: null, type: oracledb.STRING },
        nr_seq_localizacao_p: nrSeqLocalizacaoNum !== null ? { val: nrSeqLocalizacaoNum, type: oracledb.NUMBER } : { val: null, type: oracledb.NUMBER },
        nr_seq_equipamento_p: nrSeqEquipamentoNum !== null ? { val: nrSeqEquipamentoNum, type: oracledb.NUMBER } : { val: null, type: oracledb.NUMBER },
        nm_usuario_p: nmUsuario ? { val: nmUsuario, type: oracledb.STRING } : { val: null, type: oracledb.STRING },
        ie_status_p: { val: statusNum, type: oracledb.NUMBER },
        ds_retorno_p: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 4000 }
      };

      console.log('Executando procedure com binds:', JSON.stringify({
        ds_dano_brev_p: dsDanoBreve,
        ds_dano_p: dsDano,
        cd_pf_solic_p: cdPessoaSolicitanteClean,
        nr_seq_localizacao_p: nrSeqLocalizacaoNum,
        nr_seq_equipamento_p: nrSeqEquipamentoNum,
        nm_usuario_p: nmUsuario,
        ie_status_p: statusNum
      }, null, 2));

      // Executando a procedure
      const result = await database.execute(sql, binds, { autoCommit: true });

      // Capturar o valor de retorno do parâmetro OUT
      const retorno = result.outBinds.ds_retorno_p;
      console.log("Procedure executada com sucesso! Retorno:", retorno);

      if (database) {
        await database.close();
      }

      return response.status(201).json({
        message: "Chamado criado com sucesso",
        retorno: retorno || null
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