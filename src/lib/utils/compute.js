import { Parser } from 'expr-eval';

export function evaluateExpression(expr, values = {}) {
  if (expr === null || expr === undefined || expr === '') return '';
  try {
    // Normaliza "Math.floor(...)" -> "floor(...)" para compatibilidade com expr-eval
    const normalized = String(expr).replace(/Math\./g, '');

    const parser = new Parser();
    const parsed = parser.parse(normalized);

    const scope = {};
    // converte valores para números (fallback 0)
    for (const [k, v] of Object.entries(values || {})) {
      const num = v === '' || v === null || v === undefined ? 0 : Number(v);
      scope[k] = isNaN(num) ? 0 : num;
    }

    // expõe funções matemáticas usadas nas expressões
    scope.abs = Math.abs;
    scope.ceil = Math.ceil;
    scope.floor = Math.floor;
    scope.round = Math.round;
    scope.max = Math.max;
    scope.min = Math.min;
    scope.pow = Math.pow;
    scope.sqrt = Math.sqrt;
    scope.sin = Math.sin;
    scope.cos = Math.cos;
    scope.tan = Math.tan;
    scope.log = Math.log;
    scope.exp = Math.exp;

    return parsed.evaluate(scope);
  } catch (e) {
    return '';
  }
}
