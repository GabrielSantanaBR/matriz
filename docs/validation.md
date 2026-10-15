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
