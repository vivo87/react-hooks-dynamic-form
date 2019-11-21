import { useState, useEffect, useCallback } from "react";

import { Field, FieldSettings } from "../Field";

export interface FormUtils {
  isValid: boolean;
  data: FormData | null;
  onFieldChange: () => object;
  isFieldInputError: (fieldName: string) => boolean;
}
export interface FormData {
  [fieldName: string]: Field;
}
export interface DefaultValues {
  [fieldName: string]: any;
}

/**
 * Generate form data by normalizing fields settings array
 * @param fields Array field settings
 * @param defaultValues fields values from parent
 */
export const generateFormData = (
  fields: FieldSettings[],
  defaultValues?: DefaultValues
): FormData => {
  const allFields = fields.reduce<FieldSettings[]>(
    (acc, field) => acc.concat(field.type === "fieldset" ? field.children || [] : field),
    []
  );

  return allFields.reduce((acc, fieldSettings) => {
    const field = new Field(fieldSettings);
    // Init Field state
    field.setPristine(true);
    field.setError(null);
    if (defaultValues && defaultValues[field.name]) {
      field.value = defaultValues[field.name];
    }

    switch (field.type) {
      case "email":
        // Auto add a default email validation
        //field.type = "text";
        field.customValidations.push({
          validate: (value: string) => {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (!field.isRequired && !value) || (!!value && regex.test(value.trim()));
          },
          errorMessage: "Veuillez saisir un email valide",
        });
        break;
      case "phone":
        // Auto add a default french phone validation
        field.type = "text";
        field.customValidations.push({
          validate: (value: string) => {
            const regex = /^(0[1-68])(?:[ _.-]?(\d{2})){4}$/;
            return (!field.isRequired && !value) || (!!value && regex.test(value.trim()));
          },
          errorMessage: "Veuillez saisir un téléphone valide",
        });
        break;
      default:
        break;
    }

    return {
      ...acc,
      [field.name]: field,
    };
  }, {});
};

export const useFormUtils = (fields: FieldSettings[], defaultValues?: DefaultValues): FormUtils => {
  const [formData, setFormData] = useState<FormData | null>(null);

  const resetForm = useCallback(() => {
    const data = generateFormData(fields, defaultValues);
    setFormData(data);
  }, [fields, defaultValues]);

  useEffect(() => {
    // 1st init when fields or defaultValues change
    resetForm();
  }, [resetForm]);

  return {
    isValid: false,
    data: formData,
    onFieldChange: (): object => ({}),
    isFieldInputError: (): boolean => true,
  };
};
