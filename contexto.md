# Avaliação da Oficina de IA

Conversa completa exportada em 15/11/2026.

[Conversa original no ChatGPT](https://chatgpt.com/c/6aebbdaa-86dc-83e8-be2c-6ac376cd4277)

Mensagens de usuário e assistente em ordem cronológica. O conteúdo foi preservado, com adaptação dos blocos de escrita e do roteiro para Markdown. Os marcadores internos de citações do ChatGPT foram mantidos como constam no histórico.

## Mensagem 1 — Usuário

e pra essa: `Sobre o produto: A oficina busca resolver uma demanda real do IFRS Campus Osório.` curto, dessa vez

---

## Mensagem 2 — Assistente

Durante a oficina, desenvolveremos um sistema de uso interno para o IFRS Campus Osório, atendendo a uma demanda real da instituição: centralizar, gerenciar e acompanhar solicitações entre seus diferentes departamentos. O objetivo é demonstrar, na prática, a aplicação da engenharia de software aliada a agentes de IA, buscando entregar uma primeira versão funcional do produto ao final da atividade.

---

## Mensagem 3 — Usuário

me ajuda a completar: Para isso serão utilizados de técnicas de engenharia de software como: análise e levantamento de requisitos (funcionais e não funcionais), história de usuário, criação de *backlog* e tarefas bem definifdas par&#x61;*&#xA0;*&#x63;ada etapa do desenvolvimento, entre outras. Aliado a este processo, utilizaremos ferramentas de IA tais como: um kit de skills para desenvolver essas técnicas de SWE; browser nativo IA para avaliação, refação e refinamento de telas;

---

## Mensagem 4 — Assistente

Para isso, serão aplicadas técnicas e práticas de engenharia de software, como análise e levantamento de requisitos funcionais e não funcionais, elaboração de histórias de usuário, definição de arquitetura, adoção de padrões de projeto, criação e gerenciamento de *backlog*, organização de tarefas bem definidas para cada etapa do desenvolvimento, versionamento de código, testes automatizados e *code review*.

Aliadas a esse processo, serão utilizadas ferramentas de inteligência artificial, como um conjunto de *skills* especializadas para auxiliar na aplicação das práticas de engenharia de software; agentes de IA para implementação e execução paralela de tarefas; navegadores integrados à IA para avaliação, correção e refinamento de interfaces; além de ferramentas de integração com Git e GitHub para gerenciamento de *issues*, *pull requests* e *releases*.

O objetivo é demonstrar um fluxo de desenvolvimento estruturado, no qual a IA atua como ferramenta de apoio e execução, enquanto as decisões arquiteturais, os critérios de qualidade e a responsabilidade técnica permanecem sob supervisão humana, culminando na entrega de uma versão funcional de um produto real.

---

## Mensagem 5 — Usuário

fala chat, to pensando no roteiro do que vou dizer. Avalie e me de sugestões:

```text
IDEIAS PALESTRA/OFICINA: ALÉM DO VIBECODING

[ABERTURA]
- Me apresento, com meu linkeding e github aberto.
"Boa noite a todos, me chamo João Lucas, sou aluno do Superior ADS, sexto semestre. Atuo como desenvolvedor independente mais focado em desenvolvimento backend. Atualmente trabalho com projetos próprios no estilo desse que desenvolveremos hoje. Basicamente meu trabalho gira entorno de ouvir o cliente, entender as suas dores e o seu negócio. Utilizo técnicas de engenharia de software para transformar esse depoimento do cliente em requisitos de sistema, e, posteriormente, em um sistema de fato."

[PINCELA ASSUNTO PRINCIPAL]
- Faz leve introdução linkando o assunto anterior.
"Sempre atuei sozinho nos meus projetos, assim como a maioria daqui que já tenha tentado tocar algo, mas ultimamente ganhei um funcionário que é: mais acertivo que eu, mais rápido que eu e com certeza mais inteligente que eu: os agentes de IA."

[INTERAÇÃO COM O PÚBLICO]
- Leve provocação.
"Alguém aqui já teve alguma experiência, por mais superficial que seja, com ferramentas agênticas como: Claude, ChatGPT/Codex, Gemini ou algum outro?"
{Espera alguém responder e desenvolve um pouco, talvez pergunta o que fez, como fez e se sente que vibecodou em algum momento}

[AINDA COM O PÚBLICO]
- Continua na provocação.
"Já vi que temos contato com a IA, mas todo mundo sabe o que ela possibilita? Rapidez? Agilidade? Sim, de certa forma. Mas talvez você não tenha se dado conta de o que ela gera: Atrofia Cognitiva. Atrofia Cognitiva é basicamente o processo onde o nosso cérebro se acostuma, e relativamente gosta, de terceirizar o pensamento crítico e as decisões difíceis. Causa muito evidente dessa condição é o famoso termo no meio tech 'Vibe-Coding'".

[INTRODUÇÃO PROFUNDA NO TERMO DA PALESTRA]
- Aprofundação no termo técnico.
"Vibecoding possui alguns significados. Nos termos técnicos vibecodar seria codificar com o auxílio de inteligência artificial generativa onde codificamos utilizado comandos de linguagem natural ao invés de escrevermos de fato o código. Em tese não há um problema de fato com isso, aprendemos durante o curso sobre diversos níveis de codificação: baixo nível com C e C++ e alto nível com Java, Go e Python. Nessa hierarquia de níveis, o quão baixo estamos, mais próximos estamos do baremetal, de instruções de máquina mesmo, e quanto mais altos estamos, mais próximos à linguagem humana estamos. Tecnicamente falando, vibecodar seria o mais alto nível de codificação, um novo paradigma, segundo essa mesma teoria de níveis."

[PROSSEGUE NO APROFUNDAMENTO]
- Continua aprofundando.
"A parte prejudicial do termo surgiu em fevereiro de 2025, criado por Andrej Karpathy, fundador da OpenAI. O termo passou a ter força no surgimento da empresa Lovable - um sistema cuja premissa seria criar um site com base apenas em uma ideia. Por mais que Andrej não estivesse se referindo a esta empresa em específico, o termo tomou a área de desenvolvimento low/no-code. Ultimamente vibe coding refere-se ao processo de criar um sistema qualquer com dependência total da inteligência artificial generativa, sem audição ou conferência do código produzido."

[APRESENTA OUTROS PONTOS]
- Vibe codar pode não ser só não olhar para o código.
"Porém hoje em dia é relativamente incorreto ou depreciado dizer que vibe codar é meramente o fato de não observar o código. Existem inúmeras formas e processos de revisão de código, inclusive agêntica. Ou seja, você como desenvolvedor cria toda uma pipeline de produção onde um agente lê o contexto e codifica e outro agente faz o code-review, visando manter o padrão de qualidade de código com base em critérios pré-definidos. Esse desenvolvedor é um vibe coder? Eu não diria."

[APRESENTA CONCEITOS DE ENGENHARIA DE SOFTWARE]
- Por que esse desenvolvedor não é um vibe coder?
"Esse profissional apenas se moveu de escopo. Em grandes empresas, suas equipes possuem perfis bem definidos e hierárquicos, um exemplo seria uma empresa onde há: Product Owner -> Product Manager -> Tech Lead -> Desenvolvedor revisor, normalmente sênior -> Desenvolvedores menores. Nesse sentido, o desenvolvedor comum era quem recebia uma tarefa e a codificava até ficar pronta e mandava para alguém fazer o review. Agora é possĩvel como desenvolvedor subir um nível e delegar esse desenvolvimento bruto para o agente e se estabelecer como auditor, revisor e guia desse novo " funcionário"." 

[ESTEIRA DE PRODUÇÃO]
- Como criar essas pipelines de desenvolvimento?
"Para se adequar a esse novo processo de trabalho precisamos conhecer algumas palavrinhas chave:
- Spec-Driven-Development: você não delega para o seu desejo para a IA, você expecifica o que deseja que ela faça, com critérios de aceitação. ERRADO: Crie um sistema de autenticação com login e cadastro de usuários. CERTO: Implemente a funcionalidade conforme a especificação, que estabelece: - RF01: O usuário deve autenticar-se utilizando e-mail e senha. - RNF01: As senhas devem ser armazenadas utilizando Argon2id. - RN02: O e-mail deve ser único no sistema. - Critério de aceite: Credenciais inválidas devem retornar HTTP 401. - Arquitetura: Respeitar os limites definidos entre domínio, aplicação e infraestrutura.
- AGENTS.md: guia básico para seu agente. É aqui onde você estabelece como a IA deve se comportar quanto à arquitetura; quanto à dúvidas que ela pode vir a ter, logo aqui podemos indicar onde fica a documentação; quanto à boas práticas; code-reviews; e tudo quanto você espera que ela faça ou saiba quanto for codificar. É importante sabermos que esse arquivo é sempre lido ou carregado para o agente quando uma nova ação inicia no escopo daquele arquivo."

[CONTINUA NO ASSUNTO]
"- Documentação: aqui é onde o engenheiro de software realmente se destaca do 'pedreiro digital'. Uma boa documentação costuma envolver detalhes técnicos da aplicação, como: requisitos funcionais; requisitos não funcionais; diagramas de classe, de caso de uso; histórias de usuários; depoimentos e conversas com o cliente. Essa é a mais importante etapa que evita vibecodar, pois normalmente você sabe o que quer fazer, ou seja, você tem o depoimento, mas se não esmiuçar esse depoimento de forma técnica, o agente vai alucinar por falta de decisões"

[FOCO EM DECISÃO]
- Motivo do desenvolvedor existir.
"E essa é a palavra mais importante da noite: decisão. É a decisão que não podemos terceirizar para o agente. Enquanto desenvolvedores ainda somos responsáveis pelas decisões que tomamos no código ou no projeto. É na tomada de decisão que evitamos a Atrofia Cognitiva, ou parte dela pelo menos, escolher entre o caminho A e o caminho B com argumento que nos faz bons desenvolvedores, e não saber fazer um CRUD na mão."

[INTRODUÇÃO ÀS SKILLS]
- Como faço nos meus projetos para tomar boas decisões.
"Tomar decisões e anotá-las pode ser massante e complicado. Existem algumas skills que podem nos ajudar nesse sentido. Abrindo um parênteses aqui: skill é um conjunto de instruções prontas para o agente, basicamente. Ao invés de em todo chat dissermos: 'haja como um desenvolvedor sênior, escreva código ...' nós escrevemos essas instruções em um arquivo chamado SKILL.md e damos a ele um nome. Podemos chamar essa skill junto no prompt e dizer para o agente usar essa skill para a tarefa. 
Agora voltando, uso alguns conjuntos de skills do Math Pocock, do repositório chamado skills (mattpocock/skills), esse repo contém diversas skills e um plugin. Dessas skills destaco a 'grill-me', 'grilling' e 'grill-me-with-docs'. Esse é um conjunto poderoso para tomar decisões e montar uma boa documentação. No dia-a-dia você vai querer usar a 'grill-me-with-docs', essa skill utiliza os documentos que você possui no escopo da ação e lhe faz um questionário sobre o assunto do projeto. É um pouco diferente de modo plan dos modelos da OpenIA ou da Antropic pois são feitas perguntas voltadas para casos excepcionais e o agente aprende com as perguntas anteriores, formulando novas perguntas com base nas últimas respostas."

[CONTINUA NAS SKILLS]
- Aprendendo sobre escopo de skills.
"Ainda no assunto de skills, precisamos aprender sobre escopo de skill. Os agentes procuram skills em no mínimo dois escopos, na pasta do usuário '~/.agents' no linux ou 'C:\<usuário>\.agents', essa pasta é o escopo global, skills e AGENTS.md colocados aqui são carregados em todas as ações, skills como essas do Math podem ser colocadas aqui tranquilamente pois são bem vindas em qualquer ambiente. E existe os escopos locais do projeto, onde você cria o diretório .agents na raiz do projeto ou em outras subpastas desse mesmo projeto, essas skills são carregadas somente naquele projeto, aqui colocamos skills pertinentes somente àquele projeto que estamos trabalhando."

[VOLTA PARA TOMADA DE DECISÃO]
- Quanto usar ou procurar uma skill?
"Ter uma infinidade de skills não te garante um bom resultado. Em muitos casos quanto mais contexto o agente possui, mais ele tende a alucinar. Normalmente você como desenvolvedor deve escolher uma skill por algum motivo: quando estiver criando a documentação, busque skills que pesquisem sobre o produto e lhe questione sobre decisões; quando estiver desenvolvendo frontend use skills de gosto de UI, refinamento de telas e assim por diante. Caso não saiba, peça ao seu agente para pesquisar a skill certa para seu objetivo, ou até mesmo monte você mesmo."
```

.

---

## Mensagem 6 — Assistente

Pae, agora sim estamos falando de uma palestra com identidade própria. Li teu roteiro inteiro e vou avaliar como se eu fosse um professor de Engenharia de Software do IFRS assistindo à tua apresentação, mas também como alguém do público que nunca utilizou agentes de IA.

**Minha avaliação: 8,5/10 para o roteiro atual.** A construção narrativa está muito boa, a linguagem combina contigo e existem momentos de provocação que podem prender bastante a atenção. Mas eu faria algumas correções técnicas e mudanças na ordem dos assuntos.

O principal: **tu conseguiu construir um argumento, e não simplesmente uma apresentação sobre ferramentas.** Isso é excelente.

O roteiro começa com tua experiência, introduz os agentes, provoca uma discussão sobre dependência de IA, apresenta a necessidade de engenharia e chega às ferramentas que materializam essa proposta.

É uma progressão lógica.

O problema é que algumas afirmações estão imprecisas e, em determinados momentos, tu corre o risco de gastar tempo demais preparando o público para o que realmente veio ver: o desenvolvimento de um produto real.

## 1\. Avaliação geral da estrutura

| Parte | Minha avaliação | Ação |
|--------|--------|--------|
| Apresentação pessoal | Natural e objetiva | Manter |
| IA como funcionário | Excelente gancho | Ajustar uma frase |
| Interação inicial | Muito boa | Manter |
| Atrofia cognitiva | Provocativa, mas exagerada | Corrigir |
| Definição de vibe coding | Mistura conceitos diferentes | Reformular |
| Hierarquia profissional | Simplificação problemática | Reformular |
| Spec-Driven Development | Muito pertinente | Ampliar o exemplo |
| AGENTS.md | Ótimo assunto | Corrigir detalhes técnicos |
| Documentação | Um dos melhores trechos | Manter e fortalecer |
| Tomada de decisão | Melhor momento do roteiro | Dar mais destaque |
| Skills | Conteúdo essencial | Enxugar e demonstrar |
| Escopos de skills | Útil, mas específico demais | Explicar durante a demonstração |

Uma coisa importante: não estou avaliando teu estilo de falar como se fosse um texto acadêmico. É uma apresentação oral, feita por um aluno para outros alunos e professores.

**Eu preservaria teu jeito informal.** Não tentaria transformar isso numa palestra corporativa cheia de termos sofisticados. Só precisa existir precisão por trás da informalidade.

---

## 2\. A abertura está boa, mas teu segundo gancho pode ser ainda melhor

Tu escreveu\:

> "Ultimamente ganhei um funcionário que é mais assertivo que eu, mais rápido que eu e com certeza mais inteligente que eu: os agentes de IA."

Eu gostei bastante da construção. Tem humor, estabelece proximidade e introduz o tema.

Mas não diria que os agentes são mais assertivos ou inteligentes que tu. Isso contradiz parcialmente o argumento que tu vai desenvolver depois: o de que eles podem gerar soluções inadequadas e precisam de supervisão.

Eu mudaria para\:

> "Eu sempre trabalhei sozinho nos meus projetos. Mas ultimamente ganhei alguns funcionários. Eles não tiram férias, não reclamam das tarefas e conseguem escrever código numa velocidade muito maior do que eu. Só têm um pequeno problema: se eu não souber orientar e revisar o trabalho deles, eles podem fazer uma quantidade impressionante de besteira."

Isso prepara o terreno para o resto da palestra.

E abre uma oportunidade para uma frase que eu utilizaria mais adiante\:

**"O problema não é ter um funcionário que erra. É ter um funcionário que erra e um responsável que não sabe identificar o erro."**

Essa frase resume muito bem a filosofia que tu quer transmitir.

## 3\. Atrofia cognitiva: tua ideia é boa, mas cuidado com a ciência

Esse é o primeiro trecho que eu corrigiria obrigatoriamente.

Tu apresenta a atrofia cognitiva como uma consequência direta e evidente do uso de IA e trata vibe coding quase como sua manifestação.

Existe pesquisa sobre *cognitive offloading* — a transferência de esforço cognitivo para ferramentas externas — e sobre como a IA pode modificar o exercício do pensamento crítico.

Por exemplo, um estudo de 2025 da Microsoft Research e da Carnegie Mellon University, envolvendo 319 profissionais, identificou associação entre maior confiança na IA e menor exercício autorrelatado de pensamento crítico em tarefas assistidas por IA. Mas isso não demonstra que utilizar IA necessariamente provoque atrofia cerebral ou perda permanente de capacidade cognitiva. citeturn428143search12

Eu manteria a provocação, mas diria\:

> "Existe um risco que acompanha a adoção dessas ferramentas: a terceirização excessiva do esforço cognitivo. Em vez de utilizarmos a IA para potencializar nosso raciocínio, podemos começar a delegar decisões que deveríamos ser capazes de compreender e questionar. Isso pode reduzir nosso envolvimento crítico com o problema. E é aqui que entra uma discussão importante sobre o famoso vibe coding."

Percebe a diferença?

Tu continua provocando, só que sem transformar uma hipótese comportamental em diagnóstico científico.

Minha recomendação é usar **terceirização do pensamento crítico** como expressão central. É mais compreensível e mais diretamente ligada à tua proposta.

## 4\. Tua definição de vibe coding precisa de uma correção importante

Aqui eu discordo tecnicamente da formulação.

Tu diz que programar utilizando linguagem natural, em vez de escrever código, seria vibe coding e poderia representar um novo nível de linguagem de programação.

Essa comparação pode ser utilizada como analogia, mas não como uma classificação técnica estabelecida.

C e C++ não são simplesmente linguagens de baixo nível; são linguagens de alto nível com diferentes graus de proximidade dos mecanismos da máquina. Java, Go e Python também são linguagens de alto nível.

Além disso, o uso de linguagem natural para orientar um agente não funciona como uma linguagem de programação tradicional: não existe a mesma semântica formal e determinística.

**Programação assistida por IA não é automaticamente vibe coding.**

Na definição original popularizada por entity["people","Andrej Karpathy"], em 2 de fevereiro de 2025, uma característica central era aceitar o código gerado sem realmente acompanhá-lo ou compreendê-lo. citeturn428143search7turn428143search10

Eu trocaria tua explicação por algo assim\:

> "Podemos olhar para a programação assistida por IA como uma nova camada de abstração. Em vez de descrevermos cada instrução em uma linguagem de programação, passamos a expressar objetivos e restrições em linguagem natural, e um modelo transforma isso em código.
>
> Mas existe uma distinção importante: utilizar IA para programar não significa necessariamente praticar vibe coding. O termo surgiu para descrever uma abordagem em que o desenvolvedor se entrega ao fluxo de geração, aceitando resultados sem necessariamente compreender ou revisar a implementação."

Eu também retiraria a associação causal com a Lovable. A plataforma é um exemplo importante de desenvolvimento por linguagem natural, mas não foi a origem do termo.

E um pequeno ajuste histórico: Karpathy é **cofundador da OpenAI e ex-diretor de IA da Tesla**, não simplesmente fundador da OpenAI.

Essa correção é particularmente importante diante de uma plateia acadêmica.

## 5\. A parte sobre hierarquia profissional é a que eu mais reformularia

Tu escreveu\:

> "Product Owner → Product Manager → Tech Lead → Desenvolvedor revisor, normalmente sênior → Desenvolvedores menores."

Aqui existem dois problemas.

Primeiro, essa não é uma hierarquia universal. Product Owner e Product Manager podem ter responsabilidades sobrepostas, e Tech Lead não é necessariamente superior hierárquico de todos os desenvolvedores.

Segundo, o papel de um desenvolvedor não se resume a receber tarefas, escrever código e solicitar revisão. Desenvolvedores também participam de decisões arquiteturais, modelagem e definição de soluções.

Mas teu argumento principal está correto: **agentes permitem que um desenvolvedor individual execute parte do trabalho que antes exigiria uma equipe ou muito mais tempo.**

Eu diria\:

> "Em projetos maiores, normalmente temos responsabilidades distribuídas entre pessoas: alguém entende o produto, alguém organiza as prioridades, alguém define a arquitetura, desenvolvedores implementam funcionalidades e outros profissionais ajudam a garantir a qualidade.
>
> Quando trabalho sozinho, preciso assumir várias dessas responsabilidades. E é aqui que os agentes mudam meu fluxo: consigo delegar parte da implementação, dos testes e das revisões, enquanto concentro mais atenção na modelagem, nas decisões técnicas e na validação.
>
> Isso não significa que a IA substituiu uma equipe inteira. Significa que ela ampliou minha capacidade de execução."

Acho essa versão mais forte e tecnicamente defensável.

## 6\. A parte de SDD está muito boa — mas falta um detalhe fundamental

Teu exemplo de autenticação funciona muito bem para demonstrar a diferença entre uma solicitação vaga e uma especificação verificável.

Eu manteria.

Só acrescentaria que **Spec-Driven Development não significa simplesmente escrever prompts mais detalhados**\. A ideia é que a especificação seja um artefato estruturado que oriente implementação, testes e validação.

Por exemplo, no teu RF-01, além de definir Argon2id, unicidade do e-mail e HTTP 401, tu pode perguntar à plateia\:

"E o que acontece quando alguém erra a senha cinquenta vezes? E como revogamos uma sessão? E se o e-mail já estiver cadastrado?"

Essas perguntas demonstram que uma especificação aparentemente boa ainda pode conter lacunas.

Aí tu conecta naturalmente com a `grill-me`\.

**Essa transição seria excelente\:** mostrar um requisito incompleto, questionar o público e, depois, apresentar uma skill que ajuda a descobrir decisões pendentes.

## 7\. AGENTS.md e skills: alguns ajustes técnicos

Existem detalhes importantes aqui, principalmente porque tu vai apresentar ferramentas reais e alguém poderá tentar reproduzir os exemplos.

### AGENTS.md

Tua explicação conceitual está correta, mas eu ajustaria a questão do carregamento.

No Codex, o arquivo global padrão fica em\:

`~/.codex/AGENTS.md`

Já o `AGENTS.md` do repositório pode ficar na raiz ou em subdiretórios. O Codex combina as instruções aplicáveis, considerando o escopo e a hierarquia dos arquivos. O carregamento não deve ser descrito como uma releitura integral a cada ação individual; a descoberta ocorre normalmente no início da execução ou sessão. citeturn343519search0

Um detalhe que eu enfatizaria é a diferença entre\:

- `AGENTS.md`\: regras persistentes e convenções do projeto.
- `SKILL.md`\: procedimento reutilizável para uma atividade específica.
- ADR: registro de uma decisão arquitetural e sua justificativa.
- Issue: unidade de trabalho que precisa ser executada.

Essa distinção vai ajudar muito quem estiver começando.

### Skills e seus escopos

Eu também corrigiria tua afirmação de que os agentes procuram skills obrigatoriamente em `~/.agents` ou em `.agents` dentro do projeto.

Isso depende do agente.

No Codex, por exemplo, skills podem ser descobertas em `~/.agents/skills` e nos diretórios `.agents/skills` do repositório. Já o Claude Code utiliza, entre outros locais, `~/.claude/skills` e `.claude/skills`\. citeturn428143search5turn428143search2

Além disso, o agente normalmente descobre primeiro os metadados da skill e carrega seu conteúdo quando ela é selecionada. Não significa que todas as skills instaladas sejam integralmente adicionadas ao contexto em todas as tarefas. citeturn428143search9

Essa é uma ótima oportunidade para explicar *progressive disclosure*, ou carregamento progressivo de contexto.

E cuidado com esta frase\:

> "Quanto mais contexto o agente possui, mais ele tende a alucinar."

Eu reformularia para\:

**"Mais contexto não significa necessariamente melhor contexto. Informações irrelevantes, contraditórias ou desatualizadas podem prejudicar a execução da tarefa."**

O problema não é simplesmente a quantidade, mas a qualidade, a pertinência e a organização da informação.

### Sobre o Matt Pocock

Conferi também o material do Matt Pocock. Vale apresentar `grill-me` e `grill-with-docs` como ferramentas distintas: a primeira ajuda a questionar e amadurecer um plano; a segunda integra o questionamento ao contexto do repositório e ao registro de decisões e vocabulário. `grilling` funciona como mecanismo de entrevista compartilhado por outras skills. citeturn343519search5turn343519search9

Eu mostraria menos nomes e mais resultados.

Por exemplo, apresenta uma pergunta interessante que a skill fez durante tua preparação e explica como a resposta mudou uma decisão do projeto.

Isso ensina muito mais do que percorrer uma lista de dez skills instaladas.

---

## 8\. O melhor trecho do roteiro é o da tomada de decisão

Este trecho teu\:

> "E essa é a palavra mais importante da noite: decisão. É a decisão que não podemos terceirizar para o agente."

É o ponto mais forte de toda a apresentação.

Eu faria dele o momento de virada da palestra.

Até ali, tu estará discutindo os riscos e limitações de uma adoção pouco criteriosa da IA.

A partir dali, começa a apresentar tua solução: **a engenharia como forma de orientar, supervisionar e validar o trabalho dos agentes**\.

Eu só alteraria a parte final\:

> "Escolher entre o caminho A e o caminho B com argumento que nos faz bons desenvolvedores, e não saber fazer um CRUD na mão."

Conhecer implementação continua importante. Eu diria\:

> "O que diferencia um bom desenvolvedor não é apenas sua capacidade de implementar uma solução, mas sua capacidade de escolher, justificar e avaliar essa solução. A IA pode escrever um CRUD em segundos, mas alguém precisa saber se aquele CRUD deveria existir daquele jeito."

Essa frase te permite conectar imediatamente ao exemplo real do Teu Ponto, no qual tu identificou uma implementação questionável.

Esse caso merece aparecer na palestra, mesmo que brevemente.

---

## 9\. O que está faltando no roteiro

Até aqui, teu conteúdo está concentrado em contexto, engenharia de requisitos, instruções persistentes e skills.

Mas existem assuntos essenciais para tua proposta que ainda não aparecem no trecho enviado.

Eu acrescentaria quatro blocos, preferencialmente já durante a demonstração prática.

**Git e GitHub como ferramentas de coordenação**

Explicar como requisitos viram issues, issues entram no GitHub Projects, branches isolam o desenvolvimento e PRs permitem revisar e integrar mudanças.

---

**Orquestração e paralelismo de agentes**

Mostrar worktrees, dependências entre issues, contratos compartilhados e os problemas de integração que aparecem quando tarefas não são realmente independentes.

---

**Testes e revisão consciente**

Explicar TDD, critérios de aceite e revisão do código gerado. Também mostrar que a aprovação de outro agente não substitui a responsabilidade técnica humana.

---

**Entrega de software**

Demonstrar integração, validação, deploy e release, distinguindo uma funcionalidade implementada de uma versão efetivamente utilizável.

Eu não faria quatro novos capítulos teóricos. Apresentaria esses assuntos conforme fossem aparecendo no desenvolvimento.

Assim tu evita transformar a abertura em uma aula expositiva muito longa.

## 10\. Minha maior sugestão: começa o desenvolvimento mais cedo

Acredito que teu maior risco agora não seja técnico, mas de ritmo.

Li teu texto imaginando uma apresentação oral, com pausas, perguntas e demonstrações rápidas. Minha estimativa é que esse trecho já possa consumir aproximadamente **25 a 35 minutos**, dependendo da interação com o público.

E tu ainda nem apresentou efetivamente o sistema do IFRS.

Eu estabeleceria este orçamento de tempo para as três horas\:

## Divisão recomendada

Introdução e provocação

15 min

Conceitos, workflow e preparação

15 min

Desenvolvimento e explicações práticas

120 min

Integração, testes e revisão

20 min

Demonstração final e encerramento

10 min

Aos 30 minutos, idealmente, o público já deveria estar olhando para o repositório e vendo o início da execução.

E uma observação: esses 120 minutos de desenvolvimento não precisam ser duas horas de silêncio diante do terminal. É justamente o momento de explicar Git, skills, decisões de arquitetura, paralelismo e revisão enquanto acontecem.

---

## 11\. Como eu organizaria a narrativa completa

Eu preservaria a maior parte das tuas ideias, mas organizaria a palestra em cinco atos\:

1. **A provocação — "Ganhei um funcionário"**
   
   Tua experiência, o surgimento dos agentes e a interação com o público. Introduz o debate sobre vibe coding.
2. **O problema — "Quem está pensando?"**
   
   Terceirização de decisões, código gerado sem compreensão e o papel do desenvolvedor.
3. **O método — "Engenharia antes da implementação"**
   
   Requisitos, SDD, documentação, AGENTS.md, skills e decisões arquiteturais. Mostra o que foi preparado para a oficina.
4. **A execução — "Agora vamos construir"**
   
   Apresenta a demanda do IFRS, delega issues, orquestra agentes, utiliza Git e GitHub, demonstra validação e integração.
5. **O resultado — "Da especificação à release"**
   
   Demonstra o sistema, apresenta o que foi validado e explica o que ainda precisa ser feito, se houver pendências.

A transição entre o terceiro e o quarto ato poderia ser um dos momentos mais impactantes da apresentação\:

> "Até agora falamos sobre por que a IA não deveria tomar todas as decisões por nós. Também vimos como documentação, requisitos e arquitetura ajudam a orientar essas ferramentas.
>
> Mas falar é fácil. Agora quero mostrar se esse processo realmente funciona.
>
> Temos uma demanda real do IFRS Campus Osório, um repositório preparado, um backlog organizado e algumas horas para entregar um sistema utilizável. Vamos começar."

Eu gosto desse momento porque coloca tua própria metodologia à prova diante do público.

---

## 12\. Três recomendações que considero indispensáveis

**A primeira é não transformar a palestra numa defesa incondicional da IA.** Tu pode reconhecer que existem situações em que programar manualmente é mais rápido, seguro ou apropriado. Isso aumenta tua credibilidade, principalmente diante dos docentes mais céticos.

**A segunda é evitar tratar as tuas preferências como regras universais.** Nem todo projeto precisa de DDD, Clean Architecture, múltiplos agentes ou uma coleção extensa de skills. O público precisa entender os critérios para escolher essas abordagens.

**A terceira é fazer o público participar do teu raciocínio.** Antes de uma decisão arquitetural ou da decomposição de uma issue, pergunta o que eles fariam. Depois mostra tua escolha, a justificativa e a consequência prática. Isso reduz o risco de as pessoas saírem apenas querendo copiar teu setup.

---

## Veredito

Eu manteria aproximadamente 75% do roteiro que tu escreveu, corrigiria as imprecisões técnicas e encurtaria principalmente a discussão histórica sobre vibe coding e a explicação dos escopos das skills.

Teu texto já tem uma mensagem muito clara\:

**A IA pode ampliar a capacidade de execução de um desenvolvedor, mas não elimina a necessidade de conhecimento técnico, pensamento crítico e responsabilidade pelas decisões.**

E o que mais gosto é que tu não vai apenas afirmar isso. Vai tentar demonstrar na prática, construindo um produto solicitado pela própria instituição.

Só existe uma diferença entre uma boa palestra e uma excelente palestra nesse caso: fazer o público compreender **por que tu está fazendo cada coisa**, e não apenas ficar impressionado com a velocidade dos agentes.

Por fim, eu acrescentaria um fechamento conectando o resultado à tua abertura\:

> "Lembram que eu disse no começo que tinha ganhado alguns funcionários? Pois bem, eles escreveram boa parte do código que vocês viram hoje. Mas não foram eles que decidiram o que o IFRS precisava, quais regras o sistema deveria respeitar ou o que seria aceitável entregar.
>
> É aí que entra a Engenharia de Software.
>
> O objetivo não é formar desenvolvedores que sabem pedir código para uma IA. É formar desenvolvedores que sabem construir software e utilizar a IA para ampliar aquilo que conseguem realizar."

**Eu encerraria com essa mensagem, independentemente de a v1.0.0 ficar totalmente pronta ou não.** Ela fecha a narrativa, reforça o aprendizado e dá sentido à demonstração inteira.

---

## Mensagem 7 — Usuário

Cara, sendo sincero, convidei outros 2 colegas pra codificar junto. Então teremos 3 pcs trabalhando no projeto v.1.0.0, é 3x o processamento que estávamos nos preparando. Acho que sai tranquilo. Mas minha preocupação é o seguinte: dá tempo de fazer, mas não dá tempo de ficar encima do código, vamos dar uma boa documentação, mas seria massante ficar fazendo code-review. Além disso, terão alunos do 2 e 4 semestres, que não vão saber o que estamos fazendo, eles praticamente só sabem C ou tão sendo introduzidos à OOP com Java. Meio que o código não vai ser o principal, morou? E sim o produto pronto. Tecnicamente falando, o principal da palestra/oficina é falar como tomada de decisão é importante, como destrinchar um depoimento em documentação, quais skills são boas pra usar atualmente e como fazer um produto do 0, praticamente.

---

## Mensagem 8 — Assistente

Agora entendi completamente, pae. E vou te dizer uma coisa: **acho que tu está certo em não colocar o code review como protagonista da oficina.**

Eu estava avaliando tua proposta com uma expectativa de profundidade técnica maior do que a necessária para o público e para o objetivo que tu definiu.

Tu não está dando uma oficina de Go, arquitetura de backend ou qualidade de código. Está demonstrando **como transformar uma necessidade real em um produto de software, utilizando engenharia de software e agentes de IA como instrumentos de execução.**

São propostas diferentes.

## 1\. O código não precisa ser o protagonista

Com alunos do segundo e quarto semestres, ficar analisando ponteiros, interfaces, implementação de repositórios ou particularidades do garbage collector seria contraproducente.

Boa parte do público não teria o conhecimento necessário para acompanhar essas discussões.

Mas isso não significa que tu precisa superficializar a engenharia.

Na realidade, existe uma oportunidade didática muito interessante: praticamente qualquer aluno que já tenha desenvolvido um programa em C consegue compreender os problemas que tu pretende demonstrar.

Por exemplo\:

- Um requisito incompleto pode levar à implementação de um comportamento errado.
- Duas pessoas trabalhando na mesma funcionalidade sem coordenação podem gerar conflitos.
- Uma tarefa mal definida pode resultar em algo diferente do esperado.
- Um programa que compila não necessariamente atende às necessidades do usuário.
- Uma decisão arquitetural pode facilitar ou dificultar alterações futuras.

Nenhum desses conceitos exige conhecimento profundo de Go, Java, DDD ou arquitetura hexagonal.

**Tu pode ensinar raciocínio de engenharia sem ensinar os detalhes da implementação.**

Isso, inclusive, torna a oficina mais acessível sem diminuir sua qualidade.

## 2\. Três computadores mudam bastante a dinâmica

Ter três desenvolvedores trabalhando simultaneamente é uma vantagem significativa, principalmente se cada um tiver responsabilidades delimitadas.

Eu dividiria as funções assim\:

**Tu — apresentação e coordenação**

Explica as decisões, demonstra as ferramentas, acompanha o backlog e executa uma funcionalidade representativa com o público.

---

**Colega 1 — implementação de funcionalidades**

Trabalha em issues delimitadas, respeitando os contratos estabelecidos e integrando os resultados conforme os critérios definidos.

---

**Colega 2 — interface e integração**

Desenvolve as interfaces e acompanha a integração com os contratos da aplicação, além de auxiliar na validação dos fluxos.

Não precisa seguir exatamente essa divisão. O essencial é que tu não tenha que interromper a apresentação a cada cinco minutos para resolver algum problema dos outros dois.

Só tomaria cuidado com a expectativa de que três computadores significam exatamente o triplo da produtividade.

Existem dependências entre tarefas, conflitos de integração e custos de coordenação. Mas, com os contratos e a estrutura previamente definidos, o paralelismo pode aumentar bastante a capacidade de entrega.

E isso, por si só, já é um conteúdo excelente para a oficina.

## 3\. Sobre code review: eu mudaria o objetivo

Acho aceitável não fazer uma revisão detalhada de todas as implementações diante da plateia.

Mas distinguiria duas coisas\:

**Não demonstrar todo o processo de revisão** é uma escolha didática e de tempo.

**Não validar adequadamente o produto antes de disponibilizá-lo** é uma escolha de qualidade e risco.

Tu pode, por exemplo, explicar em três minutos\:

> "Em um ambiente profissional, cada alteração precisaria passar por um processo de revisão adequado. Hoje, como nosso foco é demonstrar o fluxo completo de construção, vamos utilizar testes automatizados, verificações de qualidade e revisões direcionadas aos pontos críticos. Uma revisão mais aprofundada será realizada fora da apresentação."

Isso é coerente e transparente.

Eu só não colocaria a v1.0.0 em operação institucional antes de validar os fluxos essenciais, especialmente autenticação, autorização e integridade dos dados.

E tu pode transformar a limitação em uma lição: saber o que ainda não está suficientemente validado também é parte do trabalho do engenheiro.

## 4\. O que eu priorizaria na tua apresentação

Considerando tudo que tu explicou, eu trabalharia com quatro grandes temas\:

**1\. Do depoimento ao requisito**

Mostrar como uma conversa com um cliente se transforma em RF, RNF, histórias de usuário e critérios de aceite. Aqui entra o `grill-me-with-docs`\.

**2\. Da necessidade à decisão técnica**

Explicar como definir arquitetura, tecnologias, restrições e padrões sem simplesmente aceitar as sugestões do agente.

**3\. Da documentação à execução**

Apresentar skills, AGENTS.md, issues, GitHub Projects, agentes e execução paralela das tarefas.

**4\. Da implementação ao produto**

Demonstrar as funcionalidades, validar os fluxos principais e explicar como a aplicação é integrada, versionada e disponibilizada.

Esse formato é muito mais fiel à tua intenção do que passar uma hora discutindo decisões internas de código.

## 5\. Eu faria uma mudança no teu roteiro: apresentar o produto mais cedo

Hoje, teu roteiro introduz vibe coding, atrofia cognitiva, SDD, documentação, AGENTS.md e skills antes de entrar na aplicação.

Eu faria o seguinte\:

Logo depois da apresentação pessoal e da provocação sobre agentes, apresenta a demanda do IFRS.

Algo como\:

> "Hoje, junto com outros dois colegas, vamos tentar entregar a primeira versão de um sistema de gerenciamento de solicitações internas para o IFRS Campus Osório. É uma demanda real da instituição.
>
> Mas antes de começarmos a programar, quero mostrar uma coisa: o trabalho de engenharia que já foi feito para que esses três computadores consigam desenvolver um produto de maneira coordenada.
>
> Afinal, não adianta colocar três pessoas e dez agentes trabalhando se ninguém sabe exatamente o que precisa ser construído."

Pronto.

Agora tudo que tu explicar — requisitos, documentação, skills, decisões, backlog — estará conectado ao produto que a plateia quer ver funcionando.

Isso é particularmente importante para os alunos dos primeiros semestres, que ainda não possuem repertório suficiente para compreender várias abstrações isoladamente.

## 6\. Uma oportunidade que tu talvez esteja subestimando

Tu disse que o principal é falar sobre tomada de decisão, documentação e desenvolvimento de um produto do zero.

Concordo.

Mas existe algo ainda mais interessante na presença dos teus dois colegas.

**Tu consegue demonstrar que agentes não eliminam a necessidade de colaboração e coordenação entre desenvolvedores.**

Três pessoas trabalhando no mesmo sistema precisam compartilhar uma compreensão do domínio, definir contratos, organizar tarefas e integrar mudanças.

É exatamente o mesmo problema que existe quando diferentes agentes trabalham em paralelo.

E essa conexão permite abordar engenharia de software de maneira prática, sem precisar explicar teorias complexas de organização de equipes.

Tu pode mostrar o GitHub Projects e dizer\:

> "Olhem essas issues. Cada uma representa uma unidade de trabalho. Não basta escrever o que queremos construir; precisamos definir quem será responsável, quais são as dependências e como saberemos que a tarefa foi concluída.
>
> Isso vale tanto para uma equipe de desenvolvedores quanto para uma equipe de agentes de IA."

É uma lição que os alunos poderão aplicar imediatamente nos trabalhos em grupo das disciplinas.

---

## Minha avaliação final dessa mudança

A presença de três desenvolvedores e teu esclarecimento sobre o público tornam a proposta mais coerente.

Eu deixaria de tentar ensinar *como revisar implementações complexas* e concentraria a oficina em **como organizar, orientar e avaliar um processo de desenvolvimento assistido por IA**\.

Mas quero te deixar com uma última recomendação.

**Não confunda mostrar um produto funcionando com demonstrar que o método funcionou.**

O sistema pronto será a prova visual mais impressionante da apresentação. Mas o aprendizado estará nas decisões que permitiram construí-lo.

Se tu conseguir fazer um aluno do segundo semestre sair pensando\:

"Antes de pedir para a IA implementar minha próxima atividade, preciso entender o problema, definir o comportamento esperado e saber como verificar se a solução está correta."

Então tu já terá transmitido uma competência extremamente valiosa.

E, se além disso vocês conseguirem entregar a v1.0.0, melhor ainda.

Aí não será apenas uma palestra sobre desenvolvimento com IA. Será uma demonstração concreta de como engenharia de software, colaboração humana e automação podem trabalhar juntas.

---

## Mensagem 9 — Usuário

tem como exportar essa conversa em .md?

---

## Mensagem 10 — Assistente

Tem sim, pae\! Encaminhei a tarefa para o **Codex**, que vai gerar um arquivo `.md` com o histórico da nossa conversa sobre a oficina **Além do Vibe Coding**\.

A ideia é preservar as mensagens na ordem original, incluindo teu roteiro, minhas avaliações, sugestões e blocos de código, em Markdown compatível com o Obsidian e o GitHub.

