/**
 * Utilities to import a Sheet model from JSON.
 * Browser: via File object. Node: via fs path.
 */

export type ImportResult = { success: true; sheet: any } | { success: false; error: string };

export async function parseSheetFromJSON(json: string): Promise<ImportResult> {
  try {
    const obj = JSON.parse(json);
    return { success: true, sheet: obj };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

export async function importSheetFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve({ success: false, error: 'Erro ao ler o arquivo' });
    reader.onload = () => {
      const text = String(reader.result || '');
      resolve(parseSheetFromJSON(text));
    };
    reader.readAsText(file, 'utf-8');
  });
}

export async function importSheetFromPath(path: string): Promise<ImportResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const text = fs.readFileSync(path, 'utf8');
    return parseSheetFromJSON(text);
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

export default parseSheetFromJSON;
