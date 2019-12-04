import { FormData } from "./form";

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
  errorMessage?: string;
};

export interface FieldErrorMessages {
  isRequired?: string;
  email?: string;
  phone?: string;
  validation?: string;
}
const DEFAULT_ERROR_MESSAGES: FieldErrorMessages = {
  isRequired: "This field is required !",
  email: "Invalid email",
  phone: "Invalid phone number",
  validation: "Invalid field value",
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

  /**
   * Custom validations methods
   */
  customValidations?: FieldCustomValidationType[] = [];

  /**
   * Error messages
   */
  errorMessages?: FieldErrorMessages;

  /**
   * Only available to "custom" type
   */
  render?: () => JSX.Element;

  /**
   * Only available to "fieldset" type
   */
  children?: Field[];

  /**
   * "value" field should only be set at initialization, use setInputValue to update field value
   */
  public value?: FieldValueType;

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

    // Default value
    if (typeof this.value === "undefined") {
      this.setDefaultValue();
    }

    // Default validations
    this.setDefaultValidations();
  }

  /**
   * PRIVATE: set default value
   */
  private setDefaultValue(): void {
    switch (this.type) {
      case FieldTypeEnum.CHECKBOX:
      case FieldTypeEnum.RADIO:
        this.value = false;
        break;
      case FieldTypeEnum.HIDDEN:
      case FieldTypeEnum.CUSTOM:
        this.value = null;
        break;
      default:
        this.value = "";
        break;
    }
  }

  private getErrorMessage(key: keyof FieldErrorMessages): string {
    return (this.errorMessages && this.errorMessages[key]) || DEFAULT_ERROR_MESSAGES[key] || "";
  }

  /**
   * PRIVATE: set default validations
   */
  private setDefaultValidations(): void {
    // By default, only one of the 2 trigger type
    this.validateOnBlur = !this.validateOnChange;

    // Init customValidations with empty array
    if (!Array.isArray(this.customValidations)) {
      this.customValidations = [];
    }

    switch (this.type) {
      case FieldTypeEnum.EMAIL:
        // Auto add a default email validation
        //this.type = "text";
        this.customValidations.push({
          validate: (value: FieldValueType) => {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (
              (!this.isRequired && !value) || (!!value && regex.test((value as string).trim()))
            );
          },
          errorMessage: this.getErrorMessage("email"),
        });
        break;
      case FieldTypeEnum.PHONE:
        // Auto add a default phone validation
        this.type = "text";
        this.customValidations.push({
          validate: (value: FieldValueType) => {
            const regex = /^(\d)(?:[ _.-]?(\d))+$/;
            return (
              (!this.isRequired && !value) || (!!value && regex.test((value as string).trim()))
            );
          },
          errorMessage: this.getErrorMessage("phone"),
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
   * Return error message if field is error and not pristine
   * @param {object} field field object
   * @returns {boolean}
   */
  public getInputError = (): string | null => (!this._isPristine ? this._error : null);

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
          ? this.getErrorMessage("isRequired")
          : null;
    }

    if (!this._error && Array.isArray(this.customValidations)) {
      const validationFailed = this.customValidations.find(
        validation => !validation.validate(this.value, formData)
      );
      this._error = validationFailed ? this.getErrorMessage("validation") : null;
    }

    return !this._error;
  }
}
