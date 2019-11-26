import { useState, useEffect, useCallback } from "react";

import { FieldValueType, FieldSettings } from "./Field";
import {
  FormData,
  FormValues,
  generateFormData,
  updateFormField,
  validateField,
  validateForm,
} from "./utils";

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

//TO-DO defaultOptions : validateOnChange ...

export const useFormApi = (fields: FieldSettings[], defaultValues?: FormValues): FormApi => {
  const [formData, setFormData] = useState<FormData | null>(null);

  const resetForm = useCallback(() => {
    const data = generateFormData(fields, defaultValues);
    setFormData(data);
  }, [fields, defaultValues]);

  useEffect(() => {
    // 1st init when fields or defaultValues change
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
