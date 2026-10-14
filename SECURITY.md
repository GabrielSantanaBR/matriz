# Segurança — MATRIZ

Este documento descreve o site institucional estático, não a segurança de cada aplicação exibida no portfólio.

## Relatar uma vulnerabilidade

Use https://gabrielsantanabr.github.io/matriz/contact.html?service=evolucao ou o LinkedIn indicado no rodapé. Informe a URL, o comportamento e passos mínimos para reprodução. Não envie credenciais, dados privados ou informações pessoais de terceiros. Não há prazo de resposta ou programa de recompensa anunciado.

## Controles implementados

- CSP em todas as páginas: scripts, estilos, fontes e imagens locais; objetos, frames, workers e mídia bloqueados. Sem `unsafe-inline` ou `unsafe-eval`.
- `connect-src` e `form-action` permitem apenas Web3Forms na página de contato; nas demais, são bloqueados.
- Links externos abertos em nova aba incluem `noopener noreferrer`; metadados de referrer reduzem a exposição do caminho de origem.
- Templates escapam conteúdo; parâmetros de URL são normalizados e aplicados por propriedades seguras, sem `innerHTML` ou redirecionamento aberto.
- Contato com validação, campos limitados, honeypot, intervalo de 15 segundos, bloqueio simultâneo e timeout de 12 segundos. Erros não apagam os campos.
- Payload de contato por lista permitida; credenciais e referrer são omitidos no fetch. Apenas `success: true` com HTTP de sucesso conduz à confirmação.
- Verificações automáticas de rotas, anchors, IDs, markup, CSP, SEO, marca, assets e padrões comuns de credenciais precedem o deploy.
- Sem dependências de execução, analytics, fontes externas ou armazenamento persistente de mensagens no navegador.
- Build explícito publica somente HTML, assets e metadados. Servidor de desenvolvimento, fixtures, mocks e scripts de geração não são enviados ao Pages.

## Web3Forms

O identificador incluído no formulário é um alias público de envio já existente no projeto; não é um token administrativo. Credenciais de conta, tokens GitHub, SMTP e outras chaves privilegiadas nunca devem ser incluídos no site.

Proteções do navegador podem ser contornadas por clientes externos. O provedor deve aplicar validação e controles contra abuso no servidor. Restrições por domínio e mecanismos adicionais dependem da conta/plano do provedor e não foram afirmados como configurados. A CSP não impede terceiros de reutilizarem um identificador público fora deste site.

Os testes automatizados e de interface utilizam respostas simuladas. A entrega na caixa de email depende do provedor, da configuração da conta e do destinatário. O site confirma aceitação pelo serviço, sem prometer entrega ou prazo de resposta.

## Limites do GitHub Pages

O site não controla livremente todos os cabeçalhos HTTP do GitHub Pages. A CSP em meta protege o documento depois de interpretada; `frame-ancestors` não funciona nesse formato e não está anunciado como proteção disponível. HSTS, cabeçalhos de cache e outras políticas de transporte dependem da hospedagem.

Para uma futura hospedagem com controle de cabeçalhos, avaliar CSP por HTTP (incluindo `frame-ancestors`), `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`, após testar os fluxos. Não relaxar a política apenas para adicionar trackers ou animações.

## Dados e manutenção

O site não tem login, banco de clientes ou área administrativa. A sessão armazena somente o timestamp da última tentativa de contato. Logs técnicos da hospedagem e retenção das mensagens pelo Web3Forms seguem seus próprios controles, descritos na política de privacidade.

Revise a configuração do formulário e os links após alterações de hospedagem. Mantenha Node, Python e actions de CI atualizados. A inspeção do repertório registra um momento do código público e não certifica segurança dos projetos externos.
