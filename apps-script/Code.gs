const SHEET_ID = "1-CbwEWqovegYcbDBN7zLkisptp-fO0sWNX4j_lfrI5g";
var sheet = SpreadsheetApp.openById(SHEET_ID);
var sheetName = "addrlist";

var activeSheet = sheet.getSheetByName(sheetName);
var sheetColumns = activeSheet.getRange(1, 1, 1, activeSheet.getLastColumn()).getValues()[0];

function randomString() {
  const random_str = Math.random().toString(36).slice(2);
  return random_str;
}

function convertRowToObject(row) {
  const obj = sheetColumns.reduce((t, v) => ({ ...t, [v]: null }), {});
  sheetColumns.forEach((v, idx) => {
    obj[v] = row[idx];
  });
  return obj;
}

function readSheet() {
  const rows = activeSheet.getRange(2, 1, activeSheet.getLastRow(), activeSheet.getLastColumn()).getValues().filter(e => e[0]);
  return rows.map(r => convertRowToObject(r));
}


function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doRead(e) {
  const { id, page = 0, pageSize = 25 } = e.parameter;
  const allData = readSheet();
  const offset = page * pageSize;
  let idx = -1;
  if (id) {
    idx = allData.findIndex(d => d.id === id);
  }
  if (idx == -1 && id) {
    return {
      success: false,
      message: "Not found"
    };
  }

  if (idx !== -1) {
    return { data: allData[idx] };
  } else {
    return {
      total: allData.length,
      offset: offset,
      pageSize: pageSize,
      data: allData.slice(offset, offset + pageSize)
    };
  }
}

function doWrite(e) {
  const { id, path, method = "POST", ...restProps } = e.parameter;
  const allData = readSheet();
  let idx = -1;
  if (id) {
    idx = allData.findIndex(d => d.id === id);
  }

  if (idx == -1 && id) {
    return {
      success: false,
      message: "Not found"
    };
  }


  const requestBody = restProps || {};

  switch (method) {
    case "POST":
      if (idx !== -1) {
        return {
          success: false,
          message: "Create error (id is defined)"
        };
      }
      let data = [randomString()];
      for (let i = 1; i < sheetColumns.length; i++) {
        data.push(requestBody[sheetColumns[i]]);
      }
      activeSheet.appendRow(data);
      return {
        success: true,
        data: convertRowToObject(data)
      };
    case "DELETE":
      if (idx === -1) {
        return {
          success: false,
          message: "Not found"
        };
      }
      activeSheet.deleteRow(2 + idx);
      return {
        success: true,
        data: convertRowToObject(allData[idx])
      };

    case "PUT":
      if (idx === -1) {
        return {
          success: false,
          message: "Not found"
        };
      }


      let updatedRow = [id];
      for (let i = 1; i < sheetColumns.length; i++) {
        updatedRow.push(requestBody[sheetColumns[i]] || allData[idx][sheetColumns[i]]);
      }
      const dataRange = activeSheet.getRange(2 + idx, 1, 1, sheetColumns.length);
      dataRange.setValues([updatedRow]);
      return {
        success: true,
        data: convertRowToObject(updatedRow)
      };

    default:
      return {
        success: false,
        message: "Unsupported Verb",
      };
  }
}

function handleStatic(e) {
  const { path, file } = e.parameter;
  switch (path) {
    case "/static":
      let html = HtmlService.createHtmlOutputFromFile(file);
      html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      return html;
  }
}

function handleSheetAction(e, requestMethod) {
  const { method = requestMethod, path } = e.parameter;
  let responseData = null;
  if (path === `/${sheetName}`) {
    switch (method) {
      case "GET":
        responseData = doRead(e);
        break;
      case "POST":
      case "PUT":
      case "DELETE":
        responseData = doWrite(e);
        break;
      default:
        responseData = null;
    }
    if (responseData) {
      return responseJson({ success: true, ...responseData });
    }
    return responseJson({
      success: false
    });
  } else {
    handleStatic(e);
  }
}

function handleRequest(e) {
  const { path } = e.parameter;
  switch (path) {
    case "/addrlist":
      return handleSheetAction(e);
    default:
      return handleStatic(e);
  }
}

function doGet(e) {
  return handleRequest(e);
}


