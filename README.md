# Além do Vibecoding

Apresentação web da oficina de IA aplicada de João Lucas, IFRS Campus Osório.
São 36 slides, baseados no roteiro fornecido, com a fala do apresentador e exemplos interativos.

Abra `index.html` no navegador. Não há instalação, build, CDN ou dependência de
internet. Os arquivos devem permanecer juntos, incluindo a pasta `assets`.
A versão `apresentacao.html`, quando empacotada, reúne tudo em um único arquivo.

## Controles

| Ação | Tecla |
| --- | --- |
| Revelar conteúdo ou avançar | Seta direita, Espaço ou Page Down |
| Recolher conteúdo ou voltar | Seta esquerda, Backspace ou Page Up |
| Primeiro / último slide | Home / End |
| Tela cheia | F |
| Pausar / retomar a demonstração automática | P |
| Abrir o apresentador numa janela | N |
| Abrir as perguntas | Q |

Os controles visíveis também funcionam por toque. O rodapé mostra a navegação,
a tela cheia e, nos dois exemplos automáticos, um botão de pausa opcional.
As notas e referências continuam editáveis em `slides.js`, fora da projeção.

## Apresentador no celular

`apresentador/` é a página para controlar a projeção pelo celular:
`https://joaolucasdasilvaoliveira.github.io/oficina-ia-aplicada-ifrs/apresentador/`.
Ela mostra o slide atual, a nota do slide, o próximo conteúdo, a contagem de
revelações e um cronômetro (dois toques zeram). Os botões Voltar e Avançar e a
lista de slides mandam comandos pelo Firebase (`comando`), e a projeção executa
cada um uma vez. A página mantém a tela do celular acesa. Não tem login: quem
souber o endereço consegue controlar os slides. No notebook, a tecla N abre a
mesma página numa janela.

As notas (campo `notes` de `slides.js`) são o texto do roteiro
(`IDEIAS PALESTRA OFICINA.txt`), com duas correções: Fortran (trocado por C) e
"Coordenações de Curso". Slides que não estão no roteiro trazem uma fala marcada
como sugestão. Termos entre `**` aparecem em destaque e indicações entre
colchetes, em vermelho.

Os slides 21 e 31 alternam suas opções a cada 3 segundos. A troca de slide
encerra o ciclo; voltar a ele reinicia a primeira opção. A troca de aba pausa
o ciclo até a apresentação voltar a ficar visível. Movimento reduzido troca
os deslocamentos por um fade curto, mantendo a alternância do conteúdo.

O tema é sempre claro, independentemente da preferência de tema do sistema.
O layout mede a área disponível e reduz proporcionalmente o conteúdo quando
necessário, sem barras de rolagem e sem cortar o conteúdo. Telas muito pequenas
podem deixar o texto menor; para projetar, prefira a orientação horizontal.

## Editar

- `slides.js`: conteúdo, notas, referências, IDs e termos por slide.
- `styles.css`: layout, cores, tipografia e adaptação para celular.
- `app.js`: navegação, revelações e demonstrações.
- `assets`: fontes Open Sans e licença OFL, gerador de QR code e foto do slide 2.
- `glossario.js` e `dicionario/`: o dicionário do público.

Os exemplos de requisitos do produto são identificados como propostas a validar.
O exemplo de referência/cópia é uma simulação em JavaScript do caso didático em Go.
As notas registram ajustes de precisão feitos em relação ao roteiro.

## GitHub Pages

Publique a pasta com `index.html` na origem escolhida nas configurações de Pages
do seu repositório. Os caminhos são relativos e funcionam em um endereço como
`https://usuario.github.io/repositorio/`. Esta entrega não fez commit, push ou deploy.

## Dicionário do público

`dicionario/` é uma página estática para celular, com os termos de cada slide
explicados (definições em `glossario.js`, termos por slide no campo `terms` de
`slides.js`). Ela tem busca (aceita sinônimos, como "edge case"), navegação por
slide e uma lista de A a Z. O endereço guarda a consulta: `dicionario/#<id>`
abre os termos do slide com esse ID, e `dicionario/#termos` abre a lista toda.

O dicionário traz só termos técnicos que os primeiros semestres ainda não viram
(os marcados no roteiro e outros do mesmo tipo). Na apresentação, o slide 3 mostra
o QR code grande do dicionário. Nos slides com termos técnicos, um QR pequeno no
canto inferior esquerdo abre os termos daquele slide; nos demais, ele não aparece.
O slide 2 traz QR codes do GitHub e do LinkedIn. Os QR codes são gerados no
navegador por `assets/qrcode.js` (qrcode-generator 1.4.4, de Kazuhiko Arase,
licença MIT), sem internet.

Os endereços ficam em `WORKSHOP_LINKS`, no início de `slides.js`. O endereço
do dicionário assume a publicação em
`https://joaolucasdasilvaoliveira.github.io/oficina-ia-aplicada-ifrs/dicionario/`.
Se o repositório tiver outro nome, troque ali e os QR codes se ajustam sozinhos.
Para incluir um termo, adicione-o a `terms` no slide e a definição em
`glossario.js`; o teste falha se faltar uma definição ou se sobrar uma sem slide.

## Modo ao vivo e perguntas

A apresentação e o dicionário conversam por um Firebase Realtime Database
(endereço em `WORKSHOP_LINKS.firebase`, no `slides.js`), direto por HTTP, sem
biblioteca e sem login. As regras do banco estão em `docs/firebase-regras.json`:
só o slide atual (`ao-vivo`) e as perguntas (`perguntas`) ficam abertos, e no
formato certo. Sem login, quem tiver o link pode ler as perguntas ou mudar o
slide atual; esse risco foi aceito para a oficina.

- **Modo ao vivo:** a cada troca de slide, a apresentação grava o slide atual.
  O dicionário consulta a cada 1 segundo e segue a apresentação. Navegar,
  buscar ou trocar de aba desliga o modo; o botão "Ao vivo" religa e volta ao
  slide atual.
- **Perguntas:** na primeira visita, o dicionário pede o nome do participante
  (fica no navegador). Tocar num termo abre a pergunta sobre ele; "Fazer uma
  pergunta", no topo, abre a pergunta livre. Depois do envio, aparece só
  "Pergunta enviada".
- **No projetor:** o botão "?" no canto superior direito mostra, em vermelho,
  quantas perguntas não foram lidas. Cada pergunta nova aparece num card no
  centro inferior, que sobe e some em 5 segundos (em fila, se chegarem várias).
  O "?" ou a tecla Q abre a lista, em ordem de chegada, com as não lidas em
  destaque. Clicar numa pergunta abre o texto inteiro e a marca como lida.

Sem internet, a apresentação funciona normalmente, só sem o modo ao vivo e as
perguntas. Os termos usados aqui estão em `CONTEXT.md`.

## Verificação

Execute `node tests/check.cjs` para verificar o conteúdo, os fluxos de navegação,
os ciclos automáticos com relógio simulado, a limpeza dos timers e a geometria
do ajuste em duas dimensões. Não substitui revisão visual em navegador.

Para gerar novamente o HTML independente e o ZIP, execute
`python3 scripts/package.py`. A saída vai para `entrega/`.

Antes de publicar no GitHub Pages, execute `python3 scripts/versionar.py`. Ele
coloca `?v=<hash>` no endereço de cada CSS e JS das páginas (apresentação,
dicionário e apresentador), para o navegador
não misturar arquivos novos com antigos guardados em cache (o Pages manda
guardar por 10 minutos). O teste falha se alguma versão estiver desatualizada.

## Identidade visual

Cores hexadecimais do Manual de Aplicação da Marca IF, edição 2015, página 14:
verde `#2F9E41`, vermelho `#CD191E` e preto `#000000`. Branco `#FFFFFF` é a base.
O verde escuro `#216F2E` é uma derivação para contraste de textos menores,
e `#237A32` é a derivação dos fundos verdes com texto branco. Essas derivações
não são cores oficiais da marca. A apresentação não redesenha o logotipo.

O manual traz valores RGB impressos que não coincidem exatamente com seus
hexadecimais; esta implementação usa os hexadecimais publicados. Open Sans é
a família indicada pelo manual para textos e materiais de divulgação.

[Manual oficial no acervo do IFRS](https://memoria.ifrs.edu.br/wp-content/uploads/sites/4/tainacan-items/5012/94893/ADMEC_00408.pdf)
