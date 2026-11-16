# Direção visual

Apresentação para projeção em uma oficina de ADS com alunos dos anos iniciais.
A função dos slides é apoiar a fala e permitir pausas para perguntas e exemplos.

## Tokens

| Papel | Valor |
| --- | --- |
| Verde oficial IF | `#2F9E41` |
| Vermelho oficial IF | `#CD191E` |
| Branco | `#FFFFFF` |
| Texto principal | `#151915` |
| Verde para texto menor | `#216F2E` |
| Fundo verde com texto branco | `#237A32` |
| Texto secundário | `#566056` |

Em fundo branco, os títulos de slide usam o verde oficial (sempre em corpo grande)
e os rótulos menores (subtítulos, etapas de fluxo, nomes de arquivo) usam o
verde escuro. O corpo do texto continua na cor principal.

Open Sans regular e bold, distribuídas localmente. Títulos grandes e alinhados
à esquerda, corpo curto e espaços amplos. Código em fonte monoespaçada do sistema.

## Composição

Capa tipográfica, slides de pergunta, comparações em duas colunas, sequências
de trabalho e exemplos de código. Verde pleno marca as transições conceituais;
vermelho pontua o título e o progresso. Não usar grids de cartões como padrão.

O rodapé se limita à navegação, tela cheia e pausa opcional das demonstrações.
A fala e os avisos ficam na janela do apresentador (tecla N), que não é projetada.
Não há sidebar, ajuda, notas projetadas ou instrução de navegação. Os slides
continuam sob controle do apresentador; só as opções dos exemplos 21 e 31
alternam automaticamente, a cada 3 segundos. Os destaques vermelhos são
seletivos e ficam em fundo branco. Em fundo verde, todos os textos são brancos.

## Revisão da proposta

As sugestões iniciais da busca de design eram voltadas a landing pages e CTAs.
Esse padrão foi descartado: a estrutura é de apresentação, com uma ideia central
por slide. A proposta violeta foi substituída pela identidade solicitada do IF.
O alinhamento à esquerda favorece leitura no projetor; o contraste é tratado
com uma derivação escura do verde para texto pequeno.

## Interação e acessibilidade

Navegação por teclado e botões, foco visível e áreas de toque com pelo menos 44px.
As revelações ficam fora da árvore acessível até serem exibidas. Controles de
exemplos preservam a ação nativa de Espaço/Enter. Os exemplos podem ser pausados
com P; a troca de slide cancela os timers. O tema permanece claro mesmo quando
o usuário prefere tema escuro.

A área do slide ocupa o espaço entre cabeçalho e rodapé. O conteúdo adapta as
colunas à largura e é medido após renderização, carregamento das fontes,
mudança de tamanho e troca de exemplo. Uma escala uniforme ajusta o conteúdo
completo à largura e altura disponíveis, sem rolagem ou cortes.

Os slides 14 e 15 são cenas em 3D feitas só com CSS (perspectiva e
preserve-3d), sem biblioteca. A casa se monta uma etapa por vez, no ritmo do
apresentador. Primeiro, a câmera mostra de cima a planta (cômodos e cota)
sendo desenhada no chão. Depois desce para a perspectiva: a fundação e as
fiadas de parede sobem, o telhado desce, janelas e porta aparecem e a vistoria
marca três verificações. Na entrega, as luzes acendem, a bandeira v1.0.0 se
abre e a câmera gira um pouco. O prédio empilha andares sobre a mesma fundação
(monólito modular); o condomínio traz casas independentes ligadas por uma rua
(microsserviços). Cada peça declara `data-part`, `data-anim` e `data-delay`; as
peças 3D animam só transform, porque opacidade achataria o 3D. Com movimento
reduzido, a câmera não transita e as peças aparecem sem animação.

Cada slide entra em peças: título, colunas, linhas e itens aparecem em sequência,
com opacidade e deslocamento de 40px por 560ms e intervalo de até 70ms entre
peças (a sequência inteira cabe em cerca de 1s). Avançar entra pela direita,
voltar pela esquerda; saltos (Home, End, link) sobem 24px no lugar. Revelações
sobem 20px em 420ms e, ao recolher, apagam em 160ms. O deslocamento usa
`translate`, independente da escala que enquadra o conteúdo, e o ajuste de
escala espera a entrada terminar. A troca entre fundo branco e verde leva
360ms, a barra de progresso desliza em 480ms e os botões cedem ao toque.
As trocas automáticas usam somente opacidade por 260ms, mantendo a leitura
estável. A curva de entrada é cubic-bezier(0.23,1,0.32,1). Com preferência por
movimento reduzido, tudo vira um fade de opacidade de 200ms, sem deslocamento
nem sequência. Não há bibliotecas de animação ou recursos remotos.

## Dicionário e QR codes

O slide 3 existe só para o QR code do dicionário. Nos demais, um QR pequeno no
rodapé, à esquerda, abre os termos daquele slide; ele usa correção de erro L
para ficar menos denso e foi conferido com leitor de QR. O dicionário segue a
mesma identidade (Open Sans, verde e vermelho do IF), em uma coluna para
celular, com a barra de troca de slide fixa no topo durante a rolagem.
