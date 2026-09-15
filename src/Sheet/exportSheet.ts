// Most of it was AI generated, i was just lazy



/**
 * Utilities to export a Sheet model as JSON.
 * Works in the browser (triggers download) and in Node (writes file via fs).
 */

export type ExportResult = { success: true; path?: string } | { success: false; error: string };

function safeStringify(obj: unknown, space = 2) {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
    if (typeof value === 'symbol') return value.toString();
    if (typeof Node !== 'undefined' && value instanceof Node) return `[Node: ${value && (value as any).nodeName}]`;
    if (value && typeof value === 'object') {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  }, space);
}

export type ExportOptions = { values?: any };
export async function writeExportData(data: string, filename = 'sheet.json'): Promise<ExportResult> {
  // Browser: trigger download
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      // Some environments require the anchor to be in the DOM
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  }

  // Node: try writing to disk
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    fs.writeFileSync(filename, data, 'utf8');
    return { success: true, path: filename };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// Export only the sheet model (no instance values)
export async function exportSheetModel(sheet: unknown, filename = 'sheet-model.json'): Promise<ExportResult> {
  const exportObj: any = { typeExport: 'sheetModel', sheet };
  const data = safeStringify(exportObj, 2);
  return writeExportData(data, filename);
}

const isPrimitive = (v: any) => v === null || (typeof v !== 'object' && typeof v !== 'function');
const isArrayOfPrimitives = (arr: any[]) => arr.every(isPrimitive);

/**
   * Detect keys that represent composite parents (arrays of objects or section-like objects)
   */
function detectCompositeParents(obj: Record<string, any>) {
  const parents = new Set<string>();
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') {
      if (Array.isArray(v) && v.length && v.every(it => it && typeof it === 'object')) {
        parents.add(k);
        continue;
      }
      if (!Array.isArray(v) && (v.components || v.rowLength || v.id)) {
        parents.add(k);
        continue;
      }
    }
  }
  return parents;
}

/**
   * For each composite parent, collect primitive sub-values whose keys start with `${parent}-`
   * Returns a map parent -> group and a set of used keys
   */
function groupCompositeValues(obj: Record<string, any>, parents: Set<string>) {
  const groups: Record<string, Record<string, any>> = {};
  const used = new Set<string>();
  for (const parent of parents) {
    const group: Record<string, any> = {};
    const indices = new Set<string>();
    for (const [k, v] of Object.entries(obj)) {
      if (!k.startsWith(parent + '-')) continue;
      if (isPrimitive(v) || (Array.isArray(v) && isArrayOfPrimitives(v))) {
        group[k] = v;
        used.add(k);
        const match = k.match(new RegExp('^' + parent + '-(\\d+)(?:-|$)'));
        if (match) indices.add(match[1]);
      }
    }
    // numberOfEntries: prefer explicit array length if parent is an array in the values
    if (Array.isArray(obj[parent])) {
      group['numberOfEntries'] = obj[parent].length;
    } else if (indices.size) {
      group['numberOfEntries'] = indices.size;
    }
    if (Object.keys(group).length) groups[parent] = group;
  }
  return { groups, used } as const;
}

/** build filtered values: grouped composite values + remaining primitive keys */
function buildFilteredValues(obj: Record<string, any>) {
  const result: Record<string, any> = {};
  const parents = detectCompositeParents(obj);
  const { groups, used } = groupCompositeValues(obj, parents);
  // attach grouped composite values
  for (const [p, g] of Object.entries(groups)) result[p] = g;
  // attach remaining primitive keys
  for (const [k, v] of Object.entries(obj)) {
    if (used.has(k)) continue;
    if (parents.has(k)) continue;
    if (isPrimitive(v) || (Array.isArray(v) && isArrayOfPrimitives(v))) result[k] = v;
  }
  return result;
}

// Export only the sheet data (values) — include identifying info
export async function exportSheetData(sheetId: string | undefined, values: any, username?: string, filename?: string): Promise<ExportResult> {
  const filteredValues = values && typeof values === 'object' ? buildFilteredValues(values) : {};

  const exportObj: any = { typeExport: 'sheetData', sheetId: sheetId || null, username: username || null, values: filteredValues };
  const fn = filename || (username ? `${username}_${sheetId || 'sheet'}.json` : `sheetdata_${sheetId || 'sheet'}.json`);
  const data = safeStringify(exportObj, 2);
  return writeExportData(data, fn);
}


// not used currently
export async function copySheetToClipboard(sheet: unknown): Promise<ExportResult> {
  const data = safeStringify(sheet, 2);
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  }
  return { success: false, error: 'Clipboard API not available' };
}

