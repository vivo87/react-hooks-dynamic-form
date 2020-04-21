import { FormData } from "./form";

/**
 * [TYPE] Available value for field "type"
 */
export enum FieldTypeEnum {
  /**
   * HTML Text input
   */
  TEXT = "text",
  /**
   * HTML Number input
   */
  NUMBER = "number",
  /**
   * Text input with default email format validation
   */
  EMAIL = "email",
  /**
   * Text input with general phone format validation
   */
  PHONE = "phone",
  /**
   * HTML password input
   */
  PASSWORD = "password",
  /**
   * HTML hidden input
   */
  HIDDEN = "hidden",
  /**
   * HTML textarea
   */
  TEXTAREA = "textarea",
  /**
   * Generated checkbox
   * (only applicable to Form Component)
   */
  CHECKBOX = "checkbox",
  /**
   * Generated radio button
   * (only applicable to Form Component)
   */
  RADIO = "radio",
  /**
   * User's custom rendered field
   * (only applicable to Form Component)
   */
  CUSTOM = "custom",
}

/**
 * [TYPE] Available type for field value
 */
export type FieldValueType =
  | string
  | number
  | boolean
  | object
  | Array<string | number | boolean | object>
  | null
  | undefined;

/**
 * [TYPE] Custom validation rule
 */
export type FieldCustomValidatorType = {
  /**
   * Validation method - a predicate with formData as parameter in case of conditional validation based on other field
   */
  validate: (value: FieldValueType, formData?: FormData) => boolean;
  /**
   * Error message for this validation rule
   */
  errorMessage?: string;
};

/**
 * [TYPE] Validation error messages
 */
export interface FieldErrorMessages {
  /**
   * isRequired error message
   */
  isRequired?: string;
  /**
   * Email format error message
   * (only applicable to "email" type)
   */
  email?: string;
  /**
   * Phone format error message
   * (only applicable to "phone" type)
   */
  phone?: string;
  /**
   * Default validation error message
   */
  default?: string;
}
const DEFAULT_ERROR_MESSAGES: FieldErrorMessages = {
  isRequired: "This field is required",
  email: "Invalid email",
  phone: "Invalid phone number",
  default: "Invalid field value",
};

/**
 * [TYPE] Field settings
 */
export abstract class FieldSettings {
  //#region --- Common settings for Form API and Form Component

  /**
   * HTML name attribute, also used as field identifier in the form, must be unique
   */
  name: string;
  /**
   * Field type that will be use for adding default validation rule and render method when using Form component
   */
  type?: string = "text";
  /**
   * Initial field value
   */
  value?: FieldValueType;
  /**
   * If true, the field is required for validation. Can be a predicate with formData as parameter in case of conditional validation based on other field
   */
  isRequired?: boolean | ((formData?: FormData) => boolean) = false;
  /**
   * Custom validation rules
   */
  customValidators?: FieldCustomValidatorType[] = [];
  /**
   * Validation error messages
   */
  errorMessages?: FieldErrorMessages;
  /**
   * If true, validate field on change, otherwise validate on blur by default
   */
  validateOnChange?: boolean = false;

  //#endregion --- Common settings for Form API and Form Component

  //#region --- Settings only applicable to Form Component
  /**
   * Field label
   * (only applicable to Form Component)
   */
  label?: string;
  /**
   * Field placeholder
   * (only applicable to Form Component)
   */
  placeholder?: string;
  /**
   * Field HTML class
   * (only applicable to Form Component)
   */
  className?: string;
  /**
   * Label HTML class
   * (only applicable to Form Component)
   */
  labelClassName?: string;
  /**
   * Wrapper (for label + field) HTML class
   * (only applicable to Form Component)
   */
  wrapperClassName?: string;
  /**
   * Field extra props
   * (only applicable to Form Component)
   */
  props?: Record<string, any>;
  /**
   * Field render method applicable to "custom" type
   * (only applicable to Form Component)
   */
  render?: () => JSX.Element;

  /**
   * Field children applicable to "fieldset" type
   * (only applicable to Form Component)
   */
  children?: Field[];

  /**
   * If true, validate field on blur. Applicable to build-in text type (resulting in HTML input or textarea). Default assigned to reverse value of validateOnChange
   * (only applicable to Form Component)
   */
  validateOnBlur?: boolean;

  //#endregion --- Settings only applicable to Form Component
}

export class Field extends FieldSettings {
  //#region --- Private State

  private _error: string | null = null;
  private _isPristine = true; // Not sure yet for a use case

  //#endregion --- Private State

  public constructor(init?: FieldSettings) {
    super();

    Object.assign(this, init, {
      _error: null,
      _isPristine: true,
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
   * Get error message
   * @param key error key
   */
  private getErrorMessage(key: keyof FieldErrorMessages): string {
    return (this.errorMessages && this.errorMessages[key]) || DEFAULT_ERROR_MESSAGES[key] || "";
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
      case FieldTypeEnum.CUSTOM:
        this.value = null;
        break;
      default:
        this.value = "";
        break;
    }
  }

  /**
   * PRIVATE: set default validations
   */
  private setDefaultValidations(): void {
    // [Optimization]: avoid unnecessary trigger
    if (this.validateOnChange && this.validateOnBlur) {
      this.validateOnBlur = false;
    }

    // Init customValidators with empty array
    if (!Array.isArray(this.customValidators)) {
      this.customValidators = [];
    }

    switch (this.type) {
      case FieldTypeEnum.EMAIL:
        // --- Auto add a default email validation
        // Keep HTML email type for some browser default validation
        // this.type = "text";
        this.customValidators.push({
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
        // --- Auto add a default phone validation
        this.type = "text";
        this.customValidators.push({
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
    // Temporarily reset error till next validation
    this._error = null;
    this.value = newValue;
    this._isPristine = false;
  }

  /**
   * Return error message if field is error after validation
   */
  public getInputError = (): string | null => this._error;

  /**
   * Validate field
   * @param formData current form data object
   */
  public validate(formData?: FormData): boolean {
    // Reset error
    this._error = null;

    // 0 is a valid value :P
    const hasValue = !(
      typeof this.value === "undefined" ||
      this.value === null ||
      this.value === "" ||
      this.value === false
    );

    if (this.isRequired) {
      const _isRequired: boolean =
        typeof this.isRequired === "function" ? this.isRequired(formData) : this.isRequired;
      this._error = _isRequired && !hasValue ? this.getErrorMessage("isRequired") : null;
    }

    // isRequired passed, check next rules if field has a value
    if (!this._error && hasValue && Array.isArray(this.customValidators)) {
      const validationFailed = this.customValidators.find(
        validation => !validation.validate(this.value, formData)
      );
      this._error = validationFailed
        ? validationFailed.errorMessage || this.getErrorMessage("default")
        : null;
    }

    return !this._error;
  }
}
