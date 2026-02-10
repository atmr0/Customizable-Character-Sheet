// export function getValue(values, id, defaultVal = '') {
//   return (values && id in values) ? values[id] : defaultVal;
// }

export function toNumberOrEmpty(raw: string | null | undefined) {
  if (raw === '' || raw === null || raw === undefined) return '';
  const n = Number(raw);
  return isNaN(n) ? 0 : n;
}

export function makeUid(prefix: string, id: string) {
  return `${prefix}-${id}-${Math.random().toString(36).slice(2, 7)}`;
}
