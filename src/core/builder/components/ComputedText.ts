import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";
import { Parser } from 'expr-eval';
import { updateValueStore } from "@core/valuesStore";

export class ComputedText extends BaseComponent {
  type: string = Constants.ComputedText;
  expr?: string;
  format: (value: any) => string = (value) => String(value);
  public value: number | string = 0;

  private lastValue: any = undefined;

  constructor(init?: Partial<ComputedText>) {
    super(init);
    this.setValueStoreHandler(v => {
      if (this.expr) {
        try {
           let newValue = this.evaluateExpression(v || {});
          if (this.id && newValue !== this.lastValue) {
            updateValueStore(this.id, newValue);
            this.lastValue = newValue;
          }
        } catch (e) {
          console.error(e)
        }
      }
    });
  }
  public evaluateExpression(values = {}): string {
    if (!this.expr) return ''
    try {
      const normalized = String(this.expr).replace(/Math\./g, '');

      const parser = new Parser();
      const parsed = parser.parse(normalized);

      const scope: any = {};
      for (const [k, v] of Object.entries(values || {})) {
        const num = v === '' || v === null || v === undefined ? 0 : Number(v);
        scope[k] = isNaN(num) ? 0 : num;
      }

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
      scope.exp = Math.exp;
      this.value = parsed.evaluate(scope);
      return String(this.value);
    } catch (e) {
      return '';
    }
  }

  public setValue(value: string|undefined) {
    this.expr = value;
    this.updateValueStore(this.id!, this.expr);
  }

  public getValue(): string|undefined {
    return this.expr;
  }
  public getValueFormatted(): string {
    return this.format(this.value);
  }

  public destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
