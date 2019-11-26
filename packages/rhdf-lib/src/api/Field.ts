import { FormData } from "./utils";

const DEFAULT_ISREQUIRED_MESSAGE = "This field is required";

export enum FieldTypeEnum {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PHONE = "phone",
  PASSWORD = "password",
  HIDDEN = "hidden",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  CUSTOM = "custom",
}

export type FieldValueType =
  | string
  | number
  | boolean
  | object
  | Array<string | number | boolean | object>
  | null
  | undefined;

export type FieldCustomValidationType = {
  /**
   * validate field value, formData is also passed as parameter, example of use case: validate A based on B value
   */
  validate: (value: FieldValueType, formData?: FormData) => boolean;
  errorMessage: string;
};

export abstract class FieldSettings {
  name: string;
  type?: string = "text";
  label?: string;
  placeholder?: string;
  className?: string;
  props?: object;
  validateOnChange?: boolean = false;
  validateOnBlur?: boolean;

  /**
   * isRequired: can be boolean or a function with formData as parameter, example of use case: A is required if B is filled
   */
  isRequired?: boolean | ((formData?: FormData) => boolean) = false;
  isRequiredMessage?: string;

  /**
   * Custom validations methods
   */
  customValidations?: FieldCustomValidationType[] = [];
  defaultValidationMessage?: string;

  /**
   * Only available to "custom" type
   */
  render?: () => JSX.Element;

  /**
   * Only available to "fieldset" type
   */
  children?: Field[];

  /**
   * "value" field should only be set at initialization via defaultValue, use setInputValue to update field value
   */
  public value?: FieldValueType = null;

  /**
   * Set value from user input
   * @param newValue input value
   */
  abstract setInputValue(newValue: FieldValueType): void;
}

export class Field extends FieldSettings {
  //#region --- Form State Fields
  protected _isPristine = true;
  protected _error: string | null = null;
  //#endregion --- Form State Fields

  public constructor(init?: Partial<FieldSettings>) {
    super();

    Object.assign(this, init, {
      _isPristine: true,
      _error: null,
    });

    // Default type text
    if (!this.type || Object.keys(FieldTypeEnum).includes(this.type)) {
      this.type = "text";
    }

    // By default, only one of the 2 trigger type
    this.validateOnBlur = !this.validateOnChange;

    // Init customValidations with empty array
    if (!Array.isArray(this.customValidations)) {
      this.customValidations = [];
    }

    switch (this.type) {
      case "email":
        // Auto add a default email validation
        //this.type = "text";
        this.customValidations.push({
          validate: (value: FieldValueType) => {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (
              (!this.isRequired && !value) || (!!value && regex.test((value as string).trim()))
            );
          },
          errorMessage: this.defaultValidationMessage || "Invalid email",
        });
        break;
      case "phone":
        // Auto add a default french phone validation
        this.type = "text";
        this.customValidations.push({
          validate: (value: FieldValueType) => {
            const regex = /^(0[1-68])(?:[ _.-]?(\d{2})){4}$/;
            return (
              (!this.isRequired && !value) || (!!value && regex.test((value as string).trim()))
            );
          },
          errorMessage: this.defaultValidationMessage || "Invalid phone",
        });
        break;
      default:
        break;
    }
  }

  /**
   * Set value from user input
   * @param newValue input value
   */
  public setInputValue(newValue: FieldValueType): void {
    this.value = newValue;
    this._isPristine = false;
  }

  /**
   * Return true if field is error and not pristine
   * @param {object} field field object
   * @returns {boolean}
   */
  public isInputError = (): boolean => !!this._error && !this._isPristine;

  /**
   * Validate field
   * @param formData current form data object
   */
  public validate(formData?: FormData): boolean {
    if (this.isRequired) {
      const _isRequired: boolean =
        typeof this.isRequired === "function" ? this.isRequired(formData) : this.isRequired;

      this._error =
        _isRequired &&
        (typeof this.value === "undefined" ||
          this.value === null ||
          this.value === "" ||
          this.value === false)
          ? this.isRequiredMessage || DEFAULT_ISREQUIRED_MESSAGE
          : null;
    } else if (Array.isArray(this.customValidations)) {
      const validationFailed = this.customValidations.find(
        validation => !validation.validate(this.value, formData)
      );
      this._error = validationFailed
        ? validationFailed.errorMessage || this.defaultValidationMessage || "Invalid input"
        : null;
    }

    return !this._error;
  }
}
