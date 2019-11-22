export type FieldValueType = string | number | object | Array<string | number | object> | null;
export type FieldCustomValidationType = {
  // TO-DO add second parameter formData
  validate: (value: FieldValueType) => boolean;
  errorMessage: string;
};

export abstract class FieldSettings {
  name: string;
  type: string;
  isRequired?: boolean = false;
  label?: string;
  placeholder?: string;
  className?: string;
  props?: object;
  render?: () => JSX.Element;
  customValidations: FieldCustomValidationType[] = [];
  // for type=fieldset only
  children?: Field[];

  // "value" field can only be set at initialization via defaultValue, use updateValue to update field value
  private _defaultValue: FieldValueType = null;
  protected _value: FieldValueType = null;
  get value(): FieldValueType {
    return this._value || this._defaultValue;
  }
  set value(val: FieldValueType) {
    this._defaultValue = val;
  }
  abstract updateValue(newValue: FieldValueType): void;
}

export class Field extends FieldSettings {
  //#region --- Form State Fields
  protected _isPristine = false;
  protected _error: string | null = null;
  //#endregion --- Form State Fields

  public constructor(init?: Partial<FieldSettings>) {
    super();
    Object.assign(this, init);
  }

  public updateValue(newValue: FieldValueType): void {
    this._value = newValue;
    this._isPristine = false;
  }
  public setPristine(isPristine: boolean): void {
    this._isPristine = isPristine;
  }
  public setError(error: string | null): void {
    this._error = error;
  }
}
