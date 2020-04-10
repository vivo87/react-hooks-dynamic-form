import { useState, useEffect, useCallback } from "react";

import { Field, FieldValueType, FieldSettings } from "./field";
import { generateFormData, updateFormField, validateField, validateForm } from "./utils";

/**
 * Form data with fields map
 */
export interface FormData {
  [fieldName: string]: Field;
}

/**
 * Field values map { [name]: value}
 */
export interface FormValues {
  [fieldName: string]: FieldValueType;
}

/**
 * Form API client interface
 */
export interface FormApi {
  isInit: boolean;
  values: FormValues;
  setFieldValue: (name: string, value: FieldValueType) => void;
  validateField: (name: string) => void;
  validateForm: () => void;
  getFieldInputError: (fieldName: string) => string | null;
  resetForm: () => void;
}

/**
 * Form API library entry point to generate and reuse all Form API function
 * @param fields
 * @param defaultSettings
 * @param remoteValues
 */
export const useFormApi = (
  fields: FieldSettings[],
  defaultSettings?: Partial<FieldSettings>,
  remoteValues?: Partial<FormValues>
): FormApi => {
  const [formData, setFormData] = useState<FormData | null>(() =>
    // Init once without remote value
    generateFormData(fields, defaultSettings)
  );

  useEffect(() => {
    // Remote values can be lazily loaded
    if (remoteValues) {
      setFormData(currentFormData =>
        Object.entries(remoteValues).reduce(
          (updatedData, [name, value]) => updateFormField(updatedData, name, value),
          currentFormData as FormData
        )
      );
    }
  }, [remoteValues]);

  const resetForm = useCallback(() => {
    const data = generateFormData(fields, defaultSettings, remoteValues);
    setFormData(data);
  }, [fields, defaultSettings, remoteValues]);

  const handleFieldChange = useCallback((name: string, value: FieldValueType) => {
    setFormData(currentFormData => updateFormField(currentFormData as FormData, name, value));
  }, []);

  const handleFieldValidate = useCallback((name: string) => {
    setFormData(currentFormData => validateField(currentFormData as FormData, name));
  }, []);

  const handleFormValidate = useCallback(() => {
    const { isValid, updatedData } = validateForm(formData as FormData);
    setFormData(updatedData);
    return isValid;
  }, [formData]);

  const getFieldInputError = useCallback(
    (name: string) => (formData ? formData[name].getInputError() : null),
    [formData]
  );

  const values: FormValues = fields.reduce(
    (acc, { name }) => ({
      ...acc,
      ...(formData && name && formData[name] ? { [name]: formData[name].value } : {}),
    }),
    {}
  );

  return {
    isInit: !!formData,
    values,
    setFieldValue: handleFieldChange,
    validateField: handleFieldValidate,
    validateForm: handleFormValidate,
    getFieldInputError,
    resetForm,
  };
};
