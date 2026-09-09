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

export async function exportSheet(sheet: unknown, filename = 'sheet.json', options?: ExportOptions): Promise<ExportResult> {
  let exportObj: any = sheet;
  if (options && options.values !== undefined) {
    // attach a shallow copy of values under `values`
    try {
      exportObj = { ...(sheet as any), values: options.values };
    } catch (e) {
      exportObj = { sheet, values: options.values };
    }
  }
  const data = safeStringify(exportObj, 2);

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

/**
 * Copy sheet JSON to clipboard (browser only).
 */
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

export default exportSheet;
