import { Field, FieldTypeEnum, FieldValueType, FieldSettings } from "./Field";

export interface FormData {
  [fieldName: string]: Field;
}
export interface FormValues {
  [fieldName: string]: FieldValueType;
}
export interface ValidationResult<T extends Field | FormData> {
  isValid: boolean;
  updatedData: T;
}

/**
 * Generate form data by normalizing fields settings array
 * @param fields Array field settings
 * @param defaultValues fields values from parent
 */
export const generateFormData = (fields: FieldSettings[], defaultValues?: FormValues): FormData => {
  const allFields = fields.reduce<FieldSettings[]>(
    (acc, field) => acc.concat(field.type === "fieldset" ? field.children || [] : field),
    []
  );

  return allFields.reduce((acc, fieldSettings) => {
    // Precheck fieldSettings
    const { name } = fieldSettings;
    if (!name) {
      return acc;
    }
    const field = new Field({
      ...fieldSettings,
      ...(defaultValues && defaultValues[name] ? { value: defaultValues[name] } : {}),
    });
    return {
      ...acc,
      [field.name]: field,
    };
  }, {});
};

/**
 * Update formData object with modified field value
 * @param formData current form data object
 * @param fieldName field name
 * @param newValue field new value
 * @returns updated formData
 */
export const updateFormField = (
  formData: FormData,
  fieldName: string,
  newValue: FieldValueType
): FormData => {
  if (!formData[fieldName]) {
    return formData;
  }
  const field = formData[fieldName];
  field.setInputValue(newValue);

  if (field.validateOnChange) {
    field.validate(formData);
  }

  // Immutable to allow update
  return {
    ...formData,
  };
};

/**
 * Validate field, update field state (pristine, error)
 * @param fieldName field name
 * @param formData current form data object
 */
export const validateField = (formData: FormData, fieldName: string): FormData => {
  formData[fieldName].validate(formData);

  return {
    ...formData,
  };
};

/**
 * Validate form, update form state
 * @param formData current form data object
 */
export const validateForm = (formData: FormData): ValidationResult<FormData> => {
  let isValid = true;
  for (const field of Object.values(formData)) {
    isValid = isValid && field.validate(formData);
  }
  return {
    isValid,
    // Immutable to allow update
    updatedData: {
      ...formData,
    },
  };
};
