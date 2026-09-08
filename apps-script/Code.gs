/**
 * EVENTOS CESAR — Code.gs
 * Backend do formulário "Solicitar evento" e do painel de indicadores,
 * usando Google Apps Script como Web App. Recebe os dados do site, grava
 * uma linha numa planilha do Google Sheets e, se houver anexo, salva o
 * arquivo numa pasta do Google Drive e grava o link na planilha. O mesmo
 * Web App também devolve os dados em JSON (GET) pra alimentar o painel
 * de indicadores em tempo real.
 *
 * COMO PUBLICAR (passo a passo completo também está no README.md):
 *   1. Crie uma planilha nova no Google Sheets (ex.: "Eventos CESAR —
 *      Solicitações").
 *   2. Nela, abra Extensões > Apps Script.
 *   3. Apague o conteúdo padrão de Code.gs e cole este arquivo inteiro.
 *   4. Clique em Implantar > Nova implantação > tipo "App da Web".
 *        - Executar como: Eu (sua conta)
 *        - Quem pode acessar: Qualquer pessoa
 *   5. Autorize as permissões pedidas (Planilhas + Drive).
 *   6. Copie a URL do Web App gerada.
 *   7. Cole essa URL em CONFIG.APPS_SCRIPT_URL no arquivo script.js do site.
 *
 * IMPORTANTE (envio do formulário): o site envia a solicitação em modo
 * "no-cors" (limitação do Apps Script, que não responde ao preflight de
 * CORS por padrão). Isso significa que o navegador não consegue ler a
 * resposta real deste script — o site trata "sem erro de rede" como
 * sucesso. Por isso, é importante testar o fluxo end-to-end (enviar uma
 * solicitação de teste e conferir se a linha aparece na planilha) antes
 * de divulgar o site.
 *
 * IMPORTANTE (painel de indicadores): a leitura (GET) já costuma
 * funcionar direto com fetch() normal (sem no-cors), porque a URL do
 * Web App do Apps Script responde com cabeçalhos que permitem leitura
 * entre origens. Se isso não acontecer na sua conta/organização, o
 * painel cai automaticamente pra dados de exemplo e avisa na tela — o
 * site continua funcionando normalmente, só sem os números reais.
 */

// Nome da aba onde as solicitações serão gravadas.
const SHEET_NAME = 'Solicitações';

// Nome da pasta no Google Drive onde os anexos serão salvos.
// Criada automaticamente na primeira solicitação, dentro do Drive da
// conta usada para publicar o Web App.
const ATTACHMENTS_FOLDER_NAME = 'Eventos CESAR — Anexos de solicitações';

// Cada coluna da planilha: `key` é o nome usado no JSON (site ↔ painel),
// `header` é o texto que aparece na primeira linha da planilha.
const COLUMNS = [
  { key: 'enviadoEm', header: 'Enviado em' },
  { key: 'nome', header: 'Nome' },
  { key: 'email', header: 'E-mail' },
  { key: 'departamento', header: 'Departamento' },
  { key: 'tipoEvento', header: 'Tipo de evento' },
  { key: 'dataDesejada', header: 'Data desejada' },
  { key: 'local', header: 'Local desejado' },
  { key: 'convidados', header: 'Nº de convidados' },
  { key: 'orcamento', header: 'Orçamento estimado (R$)' },
  { key: 'coffeeBreak', header: 'Coffee break' },
  { key: 'descricao', header: 'Descrição / objetivo' },
  { key: 'anexo', header: 'Anexo' },
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    let attachmentUrl = '';
    if (payload.anexo && payload.anexo.dados) {
      attachmentUrl = saveAttachment_(payload);
    }

    const row = COLUMNS.map((col) => {
      switch (col.key) {
        case 'enviadoEm':
          return payload.enviadoEm ? new Date(payload.enviadoEm) : new Date();
        case 'anexo':
          return attachmentUrl;
        case 'coffeeBreak':
          return payload.coffeeBreak ? 'Sim' : 'Não';
        case 'convidados':
        case 'orcamento':
          return payload[col.key] === '' || payload[col.key] == null ? '' : Number(payload[col.key]);
        default:
          return payload[col.key] || '';
      }
    });
    sheet.appendRow(row);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

// GET: devolve todas as solicitações em JSON, pro painel de indicadores
// do site montar os gráficos com dados reais. Sem dados sensíveis além
// dos já preenchidos no formulário (não há autenticação — não coloque
// campos confidenciais no formulário se a planilha não for só interna).
function doGet() {
  try {
    const sheet = getOrCreateSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return jsonResponse_({ ok: true, data: [] });

    const values = sheet.getRange(2, 1, lastRow - 1, COLUMNS.length).getValues();
    const data = values.map((row) => {
      const obj = {};
      COLUMNS.forEach((col, i) => {
        const cell = row[i];
        obj[col.key] = cell instanceof Date ? cell.toISOString() : cell;
      });
      return obj;
    });

    return jsonResponse_({ ok: true, data: data });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err), data: [] });
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    const headerRow = COLUMNS.map((col) => col.header);
    sheet.appendRow(headerRow);
    sheet.getRange(1, 1, 1, headerRow.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateFolder_() {
  const folders = DriveApp.getFoldersByName(ATTACHMENTS_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(ATTACHMENTS_FOLDER_NAME);
}

function saveAttachment_(payload) {
  const folder = getOrCreateFolder_();
  const bytes = Utilities.base64Decode(payload.anexo.dados);
  const blob = Utilities.newBlob(bytes, payload.anexo.tipo || 'application/octet-stream', payload.anexo.nome || 'anexo');
  const safeName = `${payload.nome || 'solicitante'} — ${blob.getName()}`.slice(0, 180);
  const file = folder.createFile(blob).setName(safeName);
  // Link visível a qualquer pessoa com o link, pra facilitar a conferência do anexo.
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
