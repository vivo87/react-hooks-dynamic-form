import { useState, useEffect, useCallback } from "react";

import { FieldValueType, FieldSettings } from "./Field";
import {
  FormData,
  DefaultValues,
  generateFormData,
  updateFormField,
  validateField,
  validateForm,
} from "./utils";

export interface FormApi {
  isValid: boolean;
  data: FormData | null;
  setFieldValue: (name: string, value: FieldValueType) => void;
  validateField: (name: string) => void;
  validateForm: () => void;
  isFieldInputError: (fieldName: string) => boolean;
  resetForm: () => void;
}

export const useFormApi = (fields: FieldSettings[], defaultValues?: DefaultValues): FormApi => {
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

  const isFieldInputError = useCallback(
    (name: string) => !!formData && formData[name].isInputError(),
    [formData]
  );

  return {
    isValid: false,
    data: formData,
    setFieldValue: handleFieldChange,
    validateField: handleFieldValidate,
    validateForm: handleFormValidate,
    isFieldInputError,
    resetForm,
  };
};
