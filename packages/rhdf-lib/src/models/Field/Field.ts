export type CustomValidationType = {
  // TO-DO add second parameter formData
  validate: (value: any) => boolean;
  errorMessage: string;
};

export abstract class FieldSettings {
  name: string;
  type: string;
  isRequired?: boolean = false;
  // "value" field can only be set at initialization, use updateValue to update field value
  private _defaultValue: any = null;
  get value(): any {
    return this._value || this._defaultValue;
  }
  set value(val: any) {
    this._defaultValue = val;
  }

  label?: string;
  placeholder?: string;
  className?: string;
  props?: object;
  render?: () => JSX.Element;
  customValidations: CustomValidationType[] = [];
  // for type=fieldset only
  children?: Field[];

  //#region --- Form State Fields
  protected _value: any = null;
  protected _isPristine = false;
  protected _error: string | null = null;
  //#endregion --- Form State Fields
}

export class Field extends FieldSettings {
  public constructor(init?: Partial<FieldSettings>) {
    super();
    Object.assign(this, init);
  }

  public updateValue(newValue: any): void {
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
