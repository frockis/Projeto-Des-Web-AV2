import { classeStatus, formatarDataISO, formatarMoeda } from "../formato";

export default function TabelaSolicitacoes({ solicitacoes, aoExcluir }) {
  return (
    <div className="tabela-rolagem">
      <table>
        <thead>
          <tr>
            <th>Data do pedido</th>
            <th>Nº</th>
            <th>Serviço de TI</th>
            <th>Status</th>
            <th>Preço</th>
            <th>Previsão</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.length === 0 ? (
            <tr>
              <td colSpan={7}>Nenhuma solicitação cadastrada para este cliente.</td>
            </tr>
          ) : (
            solicitacoes.map((item) => (
              <tr key={item.chave}>
                <td>{formatarDataISO(item.dataPedido)}</td>
                <td>{item.id ?? "novo"}</td>
                <td>{item.nomeServico}</td>
                <td className={classeStatus(item.status)}>{item.status}</td>
                <td>{formatarMoeda(item.preco)}</td>
                <td>{formatarDataISO(item.dataPrevista)}</td>
                <td>
                  <button type="button" className="botao perigo" onClick={() => aoExcluir(item.chave)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
