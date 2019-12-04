import { useState, useEffect, useCallback } from "react";

import { Field, FieldValueType, FieldSettings, FieldErrorMessages } from "./field";
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
  isValid: boolean;
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
  remoteValues?: FormValues
): FormApi => {
  const [formData, setFormData] = useState<FormData | null>(null);

  // TO-DO BUG IF defaultSettings is inline setup => infinity loop
  const resetForm = useCallback(() => {
    const data = generateFormData(fields, defaultSettings, remoteValues);
    setFormData(data);
  }, [fields, defaultSettings, remoteValues]);

  useEffect(() => {
    // 1st init when fields or  remoteValues change
    resetForm();
  }, [resetForm]);

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
      ...(formData && formData[name] ? { [name]: formData[name].value } : {}),
    }),
    {}
  );

  return {
    isInit: !!formData,
    isValid: false,
    values,
    setFieldValue: handleFieldChange,
    validateField: handleFieldValidate,
    validateForm: handleFormValidate,
    getFieldInputError,
    resetForm,
  };
};
