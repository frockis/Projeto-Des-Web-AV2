export default function Rodape() {
  return (
    <footer id="rodape">
      <div className="rodape-interno">
        <section>
          <h3>Contatos</h3>
          <ul className="contatos">
            <li>
              Telefone: <a href="tel:+558130001234">(81) 3000-1234</a>
            </li>
            <li>
              WhatsApp: <a href="https://wa.me/5581990001234">(81) 99000-1234</a>
            </li>
            <li>
              <a href="mailto:contato@novatech.com.br">contato@novatech.com.br</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>Endereço</h3>
          <address style={{ fontStyle: "normal" }}>
            Av. Boa Viagem, 1500, sala 704
            <br />
            Boa Viagem, Recife - PE
            <br />
            CEP 51011-000
          </address>
        </section>
        <section>
          <h3>Formas de pagamento</h3>
          <div className="pagamentos">
            <figure>
              <img src="/img/pg-credito.svg" alt="Cartão de crédito" />
              <figcaption>Crédito</figcaption>
            </figure>
            <figure>
              <img src="/img/pg-debito.svg" alt="Cartão de débito" />
              <figcaption>Débito</figcaption>
            </figure>
            <figure>
              <img src="/img/pg-pix.svg" alt="Pix" />
              <figcaption>Pix</figcaption>
            </figure>
            <figure>
              <img src="/img/pg-boleto.svg" alt="Boleto bancário" />
              <figcaption>Boleto</figcaption>
            </figure>
          </div>
        </section>
      </div>
      <p className="copy" style={{ margin: 0 }}>
        NovaTech Soluções em TI
      </p>
    </footer>
  );
}
