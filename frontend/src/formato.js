export function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarDataISO(iso) {
  const [ano, mes, dia] = String(iso).split("-");
  if (!ano || !mes || !dia) {
    return "-";
  }
  return `${dia}/${mes}/${ano}`;
}

export function hojeISO() {
  const data = new Date();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function somarDiasISO(iso, dias) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + Number(dias));
  const mesNovo = String(data.getMonth() + 1).padStart(2, "0");
  const diaNovo = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mesNovo}-${diaNovo}`;
}

export function ordenarSolicitacoes(lista) {
  return [...lista].sort((a, b) => {
    const porData = String(a.dataPedido).localeCompare(String(b.dataPedido));
    if (porData !== 0) {
      return porData;
    }
    return (a.id ?? Number.MAX_SAFE_INTEGER) - (b.id ?? Number.MAX_SAFE_INTEGER);
  });
}

export function interpretarPreco(texto) {
  const limpo = String(texto).trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (limpo === "") {
    return NaN;
  }
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;
  if (!/^\d+(\.\d{1,2})?$/.test(normalizado)) {
    return NaN;
  }
  return Number(normalizado);
}

export function classeStatus(status) {
  if (status === "CONCLUÍDO") {
    return "status-concluido";
  }
  if (status === "EM ANDAMENTO") {
    return "status-em-andamento";
  }
  return "status-em-elaboracao";
}
