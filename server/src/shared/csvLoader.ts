import { promises as fsPromises } from "fs";

function objectLoader(headers, data) {
  var obj = {},
    c = 0,
    len = headers.length;
  for (c; c < len; c += 1) {
    obj[headers[c]] = data[c];
  }
  return obj;
}

function loadWithHeaders(headers) {
  return function (data) {
    return objectLoader(headers, data);
  };
}

type Options = {
  withHeaders?: boolean;
  intoObjects?: boolean;
};

function processData(
  data,
  { withHeaders = true, intoObjects = true } = {} as Options
) {
  var rows = data.toString().replace(/"/g, "").split("\n"),
    len = rows.length,
    csv = {} as any;
  if (withHeaders === true) {
    csv.headers = rows[0].split(",");
    // skip headers row in parsing
    rows.shift();
    len--;
  }

  var loader = intoObjects
    ? loadWithHeaders(csv.headers)
    : function (data) {
        return data;
      };

  for (var i = 0; i < len; i += 1) {
    rows[i] = loader(rows[i].split(","));
  }

  csv.data = rows;
  return csv;
}

export async function loadCSV(filePath: string, options?: Options) {
  try {
    const data = await fsPromises.readFile(filePath);
    return { data: processData(data, options) };
  } catch (e) {
    return { error: e };
  }
}
