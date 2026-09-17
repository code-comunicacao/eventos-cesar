# Eventos CESAR

Site institucional de página única para divulgar os eventos internos da empresa: carrossel de banners, calendário de eventos, painel de indicadores em tempo real, galeria de fotos por ano, solicitação de evento e a Política de Eventos (PDF).

Feito em HTML/CSS/JS puro — sem build, sem dependências. Basta hospedar os arquivos em qualquer servidor estático (GitHub Pages, Netlify, Vercel, S3, servidor interno da empresa etc.).

## Arquivos

```
index.html                → estrutura da página (use este pra publicar o site)
styles.css                → todo o visual (cores, tipografia, layout, responsivo)
script.js                 → carrossel, calendário, painel, galeria — tudo
documentos/                → PDFs linkados no site (ex.: Política de Eventos)
artifact-preview.html     → versão única e autocontida (CSS/JS/fontes embutidos) só pra visualizar rápido, offline, sem precisar de servidor — não é o arquivo pra publicar
README.md                 → este arquivo
```

## 1. Ver o site localmente

Abra `index.html` direto no navegador, ou sirva a pasta com qualquer servidor local (ex.: extensão "Live Server" do VS Code) para testar melhor o comportamento de `fetch`.

## 2. Calendário e Painel de Indicadores — planilha do Google Sheets

O Calendário e o Painel de Indicadores **não têm mais eventos fixos no código**. Os dois leem, ao vivo, a mesma planilha "EVENTOS CESAR" no Google Sheets:

```
https://docs.google.com/spreadsheets/d/1qxzUKS4H0tP7xTH0F5OLUwMTfJXBkupujzhf2n4j46I/edit
```

Qualquer linha nova adicionada lá aparece no site sozinha — não precisa editar nada aqui. O site atualiza sozinho a cada 5 minutos (`CONFIG.EVENTS_REFRESH_MS` em `script.js`), e tem um botão "Atualizar" manual no painel pra forçar na hora.

### Como a planilha precisa estar organizada

O site lê a **primeira aba** da planilha (a exportação usa `gid=0`) e procura a linha de cabeçalho pelo texto `Status` na primeira coluna — pode ter uma linha de título acima, sem problema. As colunas usadas, pelo **nome** (a ordem pode mudar, os nomes não):

| Coluna | Uso no site |
|---|---|
| `Status` | Só aparecem no site linhas com `Concluído`, `Confirmado` ou `Previsto`. `Suspenso` e `Sem data` nunca aparecem publicamente. |
| `Categoria` | Etiqueta do evento (ex.: Evento, Hackaton, Palestra) e uma das listas do painel. |
| `Evento` | Título. Linha sem título é ignorada. |
| `Horário` | Texto livre (ex.: "09h00", "08h às 13h") — mostrado como está. |
| `Início` | Data no formato `DD/MM/AAAA`. Linha sem data válida é ignorada (não tem como colocar no calendário). |
| `Fim` | Se diferente de `Início`, o evento marca todos os dias do intervalo no calendário. |
| `Local` | Prédio/espaço (ex.: "CESAR Moinho"). Base da lista "Locais mais usados" do painel. |
| `Sala` | Combinado com `Local` na exibição (ex.: "CESAR Moinho — Risoflora"). Valores tipo "?", "Não definido" são tratados como vazio. |
| `Cluster` | Eventos com `Board` contam pro indicador "Ligados à Diretoria". |
| `Esforço` | Eventos com `Alto` contam pro indicador "Esforço alto". |
| `Estratégico` | `TRUE`/`FALSE` — conta pro indicador "Estratégicos". |
| `Público`, `Responsável` | Viram a descrição curta do evento (mostrada ao clicar num dia do calendário). |
| `Galeria` | Links de foto do evento — veja a seção seguinte. |

Colunas extras na planilha (`Nº Zeev`, `Tipo`, `Blueprint`, `Observações` etc.) são ignoradas — pode manter à vontade.

### Coluna "Galeria" — fotos que aparecem na seção Galeria de momentos

Cole na célula um ou mais links de foto (`http://` ou `https://`) — pode separar por vírgula, ponto e vírgula, espaço ou quebra de linha (Alt+Enter dentro da célula), como preferir. O site extrai qualquer link que encontrar na célula, não importa o separador.

- Cada link vira uma foto na Galeria, no **ano da data de Início** do evento, com o **título do evento** como legenda.
- Linha sem nada na coluna `Galeria` simplesmente não aparece lá — não precisa preencher todo mundo.
- Isso **soma** com as fotos já cadastradas manualmente em `GALLERY_DATA` (topo de `script.js`) — não substitui. Pra editar/remover essas fotos manuais (as de 2023–2024, por exemplo, que não têm evento correspondente na planilha), continua sendo direto em `script.js`.
- Os links precisam apontar direto pra imagem (terminando em `.jpg`, `.png` etc., ou qualquer URL que devolva uma imagem) — um link de uma pasta do Google Drive ou de uma página não funciona como `<img>`. Fotos hospedadas no Brevo/Mailinblue (como as que já estão em `GALLERY_DATA`) funcionam bem.

### Se quiser trocar de planilha

1. Deixe a planilha nova compartilhada como **"Qualquer pessoa com o link → Leitor"** (Arquivo → Compartilhar → Acesso geral).
2. Pegue o ID dela na URL (a parte entre `/d/` e `/edit`).
3. Em `script.js`, atualize:
   ```js
   const CONFIG = {
     EVENTS_SHEET_URL: 'https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/gviz/tq?tqx=out:csv&gid=0',
     ...
   };
   ```

   **Importante:** use exatamente esse formato de URL (`/gviz/tq?tqx=out:csv&gid=...`), não a URL de "Exportar → CSV" que o Google Sheets mostra no menu (`/export?format=csv&gid=...`). As duas baixam o mesmo conteúdo, mas só a `/gviz/tq` responde com o cabeçalho de CORS que permite o navegador do visitante ler o resultado — com a outra, o site funciona em testes locais (Node, curl) mas fica travado em qualquer navegador real.

### Se a planilha não puder ser lida

Sem internet, permissão errada, ou o link mudou — o Calendário e o Painel caem automaticamente pra uma lista pequena de exemplo (`EVENTS_DEMO_DATA` em `script.js`) e mostram um aviso amarelo na tela explicando isso. O resto do site continua funcionando normalmente.

## 3. Colocar fotos reais na galeria

Hoje a galeria usa um placeholder ilustrado (gradiente + ícone) no lugar de fotos reais. Pra usar uma foto de verdade, **é só adicionar `src` no item correspondente de `GALLERY_DATA`** (topo de `script.js`) — nenhum outro código precisa mudar:

1. Coloque a imagem em algum lugar acessível pelo site (uma pasta `fotos/` no projeto, ou um link de uma imagem já hospedada, tipo Brevo/Mailinblue — já é assim que as fotos atuais funcionam).
2. No item da foto em `GALLERY_DATA`, adicione `src: 'caminho-ou-link-da-foto.jpg'`:
   ```js
   { year: 2026, title: 'Confraternização de Fim de Ano', month: 'Dezembro', src: 'fotos/2026/confraternizacao.jpg' },
   ```
3. Pronto — a foto aparece na grade e na visualização ampliada (lightbox) automaticamente. Itens sem `src` continuam mostrando o placeholder ilustrado normalmente.
4. Recomendado: exportar as fotos em WebP ou JPG otimizado (a maioria dos editores de imagem faz isso) para o site carregar rápido.

## 4. Trocar o carrossel de banners

Cada slide é um bloco `<article class="slide">` dentro de `index.html`, na seção `<!-- HERO / CARROSSEL -->`. Copie um bloco existente para adicionar um novo banner, ou edite o texto/data/local dos que já existem.

Os banners usam uma **foto de fundo em tela cheia** (com o texto sobreposto sobre um degradê escuro):

```html
<article class="slide">
  <img class="slide-bg" src="https://exemplo.com/foto.jpg" alt="" loading="lazy">
  <div class="slide-scrim" aria-hidden="true"></div>
  <div class="slide-copy">...</div>
</article>
```

- O `alt=""` é proposital: a foto é só ambientação por trás do texto, que já descreve o evento.
- Mantenha a `<div class="slide-scrim">` sempre — é o degradê escuro que garante que o texto continue legível em cima da foto.
- Slide sem `<img class="slide-bg">` mostra só o fundo em gradiente — funciona bem como visual provisório até a foto entrar.
- Fotos com pessoas/ambiente do escritório, tiradas com boa luz, funcionam melhor que fotos muito escuras (o degradê já escurece bastante o lado esquerdo).

## 5. Botão "Solicitar evento"

O botão não abre mais um formulário deste site — ele abre o formulário do Zeev (`CONFIG.EVENT_REQUEST_URL` em `script.js`) numa janela própria, centralizada. Se o navegador bloquear o pop-up, abre em nova aba como alternativa.

O fechamento automático da janela depois do envio é responsabilidade da própria página do Zeev (é outro domínio — este site não tem como controlar isso). Pra trocar o link:

```js
const CONFIG = {
  EVENT_REQUEST_URL: 'https://cesar.zeev.it/.../request?c=...',
  ...
};
```

## 6. Painel de indicadores em tempo real

A seção **#painel** calcula tudo a partir da mesma planilha do Calendário (item 2) — não precisa de nenhuma configuração própria. Mostra: total de eventos, quantos estão confirmados, quantos são estratégicos, quantos são ligados à Diretoria (cluster "Board"), quantos têm esforço alto, eventos por mês, locais mais usados e categorias mais frequentes.

## 7. Personalizar marca (cores, logo, nome)

As cores e tipografia ficam centralizadas no topo de `styles.css`, no bloco `:root`:

```css
--orange: #FF6A1F;   /* cor principal */
--amber: #FFB648;    /* destaque secundário / script */
--bg: #0A0908;        /* fundo */
--off-white: #F7F2E9; /* texto e nav */
```

O nome "Eventos CESAR" aparece no `<title>` do `index.html`, no `.logo` do cabeçalho/rodapé e no rodapé — busque por "CESAR" pra trocar em todos os lugares de uma vez. Pra usar uma logo em imagem no lugar do texto, troque o conteúdo de `<a class="logo">`.

## 8. Trocar/atualizar a Política de Eventos

A seção **#politica** linka direto pro arquivo `documentos/Politica_Eventos_CESAR.pdf`. Pra atualizar:

1. Substitua o arquivo em `documentos/` mantendo o mesmo nome (ou troque o nome e ajuste os dois links em `index.html`, na seção `<!-- POLÍTICA DE EVENTOS -->` — um no botão "Abrir PDF completo" e outro no rodapé da seção).
2. Se as categorias/prazos do resumo em cards mudarem, edite o texto direto nos 4 blocos `.policy-card` da mesma seção.

## 9. Publicar o site

Qualquer serviço de hospedagem estática funciona (não precisa de servidor Node/backend):

- **GitHub Pages** — suba os arquivos num repositório e ative Pages nas configurações.
- **Netlify / Vercel** — arraste a pasta do projeto direto na interface, ou conecte um repositório Git.
- **Servidor interno** — copie os arquivos pra qualquer servidor web (Apache, Nginx, IIS).

Não é necessário nenhum passo de build — os arquivos (`index.html`, `styles.css`, `script.js`, `documentos/`) já são o site final.

## Checklist antes de divulgar

- [ ] Planilha de eventos com dados reais e compartilhada como "Qualquer pessoa com o link → Leitor"
- [ ] Fotos reais na galeria (ou ao menos os placeholders revisados)
- [ ] Link do Zeev (`CONFIG.EVENT_REQUEST_URL`) testado — o formulário abre e fecha como esperado
- [ ] Links de redes sociais no rodapé (`href="#"` → URLs reais)
- [ ] E-mail de contato real (`eventos@cesar.org.br` → e-mail real da equipe)
- [ ] PDF da Política de Eventos atualizado, se necessário
