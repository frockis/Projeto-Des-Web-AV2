const fundadores = [
  {
    cargo: "Diretor Executivo (CEO)",
    nome: "Marcos Vinícius Albuquerque",
    cv: "Bacharel em Sistemas de Informação, MBA em Gestão Empresarial. 15 anos de experiência em projetos de infraestrutura para o setor de saúde.",
  },
  {
    cargo: "Diretora de Tecnologia (CTO)",
    nome: "Juliana Costa Menezes",
    cv: "Mestre em Ciência da Computação. Especialista em arquitetura de nuvem e segurança, com certificações internacionais.",
  },
  {
    cargo: "Diretor de Operações (COO)",
    nome: "Rafael Teixeira Lima",
    cv: "Tecnólogo em Redes de Computadores e pós-graduado em Gestão de Serviços de TI. Responsável pelo suporte e pelos contratos de atendimento.",
  },
];

export default function TabelaFundadores() {
  return (
    <table>
      <thead>
        <tr>
          <th>Cargo</th>
          <th>Nome</th>
          <th>Currículo resumido</th>
        </tr>
      </thead>
      <tbody>
        {fundadores.map((pessoa) => (
          <tr key={pessoa.nome}>
            <td>{pessoa.cargo}</td>
            <td>{pessoa.nome}</td>
            <td>{pessoa.cv}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
