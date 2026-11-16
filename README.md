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
| Abrir a janela do apresentador | N |

Os controles visíveis também funcionam por toque. O rodapé mostra a navegação,
a tela cheia e, nos dois exemplos automáticos, um botão de pausa opcional.
As notas e referências continuam editáveis em `slides.js`, fora da projeção.

## Janela do apresentador

A tecla N abre uma segunda janela, para o seu notebook, com a fala do slide
atual (campo `notes`), as indicações de palco entre colchetes, os avisos de
precisão (campo `check`), o próximo conteúdo, a contagem de revelações e um
cronômetro (clique ou T para zerar). As setas e os botões dessa janela controlam
a projeção. Se o navegador bloquear a janela, permita pop-ups para a página.
Funciona também no `apresentacao.html` único (a mesma página com `?presenter`).

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

## Verificação

Execute `node tests/check.cjs` para verificar o conteúdo, os fluxos de navegação,
os ciclos automáticos com relógio simulado, a limpeza dos timers e a geometria
do ajuste em duas dimensões. Não substitui revisão visual em navegador.

Para gerar novamente o HTML independente e o ZIP, execute
`python3 scripts/package.py`. A saída vai para `entrega/`.

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
