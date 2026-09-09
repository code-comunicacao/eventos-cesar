# Eventos CESAR

Site institucional de página única para divulgar os eventos internos da empresa: carrossel de banners, calendário de eventos agendados, painel de indicadores em tempo real, galeria de fotos por ano, formulário de solicitação de evento e a Política de Eventos (PDF).

Feito em HTML/CSS/JS puro — sem build, sem dependências. Basta hospedar os arquivos em qualquer servidor estático (GitHub Pages, Netlify, Vercel, S3, servidor interno da empresa etc.).

## Arquivos

```
index.html                → estrutura da página (use este pra publicar o site)
styles.css                → todo o visual (cores, tipografia, layout, responsivo)
script.js                 → carrossel, calendário, galeria, formulário
apps-script/Code.gs       → backend (Google Apps Script) que grava as solicitações no Google Sheets
documentos/                → PDFs linkados no site (ex.: Política de Eventos)
artifact-preview.html     → versão única e autocontida (CSS/JS/fontes embutidos) só pra visualizar rápido, offline, sem precisar de servidor — não é o arquivo pra publicar
README.md                 → este arquivo
```

## Trocar/atualizar a Política de Eventos

A seção **#politica** linka direto pro arquivo `documentos/Politica_Eventos_CESAR.pdf`. Pra atualizar:

1. Substitua o arquivo em `documentos/` mantendo o mesmo nome (ou troque o nome e ajuste os dois links em `index.html`, na seção `<!-- POLÍTICA DE EVENTOS -->` — um no botão "Abrir PDF completo" e outro no rodapé da seção).
2. Se as categorias/prazos do resumo em cards mudarem, edite o texto direto nos 4 blocos `.policy-card` da mesma seção.

## 1. Ver o site localmente

Abra `index.html` direto no navegador, ou sirva a pasta com qualquer servidor local (ex.: extensão "Live Server" do VS Code) para testar melhor o comportamento de `fetch`.

## 2. Trocar eventos, calendário e galeria por dados reais

Tudo fica no topo de `script.js`, nos objetos `EVENTS_DATA` e `GALLERY_DATA` — não precisa mexer no resto do código:

```js
const EVENTS_DATA = [
  { id: 'e1', date: '2026-09-10', time: '14:00', title: 'Workshop de Liderança',
    category: 'Treinamento', location: 'Sala Multiuso 2', description: '...' },
  // ...
];
```

- `date` sempre no formato `AAAA-MM-DD`.
- O calendário e a lista de "Próximos eventos" são gerados automaticamente a partir dessa lista.

```js
const GALLERY_DATA = [
  { year: 2023, title: 'Confraternização de Fim de Ano', month: 'Dezembro', icon: 'confetti' },
  // ...
];
```

## 3. Colocar fotos reais na galeria

Hoje a galeria usa um placeholder ilustrado (gradiente + ícone) no lugar de fotos reais. Pra usar uma foto de verdade, **é só adicionar `src` no item correspondente de `GALLERY_DATA`** (topo de `script.js`) — nenhum outro código precisa mudar:

1. Crie uma pasta `fotos/` no projeto e coloque as imagens lá (ex.: `fotos/2026/confraternizacao.jpg`).
2. No item da foto em `GALLERY_DATA`, adicione `src: 'fotos/2026/confraternizacao.jpg'`:
   ```js
   { year: 2026, title: 'Confraternização de Fim de Ano', month: 'Dezembro', src: 'fotos/2026/confraternizacao.jpg' },
   ```
3. Pronto — a foto aparece na grade e na visualização ampliada (lightbox) automaticamente. Itens sem `src` continuam mostrando o placeholder ilustrado normalmente.
4. Recomendado: exportar as fotos em WebP ou JPG otimizado (a maioria dos editores de imagem faz isso) para o site carregar rápido.

## 4. Trocar o carrossel de banners

Cada slide é um bloco `<article class="slide">` dentro de `index.html`, na seção `<!-- HERO / CARROSSEL -->`. Copie um bloco existente para adicionar um novo banner, ou edite o texto/data/local dos que já existem.

Os banners são feitos pra receber uma **foto de fundo em tela cheia** (com o texto sobreposto, como referência visual de fotos de pessoas/eventos). Cada slide já vem com uma linha comentada indicando o arquivo — é só descomentar e apontar pro seu arquivo:

```html
<!-- antes -->
<article class="slide">
  <!-- <img class="slide-bg" src="fotos/banners/confraternizacao.jpg" alt="" loading="lazy"> -->
  <div class="slide-scrim" aria-hidden="true"></div>
  <div class="slide-copy">...</div>
</article>

<!-- depois -->
<article class="slide">
  <img class="slide-bg" src="fotos/banners/confraternizacao.jpg" alt="" loading="lazy">
  <div class="slide-scrim" aria-hidden="true"></div>
  <div class="slide-copy">...</div>
</article>
```

- O `alt=""` é proposital: a foto é só ambientação por trás do texto, que já descreve o evento — não precisa de descrição própria.
- Mantenha a `<div class="slide-scrim">` sempre — é o degradê escuro que garante que o texto continue legível em cima da foto.
- Slide sem `<img class="slide-bg">` (como estão os 4 de exemplo agora) mostra só o fundo em gradiente — funciona bem como visual provisório até a foto entrar.
- Fotos com pessoas/ambiente do escritório, tiradas com boa luz, funcionam melhor que fotos muito escuras (o degradê já escurece bastante o lado esquerdo).
A foto preenche o círculo automaticamente (o CSS já cuida do recorte).

## 5. Conectar o formulário ao Google Sheets

O formulário envia os dados para um **Google Apps Script Web App**, que grava tudo numa planilha (e salva anexos no Drive). Passo a passo:

1. Crie uma planilha nova no [Google Sheets](https://sheets.new) — pode chamar de "Eventos CESAR — Solicitações".
2. No menu, abra **Extensões → Apps Script**.
3. Apague o código padrão e cole o conteúdo do arquivo [`apps-script/Code.gs`](apps-script/Code.gs).
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**.
   - Executar como: **Eu** (sua conta).
   - Quem pode acessar: **Qualquer pessoa**.
5. Autorize as permissões pedidas (acesso à planilha e ao Drive).
6. Copie a URL gerada (termina em `/exec`).
7. Abra `script.js` e cole essa URL em:
   ```js
   const CONFIG = {
     APPS_SCRIPT_URL: 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT',
     ...
   };
   ```
8. Teste enviando uma solicitação de verdade pelo site e confira se a linha aparece na aba **Solicitações** da planilha.

**Por que o site não mostra erro real do servidor?** O Apps Script não responde ao *preflight* de CORS por padrão, então o site envia em modo `no-cors`: o navegador não consegue ler a resposta. Por isso a tela de sucesso aparece sempre que a requisição sai sem erro de rede — o teste do passo 8 é o jeito de confirmar que está tudo realmente funcionando.

Enquanto a URL não for configurada, o formulário mostra um aviso pedindo pra concluir esse passo, em vez de fingir que enviou.

### Anexos

O campo de anexo aceita PDF, imagens e documentos até 5MB (limite ajustável em `CONFIG.MAX_FILE_MB` no `script.js`). Os arquivos são salvos numa pasta chamada **"Eventos CESAR — Anexos de solicitações"**, criada automaticamente no Google Drive da conta usada para publicar o Web App, e o link do arquivo é gravado na planilha.

### Campos do formulário

| Campo no site | Coluna na planilha | Observação |
|---|---|---|
| Nome, e-mail, departamento, tipo de evento, data, nº de convidados, descrição | mesmos nomes | obrigatórios |
| Local / sala desejada | `Local desejado` | lista fixa de salas (editável em `index.html`, campo `#fieldLocation`) — assim dá pra somar "salas mais reservadas" no painel |
| Orçamento estimado (R$) | `Orçamento estimado (R$)` | agora é numérico (não texto livre), pra dar pra calcular a média no painel |
| Coffee break | `Coffee break` | checkbox novo — grava "Sim"/"Não" |

## 6. Painel de indicadores em tempo real

A seção **#painel** mostra, a partir das solicitações recebidas: eventos por mês, salas mais reservadas, setores que mais pedem, média de convidados, prazo médio entre pedido e evento, quantos têm coffee break, quantos são da Diretoria e o orçamento médio.

- **Fonte dos dados:** o mesmo Web App do Apps Script (passo anterior) — o painel faz uma requisição `GET` nele e calcula tudo no navegador. Não precisa configurar nada além da `CONFIG.APPS_SCRIPT_URL` já usada pelo formulário.
- **Enquanto não há solicitações reais (ou a URL não está configurada)**, o painel mostra dados de exemplo (`DASHBOARD_DEMO_DATA` em `script.js`) com um aviso na tela — assim ele não fica vazio/quebrado antes do primeiro pedido real chegar. Edite ou apague esse array quando quiser.
- **Atualização:** automática a cada 5 minutos, mais um botão "Atualizar" manual. Não é *push* em tempo real (o Apps Script não suporta isso) — é uma releitura periódica, deixada clara pelo texto "Atualizado há X min".
- **Se a leitura falhar por CORS:** ao contrário do envio do formulário, a leitura (`GET`) do Apps Script geralmente funciona com `fetch` normal, sem precisar de `no-cors`. Se mesmo assim não funcionar na sua conta/organização, o painel cai automaticamente pros dados de exemplo e avisa na tela — o resto do site continua funcionando normalmente.

## 7. Personalizar marca (cores, logo, nome)

As cores e tipografia ficam centralizadas no topo de `styles.css`, no bloco `:root`:

```css
--orange: #FF6A1F;   /* cor principal */
--amber: #FFB648;    /* destaque secundário / script */
--bg: #0A0908;        /* fundo */
--off-white: #F7F2E9; /* texto e nav */
```

O nome "Eventos CESAR" aparece no `<title>` do `index.html`, no `.logo` do cabeçalho/rodapé e no rodapé — busque por "CESAR" pra trocar em todos os lugares de uma vez. Pra usar uma logo em imagem no lugar do texto, troque o conteúdo de `<a class="logo">`.

## 8. Publicar o site

Qualquer serviço de hospedagem estática funciona (não precisa de servidor Node/backend):

- **GitHub Pages** — suba os arquivos num repositório e ative Pages nas configurações.
- **Netlify / Vercel** — arraste a pasta do projeto direto na interface, ou conecte um repositório Git.
- **Servidor interno** — copie os arquivos pra qualquer servidor web (Apache, Nginx, IIS).

Não é necessário nenhum passo de build — os três arquivos (`index.html`, `styles.css`, `script.js`) já são o site final.

## Checklist antes de divulgar

- [ ] `CONFIG.APPS_SCRIPT_URL` preenchida e testada (uma solicitação de teste apareceu na planilha)
- [ ] Painel de indicadores conferido com dados reais (ou `DASHBOARD_DEMO_DATA` revisado/removido)
- [ ] Eventos reais em `EVENTS_DATA`
- [ ] Fotos reais na galeria (ou ao menos os placeholders revisados)
- [ ] Links de redes sociais no rodapé (`href="#"` → URLs reais)
- [ ] E-mail de contato real (`eventos@cesar.org.br` → e-mail real da equipe)
