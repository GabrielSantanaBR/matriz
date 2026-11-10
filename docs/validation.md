# Clareza, exemplos e apresentação humana — 10/11/2026

A abertura passou a dizer “Sites e sistemas para a rotina do seu negócio”, seguida dos quatro produtos. A logo oficial foi reduzida de 430 para 250 px no computador; no celular, a marca do cabeçalho permanece e a repetição grande da abertura sai da leitura. Os atalhos aos produtos e o link direto aos exemplos aparecem antes. A faixa laranja suave e o layout fluido aprovados foram preservados.

Os oito exemplos receberam público e uso cotidiano, com textos próprios em `customer_context` de `content/projects.json`. O contexto acompanha as prévias da home, as páginas de produto e a vitrine de exemplos. Demonstrações, propostas e interfaces anonimizadas mantêm suas identificações. Legendas, estados, descrições e textos auxiliares tiveram tamanho e contraste ampliados, sem alterar as imagens aprovadas.

A home apresenta Gabriel Santana como responsável, com texto de apresentação, acesso ao perfil profissional e contato. A identidade textual usa iniciais; nenhuma foto de equipe foi inventada. Uma foto real adequada não foi localizada entre os materiais disponíveis. A página de contato permite começar por uma conversa no LinkedIn ou ir ao formulário. O botão identifica o destino para evitar uma troca de canal inesperada.

`content/studio.json` centraliza a apresentação e o contato público. O campo WhatsApp permanece vazio porque não foi fornecido um número com DDD, mesmo após a solicitação. Enquanto vazio, nenhum botão de WhatsApp ou número fictício é publicado. A integração preparada valida o formato brasileiro e monta a mensagem com produto e exemplo quando disponíveis; ativa os acessos na apresentação, contato, rodapé e faixa compartilhada quando um número válido for informado. Foram verificadas configuração vazia, composição contextual e rejeição de quatro formatos inválidos, sem abrir ou enviar mensagens. A foto e a ativação do WhatsApp dependem do envio desses materiais pelo responsável.

Validação: os 17 testes Node e a auditoria da fonte passaram. Build, auditorias da fonte e da saída pública e `git diff --check` passaram após o ajuste final do texto. No Chromium, 32 combinações (home, quatro produtos, contato, exemplos e contratação em 360, 768, 1366 e 3840 px) não apresentaram overflow horizontal nem imagens carregadas quebradas. Houve inspeção adicional da home em 390 px e da quebra final do título em 360 px. O menu móvel abriu e fechou por Escape; o filtro Planilhas exibiu dois exemplos; a imagem ampliada carregou em 1440 px. O CTA inferior de Sistemas preservou produto e mensagem no contato. Nenhum envio real foi realizado. Viewports CSS em iframe, sem aparelhos físicos, Safari ou medição de conversão.

Registros: `docs/qa/matriz-clarity-home-20261110.jpg`, `docs/qa/matriz-clarity-about-20261110.jpg` e `docs/qa/matriz-clarity-checks-20261110.json`. Backup local e remoto da versão anterior: `backup/pre-clarity-trust-2026-11-10`, commit `631cef5012b824977cab56cd0134406a5847ae97`.

---

# Acabamento visual e navegação — 09/11/2026

A primeira tela recebeu uma hierarquia mais direta: título e descrição com leitura mais clara, menos textos repetidos e acesso aos quatro produtos logo após a apresentação. O símbolo oficial da MATRIZ foi preservado, com escala ajustada ao espaço disponível e sem partículas decorativas adicionais. A faixa laranja suave e a distribuição fluida aprovadas permanecem.

Botões, setas, imagens e estados de navegação receberam acabamento consistente: raio discreto, sombras leves, foco visível e indicação de página atual. Setas verticais indicam atalhos dentro da página, horizontais indicam navegação interna e diagonais permanecem nos destinos externos. As páginas de exemplos e contratação têm aberturas mais compactas. O contato usa título mais direto e formulário em uma superfície única, com campos e estados de foco mais definidos.

A navegação entre os quatro produtos acompanha a rolagem no computador; os destinos consideram a altura do cabeçalho e das abas. No Chromium, o topo das abas ficou em 88 px, sua base em 152 px e o destino de exemplos em 174 px, sem esconder o título. O caminho de Sistemas para negócios ao contato preservou produto e contexto. Menu móvel abriu e fechou com Escape; o filtro Planilhas exibiu dois exemplos e a ampliação carregou a imagem de 1440 px. Nenhuma mensagem externa foi enviada.

Validação: os 17 testes Node e a auditoria da fonte passaram; build, auditoria de dist e git diff --check passaram após o ajuste final das setas. Foram verificadas 32 combinações: home, quatro produtos, contato, exemplos e contratação em 360, 768, 1366 e 3840 px, sem overflow horizontal nem imagens carregadas quebradas. A inspeção visual cobriu home desktop e 390 px, contato e exemplos do produto. Viewports CSS em iframe e Chromium; aparelhos físicos, Safari e controles reais de zoom não foram testados. Não há medição de conversão.

Registros: `docs/qa/matriz-visual-finish-home-20261109.jpg`, `docs/qa/matriz-visual-finish-contact-20261109.jpg` e `docs/qa/matriz-visual-finish-checks-20261109.json`. Backup anterior: `backup/pre-visual-finish-2026-11-09`, commit `26877bfdf54d896fe2c0f7c31604854e16ca8689`.

---

# Faixa laranja e distribuição fluida — 09/11/2026

A faixa de contato voltou a ser laranja, conforme a preferência do usuário. Foi usado um tom menos saturado (#d99463), com texto escuro, botão escuro e menor altura no computador. O laranja principal da marca permanece #ff8a45 nos demais pontos do site.

O limite global de 1440 px do contêiner foi retirado. As áreas passam a usar a largura disponível com margens proporcionais, mantendo limites de leitura em textos específicos. A home preserva a apresentação alternada nas larguras usuais, passa a duas colunas de produtos a partir de 1800 px e quatro a partir de 3000 px. A grade de exemplos usa auto-fit; os exemplos nas páginas de produto também se ajustam à largura. Não foram usados zoom CSS, transformações para compensar zoom nem interceptação dos controles do navegador.

A prévia manual recebeu opções de 2560, 3840 e 5120 px. Foram verificadas 32 combinações de layout: home, exemplos e Sites em 1920/2560/3840/5120 px; home, exemplos, Sites, contato e contratação em 360/390/768/1366 px. Não houve overflow horizontal ou imagens carregadas quebradas. A home apresentou 2/2/4/4 colunas de produtos, e a lista de exemplos 3/5/7/8 colunas nas quatro larguras amplas. O contêiner preenche a largura da página em vez de permanecer limitado à coluna central anterior.

Os 17 testes Node, build, auditorias da fonte e do dist e git diff --check passaram. As larguras são simuladas em iframe. Uma tentativa de atalho de zoom no navegador remoto não alterou a escala; portanto, o reflow foi verificado pelas larguras CSS, sem alegar validação dos controles de zoom de um navegador físico. As interações não foram alteradas e nenhum contato foi enviado.

Registros visuais: `docs/qa/matriz-soft-orange-20261109.jpg` (faixa, navegador normal) e `docs/qa/matriz-fluid-wide-20261109.jpg` (home em viewport de teste de 1920 px). Backup: `backup/pre-fluid-layout-2026-11-09`, commit `4bad40acc301c3516d03f9ce7f30a27ae3f16030`.

---

# Limpeza da apresentação comercial — 09/11/2026

A home reúne contratação e processo em uma seção de três etapas: conversa, proposta e entrega. As dúvidas passaram de cinco para quatro perguntas, mantendo a escolha da solução, custos recorrentes, maturidade dos exemplos, suporte, acessos e dados. As condições completas continuam na página de contratação. O contato compartilhado usa fundo escuro e um botão laranja; o rodapé mantém privacidade e segurança em um grupo próprio. A barra decorativa de progresso do cabeçalho foi retirada.

Os oito exemplos usam imagem ampliável, título, descrição curta, uma indicação de natureza/estágio e um link de detalhes. Foram retirados os rótulos repetidos, etiquetas com moldura e links duplicados por cartão. Títulos comerciais em português foram acrescentados sem mudar nomes dos repositórios, URLs ou conteúdo técnico dos projetos. Os filtros passaram a usar abas discretas. As referências técnicas continuam disponíveis em uma área recolhida. Nenhuma imagem aprovada foi modificada.

Na verificação de navegação foi encontrado um problema anterior: o CTA inferior de um caso abria um contato genérico. Ele agora leva o produto e o exemplo ao formulário. No navegador, partir de Precificação e vendas selecionou Planilhas e preencheu a referência na mensagem. Nenhum envio real foi realizado.

Validação: 17 testes Node, auditoria da fonte, build, auditoria da saída pública e `git diff --check` aprovados após a correção. Foram conferidas 15 combinações de viewport (360, 390 e 768 px) em home, exemplos, um produto, contratação e contato, sem overflow horizontal ou imagens carregadas quebradas. Os cinco filtros retornaram 1, 3, 2, 2 e 8 exemplos; a imagem ampliada carregou em 1440 px. Também foram verificados detalhes de projeto, acordeão de dúvidas e pedido contextual. Os viewports móveis são simulados em iframe, não aparelhos físicos; não há medição de conversão.

Registros visuais: `docs/qa/matriz-projetos-final-clean-20261109.jpg` e `docs/qa/matriz-home-final-clean-20261109.jpg`, da versão local validada. Backup anterior: `backup/pre-clean-presentation-2026-11-09`, commit `bef8a5cd5f230f555f576e802a737bfa5a95ada9`.

---

# Duas imagens de produto renovadas — 07/11/2026

A pedido do usuário, foram refeitas somente as prévias de Movimento (Sistemas para negócios) e Pricing & Sales Manager (Planilhas de controle). A primeira apresenta um ambiente de gestão de treinos, com ficha do aluno, tabela de exercícios, registro de séries e gráfico de evolução, sem o telefone desenhado. A segunda simplifica a planilha em uma tabela de custos, preços e margens, com gráfico comparativo e sugestão calculada de preço. As composições foram feitas por código e continuam identificadas como demonstrações, com dados fictícios.

Foram criados arquivos `-v2` em PNG e WebP lossless; os arquivos anteriores e as demais prévias foram preservados. As referências, legendas, textos alternativos e procedência foram atualizados na home, nas duas páginas de produto e nos exemplos correspondentes. O layout, a marca e as demais ofertas ficaram intactos.

Verificações: pares PNG/WebP com pixels RGBA idênticos e dimensões de 1440×900; custos e preços calculados pelo gerador; 17 testes, build e auditoria da saída pública aprovados. Inspeção visual das duas artes completas e da composição na vitrine. Home e duas páginas de produto verificadas em viewport de 390 px, sem overflow horizontal ou imagens carregadas quebradas. Ambas as imagens originais carregaram em 1440 px no visualizador do celular. Não houve alteração ou execução dos sistemas apresentados: são imagens demonstrativas.

Registro visual: `docs/qa/matriz-duas-previas-20261107.jpg`. Backup: `backup/pre-two-previews-2026-11-07`, commit `d4255ae7af6e29647bffbbb4ab653fef17e4eeab`.

---

# Apresentação visual dos quatro produtos — 07/11/2026

A vitrine da home usa quatro apresentações amplas, alternando texto e imagem no computador. A navegação inicial organiza as opções pela necessidade do cliente. Nome, benefício, descrição, recursos e próximo passo possuem hierarquia própria; as telas aparecem completas e podem ser ampliadas. O entorno de cada imagem distingue interface financeira, proposta de site, sistema e planilha, mantendo a marca, tipografia e cores da MATRIZ.

As quatro páginas de produto receberam título claro, apresentação visual maior, benefícios explicados e exemplos com miniaturas e estágio identificado. A contratação mantém as condições de escopo, investimento e suporte. A fonte dos textos continua em `content/products.json`; a função compartilhada de apresentação evita divergências entre home e páginas. As imagens aprovadas não foram alteradas.

Validação: `npm test` (17 testes), `npm run build`, `python3 tests/audit.py --dist` e `git diff --check` passaram. No navegador, home e quatro páginas de produto foram verificadas em 360, 390 e 768 px (15 combinações), sem overflow horizontal ou imagens carregadas quebradas. A checagem ignora a imagem sem fonte do diálogo fechado e não trata imagens lazy ainda não carregadas como falhas. Houve inspeção visual no computador e no celular, navegação pelos produtos, ampliação/zoom/fechamento e conferência do produto selecionado no contato. Nenhuma mensagem foi enviada. Os viewports de celular foram simulados em iframe; não equivalem a aparelhos físicos.

Registro visual: `docs/qa/matriz-produtos-design-20261107.jpg`, capturado da versão local validada. Backup: `backup/pre-product-design-2026-11-07`, commit `36640887ec26ab004fc1adcb860e407db30e498e`.

---

# Quatro produtos e revisão comercial — 06/11/2026

A apresentação comercial passou a conter exatamente quatro produtos: Sistema financeiro, Sites, Sistemas para negócios e Planilhas de controle. A fonte editorial é `content/products.json`; cada produto possui página própria, finalidade, exemplo visual, pontos de escopo e pedido de proposta contextualizado. Home, navegação, rodapé, comparação e contato usam os mesmos nomes.

A seleção comercial contém oito exemplos vinculados aos quatro produtos. DecisionForge, Curtailment e SICMA saíram dessa seleção; seus arquivos e URLs foram preservados, com noindex e fora do sitemap. Não houve exclusão de projetos ou modificação de seus repositórios. As sete imagens de demonstração aprovadas permanecem intactas; a arte social foi atualizada para os quatro produtos. Não foram criados preços, depoimentos, clientes ou garantias de resultado.

A revisão pela perspectiva de um pequeno empresário está em `docs/avaliacao-comercial-2026-11-06.md`. Ela distingue clareza de apresentação de evidência de funcionamento e registra pendências comerciais reais: preço, demonstração funcional, suporte e continuidade dos dados.

A contratação explica custos da entrega e recorrentes, prazo, suporte, acessos e dados. O formulário oferece os quatro produtos e uma opção de ajuda; parâmetros antigos de serviços são normalizados. Pedidos curtos e legítimos são aceitos: o mínimo da mensagem foi reduzido de 30 para 10 caracteres, de forma consistente no HTML e na validação. O catálogo e o texto principal passam a aparecer imediatamente, e foi corrigida a duplicação de contato no cabeçalho de computador.

Foi confirmado um erro de compatibilidade na publicação Railway: a 404 referenciava assets com prefixo `/matriz/`, que também devolviam 404. O servidor normaliza os prefixos e adapta links da página de erro, metadados e regras de robots para a raiz do domínio de produção. Dois testes cobrem a adaptação sem mudar os arquivos estáticos destinados ao GitHub Pages.

Validações automáticas: 17 testes Node; auditorias de links, anchors, semântica, conteúdo, hashes, marca, campos e metadados; 26 páginas HTML, 18 rotas indexáveis, quatro páginas de produto e oito exemplos comerciais. Build público separado de código, dados editoriais e testes.

Nesta rodada há revisão de navegador: home e páginas de produto no computador; sete páginas em viewport CSS de 390 px; home, sistemas e comparação em 360 e 768 px. As medições não apontaram overflow horizontal nem imagens carregadas quebradas. Verificações de navegação, menu móvel, filtros de exemplos, ampliação/zoom e preenchimento contextual do contato foram feitas na prévia local. Um envio com falha foi simulado no navegador, com endpoint externo bloqueado; produto, mensagem e botão habilitado foram preservados após a falha. Viewports em iframe verificam layout responsivo; não equivalem a aparelhos físicos ou a todos os navegadores.

O formulário real não foi usado para enviar mensagens. Testes de transporte são simulados. Não há métricas de conversão ou validação de resultados comerciais.

Backup anterior: `backup/pre-four-products-2026-11-06`, commit `745fba4b87935a805954ee644b457c24cbf48391`. A publicação existente em Railway foi preservada, assim como a publicação estática em GitHub Pages.

---

# Experiência do cliente e acabamento técnico — 14/10/2026

Revisão solicitada após a aprovação das seis prévias. A identidade visual e os pixels dessas imagens foram preservados. Foram identificados e corrigidos pontos concretos da experiência:

- Visualizador interno para as prévias e capturas, com zoom em tamanho natural, abertura do original, botão de fechamento, Escape nativo, recuperação do foco e mensagens de carregamento/falha. Cliques com modificadores e navegadores sem diálogo mantêm a navegação original.
- Menu móvel com bloqueio do conteúdo de fundo, foco circular, Escape e foco na seção de destino. Navegação e filtros têm alternativas quando JavaScript não executa. A seção da home em leitura pode ser indicada no menu.
- Validação do contato junto aos campos, inclusive abertura do grupo opcional quando o telefone é inválido. Contagem de caracteres, estado offline, retomada da conexão e prazo concreto de nova tentativa. Conteúdo já escrito é preservado diante de parâmetros de URL e falhas. A política de privacidade abre em outra aba para preservar a conversa.
- Canal alternativo de contato identificado pelo nome e pelo LinkedIn existente, sem inventar telefone, prazo de resposta ou atendimento.
- Logo do cabeçalho: 441.201 para 5.092 bytes (98,8% menos bytes nesse arquivo), mantendo o PNG oficial intacto. Logo maior, ícones e imagens responsivas possuem arquivos próprios. Não há medição de redução do tempo de carregamento; a seleção das variantes depende da largura e densidade da tela. Variantes maiores que o original foram omitidas.
- Arte de compartilhamento 1200×630 em fundo escuro, com a logo oficial e a mensagem existente. Metadados social/alt e ícones adequados; fontes críticas locais pré-carregadas. CSS e JS possuem versão pelo hash para evitar uso de versões antigas em cache.
- SICMA: removida a página antiga de Java/Spring Boot, que contradizia o registro e a prévia atuais. A página agora usa os dados do portal educativo já existentes no portfólio. Fontes de código foram mantidas dentro da área técnica recolhível.
- Breadcrumbs como navegação nomeada, links externos identificados para tecnologia assistiva, alvos de toque e espaços de foco, ajustes para cabeçalho estreito e diálogo com rolagem em telas baixas.

Validação: 14 testes Node passaram, incluindo cinco novos cenários de menu, visualização, campos opcionais, ausência de conexão, conteúdo preservado, falha, intervalo e reenvio confirmado. Requisições de contato foram simuladas; nenhuma mensagem real foi enviada. `npm test`, `npm run build`, `python3 tests/audit.py --dist` e `git diff --check` passaram. A auditoria agora também verifica fechamento de tags, fontes/arquivos, variantes responsivas, arte de compartilhamento, hashes e componentes do visualizador. Os arquivos públicos são separados do código e dos testes.

A arte social foi inspecionada visualmente. Esta rodada não teve QA de navegador: a capacidade control-browser não está disponível no ambiente gerenciado. Os testes de interação usam fixtures de eventos/DOM em Node e não substituem uma inspeção visual no navegador ou em aparelhos físicos. Não foi verificada a entrega real de mensagens pelo Web3Forms, nem a atualização do cache de cards em aplicativos de terceiros.

Backup: `backup/pre-client-experience-2026-10-14`, commit `ad193aa3d0bcabbf77f9b1538c93775073b2c2d0`.

---

# Seis prévias com composições próprias — 15/10/2026

O usuário pediu diferenciar as seis demonstrações comerciais, que repetiam a estrutura de cartões e painéis. Cada imagem agora apresenta uma atividade específica do produto:

- Pricing & Sales Manager: grade de precificação com entradas amarelas, custo por produto, seleção da célula e calculadora de margem.
- Sales Intelligence: relatório comercial com faturamento em destaque, ranking em colunas, participação por categoria e conferência dos valores. Os dados continuam sendo o CSV público do projeto.
- DecisionForge AI: bancada de exploração com dispersão por segmentos, qualidade dos registros e conversa ilustrativa com o assistente.
- Curtailment Intelligence: mapa esquemático das unidades, restrições horárias em barras empilhadas e cenário de bateria/carga flexível.
- Movimento: ficha de exercícios, séries e cargas ao lado de um celular com o registro da sessão do aluno.
- ClientFlow: calendário semanal em destaque e detalhe do atendimento, confirmação e orçamento do cliente selecionado.

As seis imagens foram inspecionadas individualmente e juntas. A imagem do SICMA permanece idêntica à versão anterior. As composições continuam identificadas como demonstrações; os dados e pontos de dispersão ilustrativos não representam capturas de aplicações em produção. SVGs são renderizados por código em PNG e WebP lossless, 1440×900. Os pares de formatos foram comparados em RGBA com pixels idênticos. Os custos, vendas, categorias, energia restringida e aproveitamento reconciliam.

A identidade, layout e comportamento do site foram preservados. Textos alternativos e procedência das seis imagens foram atualizados. `npm test`, `npm run build`, `python3 tests/audit.py --dist` e `git diff --check` passaram. Esta revisão não utilizou QA de navegador; a inspeção visual foi das imagens renderizadas e sua montagem comparativa.

A versão anterior está salva na branch `backup/pre-differentiated-previews-2026-10-15`, commit `d37c5dc2806a9e81428b980fe8029a90f2c940a0`. Os PNGs e WebPs anteriores podem ser recuperados dessa branch.

---

# Demonstrações visuais dos produtos — 14/10/2026

O usuário esclareceu que deseja construir exemplos visuais novos para apresentar os produtos, incluindo representações de planilhas e painéis, utilizando somente suas imagens. Esta rodada atende esse escopo com sete demonstrações autorais renderizadas por código em 1440×900.

- Pricing & Sales Manager: visual de planilha com custos de insumos, precificação, vendas, taxas, margem e gráficos.
- Sales Intelligence: visual de relatório em planilha com KPIs, ranking e tabela. As métricas usam o CSV público do projeto.
- DecisionForge AI: painel ilustrativo de indicadores, histórico, qualidade e segmentos.
- Curtailment Intelligence: geração, restrição e aproveitamento de energia em um cenário sintético.
- Movimento: alunos, acompanhamento de treinos e evolução de cargas.
- ClientFlow: agenda própria com clientes demonstrativos; substitui a referência de outro produto.
- SICMA Mathema: portal educativo e desafio de álgebra com resposta e explicação. Sua descrição foi atualizada conforme a nova `main`, revisão `b3b5816e9a7d6dc4ad89f0e6550a0b7123fb190c`.

As composições são SVGs renderizados em PNG e WebP lossless. Não foram realizadas capturas de navegador, nem criada uma nova planilha XLSX: as planilhas são representações visuais calculadas por código para uso como imagem, conforme solicitado. As legendas e a marca dentro de cada imagem identificam a demonstração. Não são apresentadas como screenshots da aplicação original, uso em produção ou resultados de clientes.

As sete imagens foram revisadas visualmente; foram corrigidos sobreposição do texto do SICMA, unidades de carga, espaçamento, referências da barra de fórmulas e soma do histórico do DecisionForge. Os totais de precificação e de vendas, e as quantidades do cenário energético, reconciliam no builder. PNG e WebP foram comparados em RGBA, com dimensões e pixels idênticos. As prévias exibem toda a composição e têm links para ampliar.

Todos os 11 projetos da seleção possuem imagem. Os gráficos originais de saída do Sales Intelligence permanecem na galeria da página. O builder, seus dados e hashes estão versionados e registrados em `docs/preview-provenance.json`.

---

# Prévias verificáveis — 14/10/2026

Foram inspecionados os cinco projetos sem imagem no portfólio. O Sales Intelligence recebeu dois gráficos produzidos pela execução original `python src/main.py --charts`, usando o arquivo público de demonstração. A origem é `csv-sales-analyzer` em `e31b131e63059265dcaa8adad44284fac7bffcb0`. As imagens são saídas do programa, identificadas como tal, e não screenshots do dashboard.

A prévia do card exibe a receita por produto sem cortar eixos ou títulos. A página do projeto também mostra unidades vendidas. Todas as prévias com imagem agora têm um link direto para ampliar o original. PNGs e WebPs possuem pixels idênticos, e os gráficos foram inspecionados visualmente.

Não foram inventadas telas para os demais projetos. O XLSX demonstrativo do Pricing & Sales Manager está truncado no próprio repositório: os bytes foram conferidos também pelo conector GitHub. Movimento, DecisionForge AI e Curtailment Intelligence não possuem capturas versionadas nas revisões consultadas, e a capacidade de captura em navegador continua indisponível. Esses projetos mantêm os diagramas existentes.

O estado anterior a esta atualização está salvo em `backup/previews-2026-10-14`, commit `f5dbbc4b96d4fa1a85361519c5211669598b3187`. Procedência e hashes constam de `docs/preview-provenance.json`.

---

# Revisão de apresentação e contato — 14/10/2026

## Resultado

A identidade foi preservada: arquivo oficial da logo sem alteração, fundo Carbon Black, superfícies Graphite, branco e tons Ember / Hot Ember. A home mantém “Seu negócio. Próximo nível.” e torna explícitos sites personalizados, sistemas financeiros e automação.

- Três frentes de serviço explicadas em linguagem de negócio.
- Seção financeira com a captura anonimizada do Finance Manager.
- Projetos com descrição da utilidade e estágio de desenvolvimento preservado.
- Exemplos de catálogo/pedidos, agenda/clientes, custos/precificação e painéis/relatórios.
- Portfólio visual com filtros independentes dos filtros de código.
- Perguntas sobre contratação, preço, prazo, celular e continuidade.
- Contato com categoria financeira, opção de orientação e contexto do interesse. Provedor e controles de envio preservados.
- Canonicals, URLs sociais, sitemap, robots, segurança e fallback da 404 corrigidos para `/matriz/`.
- Derivados WebP lossless das capturas; os PNGs e seus pixels foram preservados.

## Verificações

`npm test`, `npm run build` e `python3 tests/audit.py --dist` passaram. A auditoria cobre 22 páginas, 17 URLs indexáveis, 11 repositórios selecionados, links, anchors, metadados, CSP, assets, campos e o checksum da logo. Os nove testes Node cobrem contato, erros de transporte, timeout, categoria financeira, movimento reduzido e filtros do portfólio.

Os 22 documentos HTML também passaram em verificação de fechamento e aninhamento de tags. Os quatro WebPs foram comparados em RGBA aos PNGs de origem, com igualdade exata de todos os pixels.

Esta revisão não teve QA de navegador: a capacidade `control-browser` não estava disponível neste ambiente. Os breakpoints foram revisados no CSS, mas não foram medidos em um navegador nem em aparelhos físicos. Não foi enviado contato real ao Web3Forms. As capturas de QA de setembro abaixo documentam somente a versão antiga; não representam esta revisão. Não há métricas que comprovem aumento de conversão.

## Recuperação

`backup/portfolio-2026-10-14` preserva integralmente a versão anterior em `82a28c7984b38094eaca9db1d556e7c2e471d235`. O backup foi criado no GitHub antes das alterações. Uma recuperação pode ser publicada como um novo commit, preservando o histórico.

---

# Revisão final: limpeza, imagens e mobile — 09/09/2026

A limpeza inicial foi publicada na `main` em `302e4ff29b0bdb6508eebbd397beb9a694a87769`. Esta revisão aplica os novos materiais enviados pelo usuário e os achados visuais seguintes. Nenhum repositório dos projetos apresentados nem banco de dados foi modificado.

## Resultado atual

- 22 páginas HTML, 17 URLs indexáveis, 10 cases destacados e SICMA em desenvolvimento.
- Seleção comercial com 11 repositórios. Exercícios, forks e práticas introdutórias não aparecem; o inventário histórico continua disponível para auditoria.
- Nova logo PNG idêntica ao upload, verificada por SHA-256, em todos os usos da marca.
- Capturas fornecidas de Pata & Companhia e Nossas Delícias sem alterações. Finance Manager anonimizado; ClientFlow com referência visual Bolos & Massas, identificada no card e na página. Imagens ampliáveis e apresentadas antes da explicação do case.
- SICMA tem página própria e link para `GabrielSantanaBR/Sicma-JAVA`. A inspeção de 09/09 conferiu Java 17, Spring Boot e Gradle; a implementação do sistema ainda será enviada pelo autor.

## Validação desta revisão

`python3 tests/audit.py --dist` e os sete testes Node passaram. A auditoria cobre links, fragmentos, conteúdo selecionado, metadados, CSP, formulário, assets, marca e exclusão de código de teste do pacote público.

Foram registradas **20 medições** em `browser-checks-final-20260909.json`, sem overflow e sem imagens carregadas quebradas:

- Home: 360, 375, 390, 430, 768, 1024, 1366, 1440 e 1920 pixels.
- Home na seção de projetos: 360 pixels, com todas as capturas carregadas e a animação do hero pausada fora da tela.
- ClientFlow, Pata & Companhia, Finance Manager, SICMA, contato e portfólio: 360 pixels.
- Portfólio, SICMA, contato e Finance Manager: 1440 pixels.

A inspeção visual conferiu a nova logo, hierarquia do hero, botões lado a lado em 360 pixels, cartões com imagem, foco no link de ampliação e recortes. Capturas finais em `qa/matriz-final-*.jpg`. Medições no Chromium com viewports CSS; Safari, aparelhos físicos e leitores de tela não foram testados.

O menu mobile abriu e fechou com Escape. O filtro Backend apresentou apenas SICMA e Todos recuperou 11 itens. A navegação para o SICMA exibiu o link público correto. Os testes de movimento reduzido passaram; não houve emulação da preferência do sistema operacional.

A falha de contato foi simulada em uma rota local com submissão e rede externas bloqueadas, após conferir o indicador de simulador e a inicialização do formulário. O botão voltou habilitado com a seta decorativa preservada e oculta para tecnologia assistiva. Essa correção evita a perda de alinhamento que ocorria ao restaurar o texto após uma falha. A revisão atual não enviou mensagens externas; o registro abaixo mantém o ocorrido na primeira rodada.

A home prioriza necessidade, seleção visual e proposta, com animações leves. Não há métricas que comprovem aumento de conversão; esta revisão melhora apresentação e caminho de contato sem prometer vendas.

---

# Histórico: primeira reformulação MATRIZ

Rodada de 08–09/09/2026. A publicação parte do repositório existente; nenhuma aplicação de terceiros ou base de dados foi alterada.

## Integridade e conteúdo

- 21 páginas HTML, 18 URLs indexáveis, 25 itens no repertório e 10 projetos destacados.
- 26 repositórios públicos identificados; perfil excluído; dois forks e um repositório vazio sinalizados.
- 64 caminhos de evidência conferidos nos checkouts e branches indicados. Movimento foi inspecionado em `feat/mvp`.
- Auditoria de links locais e fragmentos, IDs, headings, landmarks, atributos de acessibilidade, metadados, sitemap e robots.
- URLs antigas e oito rotas `project.html?id=...` preservadas. Assets da 404 usam o prefixo real do GitHub Pages para funcionar em caminhos profundos.
- CSP restritiva, atributos seguros, limites do contato, fontes locais e padrões comuns de credenciais auditados.
- Os 114 paths da logo e sua pintura correspondem ao hash do SVG original. Ícones PNG e social preview têm as dimensões esperadas.

## Layout no Chromium

O painel de QA utiliza iframes com dimensões CSS exatas. A barra vertical ocupou 15 px; `scrollWidth` e `clientWidth` coincidiram em todas as 34 medições registradas em `browser-checks.json`.

| Viewport | Home | Projeto | Contato |
| --- | --- | --- | --- |
| 360×800 | Sem overflow | Sem overflow | Sem overflow |
| 375×812 | Sem overflow | Sem overflow | Sem overflow |
| 390×844 | Sem overflow | Sem overflow | Sem overflow |
| 430×932 | Sem overflow | Sem overflow | Sem overflow |
| 768×1024 | Sem overflow | Sem overflow | Sem overflow |
| 1366×768 | Sem overflow | Sem overflow | Sem overflow |
| 1440×900 | Sem overflow | Sem overflow | Sem overflow |
| 1920×1080 | Sem overflow | Sem overflow | Sem overflow |

Serviços, privacidade e a página 404 foram medidos em 360×800, 430×932 e 1440×900. A home também foi medida em 1024×768 para verificar o header e seu CTA. Fontes carregadas; nenhuma imagem carregada estava quebrada. A captura do Coffee Five utiliza lazy loading e foi conferida ao entrar na área visível.

O endereço deliberadamente inexistente foi bloqueado pelo navegador de QA, antes de permitir a inspeção de seu documento. O layout da 404 foi validado pela rota explícita e seus caminhos profundos pela auditoria de arquivos. A condição HTTP final depende da hospedagem.

## Interações

- Menu mobile: abrir, fechar, Escape, retorno de foco e ciclo com Shift+Tab.
- Link de repertório fecha o menu; filtro Dados mostra um resultado; Todos recupera os 25.
- CTA de projeto abre contato com categoria e contexto preenchidos.
- Validação de telefone e correção por teclado, preservando o restante do formulário.
- Respostas simuladas de erro, limite do provedor, bloqueio de repetição e sucesso com navegação para a confirmação.
- Sete testes Node: seis contratos do contato e um de reduced motion. Timeout e respostas inválidas são cobertos por transporte simulado.
- A preferência de movimento reduzido mantém contadores legíveis e evita agendar reveal/counter; a regra CSS desativa animações e transições. Não houve emulação de preferência do sistema operacional no navegador disponível.

## Formulário e achados corrigidos

A primeira tentativa com dados fictícios utilizou o POST nativo e foi aceita pelo Web3Forms. Esse teste não confirma recebimento na caixa de email. O carregamento do módulo de contato não se completou no ambiente de QA; o contato passou a usar um único script local gerado, sem dependências, cuja inicialização e tratamento de erro foram verificados.

Os cenários seguintes foram isolados: identificador fictício, `connect-src 'none'`, `form-action 'none'` e transporte simulado. Uma falha do mock não permite enviar mensagens externas. Esses controles de teste não entram no site publicado.

O ClientFlow externo apresentou erro de inicialização em uma sessão sem dados salvos (`clone` utilizado antes da declaração). O case foi corrigido para **Protótipo frontend**, com limitação explícita, e não anuncia demonstração funcionando. O repositório do ClientFlow não foi modificado.

## Revisão visual e contraste

Capturas em `qa/`: hero desktop 1440×900, mobile 360×800, menu mobile e página de projeto. Revisados alinhamento, hierarquia, proporção da logo, legibilidade, espaços, foco e navegação. A tipografia não recebe blur; a energia da marca fica concentrada na chama e nos destaques.

| Texto / superfície | Contraste calculado |
| --- | --- |
| Forge White / Carbon Black | 17,42:1 |
| Steel / Graphite | 5,85:1 |
| Texto secundário / Graphite | 8,31:1 |
| Texto da seção clara / Forge White | 6,34:1 |
| Carbon Black / Hot Ember | 8,41:1 |
| Label da faixa de contato / Hot Ember | 5,12:1 |
| Borda dos campos / Graphite | 3,53:1 |

Esses valores cobrem pares principais de cores, não constituem certificação de acessibilidade. A rodada usa Chromium e viewports CSS; aparelhos físicos, Safari e leitores de tela não foram testados. Mensagens da extensão interna do navegador não são erros dos scripts da MATRIZ.

## Gate de publicação

`tests/audit.py` e os testes Node devem passar antes da publicação. `scripts/build.py` gera `dist/`; `tests/audit.py --dist` inspeciona a saída efetivamente enviada. O workflow repete esses gates antes do deploy da `main`. A versão anterior está em `backup/pre-matriz-2026-09-07`.
