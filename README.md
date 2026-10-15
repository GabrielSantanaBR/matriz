# MATRIZ

Sites personalizados, sistemas financeiros e automação para a rotina do seu negócio.

**Site:** https://gabrielsantanabr.github.io/matriz/

Portfólio estático em HTML, CSS e JavaScript nativo, com fontes locais e sem dependências de execução. Os templates e metadados são gerados por Python. O nome `dataforge-portfolio` aparece apenas em documentação histórica e caminhos de compatibilidade.

## Experiência

A home mantém a identidade da MATRIZ e organiza a apresentação em serviços, gestão financeira, projetos, possibilidades de produtos, etapas do trabalho e dúvidas de contratação. Os benefícios são descritos em linguagem de negócio, com convites para conversar ao longo da navegação.

O portfólio permite filtrar dez projetos por sites e lojas, sistemas e gestão ou planilhas e dados. SICMA Mathema aparece em uma seção própria como portal educacional com treino interativo. Código e informações de arquitetura permanecem disponíveis em áreas expansíveis. Exercícios de cursos e forks não integram a seleção comercial.

As páginas dos projetos preservam os limites e as fontes da inspeção original. Elas não afirmam contratação por marcas citadas, produção comprovada ou funcionalidades além da evidência. Recursos de novos projetos são definidos na proposta.

## Marca e imagens

A logo oficial PNG foi preservada sem alteração, com checksum conferido na auditoria.

| Cor | Valor |
| --- | --- |
| Carbon Black | `#0A0B0D` |
| Graphite | `#15171A` |
| Forge White | `#F2F1ED` |
| Steel | `#8C949D` |
| Ember | `#FF402E` |
| Hot Ember | `#FF8A45` |

Space Grotesk, Inter e IBM Plex Mono são servidas localmente. As licenças OFL estão em `assets/fonts/`.

As capturas de Nossas Delícias e Pata & Companhia foram fornecidas pelo autor. Coffee Five é uma captura da proposta de site. Finance Manager usa dados anonimizados. ClientFlow agora possui uma prévia própria de agenda, criada por código. Os PNGs originais foram mantidos; os WebPs usados nas páginas têm todos os pixels idênticos aos respectivos PNGs. Procedência em `docs/preview-provenance.json`.

Foram criadas sete demonstrações visuais por código: Pricing & Sales Manager, Sales Intelligence, DecisionForge AI, Curtailment Intelligence, Movimento, ClientFlow e SICMA Mathema. São composições ilustrativas com dados de exemplo, identificadas como demonstrações; não são capturas da aplicação em produção. Os valores de precificação são calculados a partir dos insumos e as métricas de vendas reconciliam o CSV público do projeto. O card permite ampliar cada imagem.

As seis prévias comerciais possuem composições próprias: planilha e calculadora de preços, relatório comercial, exploração com assistente, mapa de energia e despacho, ficha de treino com celular e agenda com histórico do cliente. A revisão de 15/10/2026 preservou a identidade da MATRIZ e a imagem do SICMA. A versão anterior está em `backup/pre-differentiated-previews-2026-10-15`.

O builder `scripts/product-previews.mjs` usa Sharp do runtime de autoria e produz as imagens já versionadas. O build normal do site não precisa desse renderizador. `content/demo-preview-data.json` registra as entradas do relatório de vendas. A procedência e os modelos dos demais exemplos constam da documentação.

As prévias podem ser ampliadas em um visualizador nativo, com zoom, fechamento por Escape/botão e link para o original. Sem JavaScript ou suporte a diálogo, os links originais continuam funcionando. O menu móvel mantém uma alternativa sem JavaScript e isola o conteúdo de fundo quando aberto.

`scripts/site-assets.mjs` gera os ícones, as versões responsivas das imagens e a arte de compartilhamento, preservando os originais. O cabeçalho usa uma logo WebP de 5.092 bytes, em vez do PNG de 441.201 bytes. A procedência está em `docs/site-asset-provenance.json`. CSS e JavaScript recebem identificadores de conteúdo para atualização do cache.

O formulário apresenta os erros junto aos campos, revela informações opcionais inválidas, indica o número de caracteres e orienta tentativas offline ou repetidas. Uma falha preserva o texto; uma confirmação de sucesso é necessária antes de mostrar a página de agradecimento. Não são armazenados rascunhos com dados pessoais.

## Desenvolvimento

Requisitos: Node 22+ e Python 3.12+. Não é necessário instalar pacotes.

```bash
npm run render
npm run dev
```

Ao alterar `scripts/render.py` ou `content/projects.json`, execute `npm run render`. Os HTML gerados ficam versionados. `npm run build` gera a saída publicável em `dist/`.

| Caminho | Finalidade |
| --- | --- |
| `scripts/render.py` | Templates, conteúdo da home e metadados |
| `content/projects.json` | Evidências, estágios e descrições dos projetos |
| `assets/css/matriz.css` | Identidade, layouts e breakpoints |
| `assets/js/site.js` | Menu, filtros e movimento acessível |
| `assets/js/contact-core.js` | Validação e transporte do contato |
| `assets/js/contact.js` | Contexto, campos e tratamento do formulário |
| `tests/` | Auditoria e testes de comportamento |
| `docs/validation.md` | Validação atual e registros históricos |

## Verificações

```bash
npm test
npm run build
python3 tests/audit.py --dist
```

A auditoria verifica 22 páginas, 17 URLs indexáveis, links, fragmentos, semântica, metadados, CSP, campos, assets e preservação da logo. Os nove testes Node cobrem contato, respostas inválidas, timeout, categoria financeira, movimento reduzido e filtros do portfólio.

Nesta revisão de 14/10/2026, o navegador de QA não estava disponível. Breakpoints foram revisados no código; as capturas de setembro representam a versão anterior. Não foi enviado contato externo real. A validação do transporte é simulada e não confirma recebimento na caixa de email.

## Contato e segurança

O formulário existente usa Web3Forms. Nome, email, tipo de projeto e descrição são obrigatórios; empresa, WhatsApp e investimento são opcionais. O visitante pode selecionar “Ainda não sei / Quero orientação”. Links de serviços e projetos levam o interesse ao formulário.

Há limites de campos, honeypot, prevenção de envio simultâneo, intervalo entre tentativas e timeout. Falhas preservam os campos; a confirmação depende de sucesso explícito do serviço. Sem JavaScript, o POST nativo permanece disponível.

O identificador público do formulário não concede acesso administrativo. Não há credenciais privilegiadas no frontend, analytics próprios ou fontes remotas. A sessão guarda apenas o horário da última tentativa. Consulte `SECURITY.md`, `privacy.html` e `security.html` para os controles e limites existentes.

## Publicação e recuperação

O workflow `.github/workflows/pages.yml` repete os testes, gera `dist/`, audita o pacote e publica a `main` no GitHub Pages. Fontes de geração, documentação e ferramentas de teste não integram a saída publicada. Canonicals, sitemap e URLs de compartilhamento apontam para `/matriz/`. Os caminhos de compatibilidade de `/matriz/` e do antigo nome são preservados no pacote.

**Backup desta revisão:** `backup/portfolio-2026-10-14`, commit `82a28c7984b38094eaca9db1d556e7c2e471d235`. A branch preserva a versão antiga e foi criada antes das alterações. Uma restauração deve ser publicada como um novo commit para preservar o histórico.

Os registros históricos e a referência `backup/pre-matriz-2026-09-07` continuam documentados. A configuração de visualização complementar existente não foi alterada.

## Atribuições

Marca e materiais foram fornecidos pelo responsável pelo projeto. Referências visuais mantêm o contexto das respectivas páginas. Este repositório não concede direitos sobre marcas de terceiros nem atribui uma nova licença geral.
